<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

/* ════════════════════════════════════════════════════════════════
 * AUTH
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'login') {
    $email = trim($body['email'] ?? '');
    $pass  = trim($body['password'] ?? '');
    if (!$email || !$pass) fail('חסרים אימייל וסיסמה');

    $users = getUsersList();
    foreach ($users as $u) {
        if (strtolower($u['email']) === strtolower($email) && ($u['password'] ?? '') === hash('sha256', $pass)) {
            // Generate / refresh token
            $token = bin2hex(random_bytes(24));
            $u['token'] = $token;
            $all = array_map(fn($x) => $x['id'] === $u['id'] ? $u : $x, $users);
            saveUsersList($all);
            $_SESSION['auth'] = $u;
            ok(['user' => array_diff_key($u, ['password' => 1]), 'token' => $token]);
        }
    }
    fail('אימייל או סיסמה שגויים', 401);
}

if ($action === 'me') {
    $u = requireAuth();
    ok(['user' => array_diff_key($u, ['password' => 1])]);
}

/* ════════════════════════════════════════════════════════════════
 * LEADS
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'leads-list') {
    requireAuth();
    ok(['leads' => readCollection('leads')]);
}

if ($action === 'lead-get') {
    requireAuth();
    $id = $body['id'] ?? $_GET['id'] ?? '';
    $l  = findById('leads', $id);
    if (!$l) fail('ליד לא נמצא', 404);
    ok(['lead' => $l]);
}

if ($action === 'lead-save') {
    requireAuth();
    $id = $body['id'] ?? nextId('lead_');
    $existing = findById('leads', $id) ?? ['id' => $id, 'createdAt' => date('c')];
    $lead = array_merge($existing, $body, ['id' => $id, 'updatedAt' => date('c')]);
    upsert('leads', $lead);
    ok(['lead' => $lead]);
}

if ($action === 'lead-delete') {
    requireAuth();
    $id = $body['id'] ?? '';
    if (!$id) fail('חסר ID');
    deleteById('leads', $id);
    ok();
}

/* ════════════════════════════════════════════════════════════════
 * QUOTES
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'quotes-list') {
    requireAuth();
    $leadId = $_GET['leadId'] ?? $body['leadId'] ?? '';
    $quotes = readCollection('quotes');
    if ($leadId) $quotes = array_values(array_filter($quotes, fn($q) => ($q['leadId'] ?? '') === $leadId));
    ok(['quotes' => $quotes]);
}

if ($action === 'quote-get') {
    // public — used by client proposal page
    $id = $_GET['id'] ?? $body['id'] ?? '';
    $q  = findById('quotes', $id);
    if (!$q) fail('הצעה לא נמצאה', 404);
    ok(['quote' => $q]);
}

if ($action === 'quote-save') {
    requireAuth();
    $id       = $body['id'] ?? nextId('quote_');
    $existing = findById('quotes', $id) ?? ['id' => $id, 'createdAt' => date('c'), 'totalViews' => 0, 'views' => []];
    $quote    = array_merge($existing, $body, ['id' => $id, 'updatedAt' => date('c')]);
    if (empty($quote['quoteStatus'])) $quote['quoteStatus'] = 'draft';
    upsert('quotes', $quote);
    ok(['quote' => $quote]);
}

if ($action === 'quote-send') {
    // Save + send WhatsApp to client
    $user = requireAuth();
    $s    = getSettings();
    $id   = $body['id'] ?? nextId('quote_');

    $existing = findById('quotes', $id) ?? ['id' => $id, 'createdAt' => date('c'), 'totalViews' => 0, 'views' => []];
    $quote    = array_merge($existing, $body, [
        'id'           => $id,
        'quoteStatus'  => 'sent',
        'sentAt'       => date('c'),
        'updatedAt'    => date('c'),
        'salesRepName' => $user['name'] ?? '',
        'salesRepPhone'=> $user['phone'] ?? ($s['salesRepPhone'] ?? ''),
    ]);
    upsert('quotes', $quote);

    $waSent  = false;
    $baseUrl = rtrim($s['baseUrl'] ?? '', '/');
    if (!empty($quote['clientPhone']) && $baseUrl && !empty($s['autoSendClient'])) {
        $link   = $baseUrl . '/quote/?id=' . $id;
        $msg    = tpl($s['msgSendClient'] ?? "שלום {name} 👋\n\nהצעת המחיר שלך מוכנה:\n🔗 {link}\n\nלכל שאלה — אשמח לעזור!", [
            'name' => $quote['clientName'] ?? 'לקוח', 'num' => $quote['proposalNum'] ?? '', 'link' => $link
        ]);
        $waSent = sendWhatsapp($quote['clientPhone'], $msg);
    }
    ok(['quote' => $quote, 'whatsappSent' => $waSent]);
}

if ($action === 'quote-delete') {
    requireAuth();
    $id = $body['id'] ?? '';
    if (!$id) fail('חסר ID');
    deleteById('quotes', $id);
    ok();
}

if ($action === 'quote-next-num') {
    requireAuth();
    $file = DATA_DIR . 'quote_counter.json';
    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $num  = max(100, (int)($data['next'] ?? 100));
    file_put_contents($file, json_encode(['next' => $num + 1]), LOCK_EX);
    ok(['num' => $num]);
}

if ($action === 'quote-create-payment') {
    requireAuth();
    $id = $body['id'] ?? '';
    $q  = $id ? (findById('quotes', $id) ?? $body) : $body;

    $url = createPaymentLink($q);
    if (!$url) fail('שגיאה ביצירת לינק — בדוק User ID, Page Code ו-Success URL');

    if ($id) {
        $q['paymentLink'] = $url;
        upsert('quotes', $q);
    }
    ok(['url' => $url]);
}

if ($action === 'grow-test') {
    requireAuth();
    $s  = getSettings();
    $uid = $s['growUserId'] ?? ''; $pc = $s['growPageCode'] ?? '';
    if (!$uid || !$pc) fail('חסרים User ID ו-Page Code');
    $base = !empty($s['growSandbox']) ? 'https://sandbox.meshulam.co.il' : 'https://meshulam.co.il';
    $ch   = curl_init($base . '/api/light/server/1.0/createPaymentProcess');
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => ['pageCode' => $pc, 'userId' => $uid, 'sum' => '1'], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
    $json  = json_decode(curl_exec($ch), true); curl_close($ch);
    $errId = is_array($json['err'] ?? null) ? ($json['err']['id'] ?? 0) : 0;
    if (($json['status'] ?? 0) === 1 || in_array($errId, [7,8,9,10,11,12,13,54,55,56])) ok(['connected' => true]);
    $errMsg = is_array($json['err'] ?? null) ? ($json['err']['message'] ?? '') : '';
    fail('פרטי GROW לא תקינים' . ($errMsg ? ': ' . $errMsg : ''));
}

/* ════════════════════════════════════════════════════════════════
 * PROJECTS
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'projects-list') {
    requireAuth();
    ok(['projects' => readCollection('projects')]);
}

if ($action === 'project-save') {
    requireAuth();
    $id       = $body['id'] ?? nextId('project_');
    $existing = findById('projects', $id) ?? ['id' => $id, 'createdAt' => date('c')];
    $project  = array_merge($existing, $body, ['id' => $id, 'updatedAt' => date('c')]);
    upsert('projects', $project);
    ok(['project' => $project]);
}

if ($action === 'project-delete') {
    requireAuth();
    $id = $body['id'] ?? '';
    if (!$id) fail('חסר ID');
    deleteById('projects', $id);
    ok();
}

/* ════════════════════════════════════════════════════════════════
 * SETTINGS
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'settings-get') {
    requireAuth();
    $s = getSettings();
    unset($s['driveServiceAccount']); // don't expose private key
    ok(['settings' => $s]);
}

if ($action === 'settings-save') {
    requireAuth();
    $allowed = [
        'bizName','bizEmail','bizPhone','bizBank','baseUrl',
        'greenApiInstance','greenApiToken','salesRepPhone',
        'growUserId','growPageCode','growSuccessUrl','growSandbox',
        'driveFolderId','driveServiceAccount',
        'autoSendClient','autoRepView','autoRepSign','autoClientPayment','autoDrive',
        'msgSendClient','msgViewFirst','msgViewReturn','msgSignRep',
        'msgSignCredit','msgSignBank','msgSignNoLink',
        'msgReminderNotOpen','msgReminderNotSigned',
        'reminderNotOpenEnabled','reminderNotOpenHours',
        'reminderNotSignedEnabled','reminderNotSignedHours',
        'cronToken',
    ];
    $s = getSettings();
    foreach ($allowed as $k) { if (array_key_exists($k, $body)) $s[$k] = $body[$k]; }
    saveSettings($s);
    ok();
}

/* ════════════════════════════════════════════════════════════════
 * WHATSAPP — manual send
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'send-whatsapp') {
    requireAuth();
    $phone = $body['phone'] ?? ''; $msg = $body['message'] ?? '';
    if (!$phone || !$msg) fail('חסרים טלפון/הודעה');
    $sent = sendWhatsapp($phone, $msg);
    ok(['sent' => $sent]);
}

/* ════════════════════════════════════════════════════════════════
 * REMINDERS — manual trigger
 * ════════════════════════════════════════════════════════════════ */

if ($action === 'run-reminders') {
    $s     = getSettings();
    $token = $_GET['token'] ?? $body['token'] ?? '';
    if (!($token && $token === ($s['cronToken'] ?? '')) && !getBearerToken()) {
        requireAuth();
    }
    $type   = $body['type'] ?? 'all';
    $result = runReminders($type);
    ok($result);
}

fail('פעולה לא מוכרת');
