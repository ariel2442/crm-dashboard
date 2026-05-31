<?php
/**
 * track.php — public endpoint (no auth needed).
 * Called from the client-facing proposal page to record views and signatures.
 */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }

$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $body['action'] ?? 'view';
$id     = $body['id']     ?? '';

if (!$id) fail('חסר ID');

$q = findById('quotes', $id);
if (!$q) fail('הצעה לא נמצאה', 404);

$now = date('c');
$s   = getSettings();

// ── View / Open ─────────────────────────────────────────────────
if ($action === 'view' || $action === 'open') {
    $duration = max(0, intval($body['durationSeconds'] ?? 0));
    $ip       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    $ua       = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $views              = array_slice(array_merge([['viewedAt' => $now, 'ip' => $ip, 'ua' => $ua, 'duration' => $duration]], $q['views'] ?? []), 0, 50);
    $q['views']         = $views;
    $q['totalViews']    = ($q['totalViews']    ?? 0) + 1;
    $q['totalViewSecs'] = ($q['totalViewSecs'] ?? 0) + $duration;
    if (empty($q['firstViewedAt'])) $q['firstViewedAt'] = $now;
    $q['lastViewedAt']  = $now;

    if (in_array($q['quoteStatus'] ?? 'draft', ['draft', 'sent'])) $q['quoteStatus'] = 'viewed';

    upsert('quotes', $q);

    // WhatsApp to sales rep (throttle 3h)
    $lastNotified = $q['lastNotifiedAt'] ?? '';
    $shouldNotify = !$lastNotified || (time() - strtotime($lastNotified)) > 3 * 3600;
    $repPhone     = $q['salesRepPhone'] ?? ($s['salesRepPhone'] ?? '');

    if ($shouldNotify && $repPhone && !empty($s['autoRepView'])) {
        $baseUrl = rtrim($s['baseUrl'] ?? '', '/');
        $link    = $baseUrl ? $baseUrl . '/quote/?id=' . $id : '';
        $vars    = ['name' => $q['clientName'] ?? 'לקוח', 'num' => $q['proposalNum'] ?? '', 'link' => $link];
        $tplKey  = $lastNotified ? 'msgViewReturn' : 'msgViewFirst';
        $default = $lastNotified
            ? "👀 {name} חזר/ה לצפות בהצעה!\n📄 #{num}\n🔗 {link}"
            : "🎉 {name} פתח/ה את הצעת המחיר!\n📄 #{num}\n🔗 {link}\n\nזה הזמן לסגור 💪";
        if (sendWhatsapp($repPhone, tpl($s[$tplKey] ?? $default, $vars))) {
            $q['lastNotifiedAt'] = $now;
            upsert('quotes', $q);
        }
    }

    ok(['totalViews' => $q['totalViews'], 'status' => $q['quoteStatus']]);
}

// ── Sign ────────────────────────────────────────────────────────
if ($action === 'sign') {
    $signerName    = $body['signerName']    ?? '';
    $paymentMethod = $body['paymentMethod'] ?? 'credit';
    $signature     = $body['signature']     ?? ''; // base64 canvas

    $q['quoteStatus']   = 'signed';
    $q['signedAt']      = $now;
    $q['signerName']    = $signerName;
    $q['paymentMethod'] = $paymentMethod;
    $q['signatureData'] = $signature;
    upsert('quotes', $q);

    $clientPhone = $q['clientPhone'] ?? '';
    $clientName  = $q['clientName']  ?? 'לקוח';
    $total       = number_format((float)($q['total'] ?? 0), 0, '.', ',');
    $repPhone    = $q['salesRepPhone'] ?? ($s['salesRepPhone'] ?? '');
    $propNum     = $q['proposalNum'] ?? $q['id'];

    // WhatsApp to client — always credit card flow
    if ($clientPhone && !empty($s['autoClientPayment'])) {
        $vars    = ['name' => $clientName, 'num' => $propNum, 'total' => $total];
        $payLink = $q['paymentLink'] ?? createPaymentLink(array_merge($q, ['proposalNum' => $propNum]));
        if ($payLink) {
            $q['paymentLink'] = $payLink;
            upsert('quotes', $q);
            $tpl = $s['msgSignCredit'] ?? "שלום {name} 👋\n\nתודה על חתימתך!\nלתשלום:\n🔗 {payLink}\n\nסכום: ₪{total}";
            sendWhatsapp($clientPhone, tpl($tpl, $vars + ['payLink' => $payLink]));
        } else {
            sendWhatsapp($clientPhone, tpl($s['msgSignNoLink'] ?? "שלום {name} 👋\n\nתודה על חתימתך! ✍️\nלינק תשלום יישלח בקרוב.", $vars));
        }
    }

    // WhatsApp to rep
    if ($repPhone && !empty($s['autoRepSign'])) {
        $tpl = $s['msgSignRep'] ?? "✅ {name} חתמ/ה!\n📄 הצעה #{num}\n💰 ₪{total}\n💳 אשראי\n✍️ {signerName}";
        sendWhatsapp($repPhone, tpl($tpl, ['name' => $clientName, 'num' => $propNum, 'total' => $total, 'signerName' => $signerName]));
    }

    // Google Drive
    if (!empty($s['autoDrive'])) {
        $text = implode("\n", [
            "הסכם חתום — הצעה #{$propNum}", str_repeat('─', 36),
            "לקוח: {$clientName}", "טלפון: {$clientPhone}", "סכום: ₪{$total}",
            "תשלום: אשראי",
            "חתם/ה: {$signerName}", "תאריך: " . date('d/m/Y H:i'), "", "ID: {$id}",
        ]);
        uploadToDrive("הצעה_{$propNum}_{$clientName}_" . date('Y-m-d') . '.txt', $text);
    }

    // Email to admin
    $adminEmail = $s['bizEmail'] ?? '';
    if ($adminEmail) {
        $subject = '=?UTF-8?B?' . base64_encode("הצעה נחתמה — {$clientName}") . '?=';
        $msg2    = "לקוח חתם!\n\nלקוח: {$clientName}\nסכום: ₪{$total}\nתשלום: אשראי\nחתם/ה: {$signerName}\nתאריך: " . date('d/m/Y H:i');
        @mail($adminEmail, $subject, $msg2, "From: CRM <noreply@" . parse_url($s['baseUrl'] ?? 'http://localhost', PHP_URL_HOST) . ">\r\nContent-Type: text/plain; charset=UTF-8");
    }

    ok();
}

fail('פעולה לא מוכרת');
