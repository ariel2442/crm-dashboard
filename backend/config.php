<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ─── Storage ───────────────────────────────────────────────────
define('DATA_DIR',      __DIR__ . '/data/');
define('SETTINGS_FILE', DATA_DIR . 'settings.json');

function ensureDataDir(): void {
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
}

// ─── Response helpers ──────────────────────────────────────────
function ok(array $data = []): void {
    echo json_encode(array_merge(['ok' => true], $data), JSON_UNESCAPED_UNICODE);
    exit;
}
function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// ─── Auth ──────────────────────────────────────────────────────
function requireAuth(): array {
    // Support both session auth and Bearer token
    $token = getBearerToken();
    if ($token) {
        $users = getUsersList();
        foreach ($users as $u) {
            if (($u['token'] ?? '') === $token) return $u;
        }
    }
    if (!empty($_SESSION['auth'])) return $_SESSION['auth'];
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized'], JSON_UNESCAPED_UNICODE);
    exit;
}

function getBearerToken(): ?string {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/i', $h, $m)) return trim($m[1]);
    return null;
}

// ─── Settings ──────────────────────────────────────────────────
function getSettings(): array {
    if (!file_exists(SETTINGS_FILE)) return [];
    return json_decode(file_get_contents(SETTINGS_FILE), true) ?? [];
}
function saveSettings(array $s): void {
    ensureDataDir();
    file_put_contents(SETTINGS_FILE, json_encode($s, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

// ─── Generic collection helpers (leads / quotes / projects) ───
function collectionFile(string $type): string {
    return DATA_DIR . $type . '.json';
}
function readCollection(string $type): array {
    $f = collectionFile($type);
    if (!file_exists($f)) return [];
    return json_decode(file_get_contents($f), true) ?? [];
}
function writeCollection(string $type, array $items): void {
    ensureDataDir();
    file_put_contents(collectionFile($type), json_encode(array_values($items), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}
function findById(string $type, string $id): ?array {
    foreach (readCollection($type) as $item) {
        if (($item['id'] ?? '') === $id) return $item;
    }
    return null;
}
function upsert(string $type, array $item): array {
    $items = readCollection($type);
    $found = false;
    foreach ($items as &$existing) {
        if ($existing['id'] === $item['id']) { $existing = $item; $found = true; break; }
    }
    if (!$found) array_unshift($items, $item);
    writeCollection($type, $items);
    return $item;
}
function deleteById(string $type, string $id): void {
    $items = array_values(array_filter(readCollection($type), fn($i) => $i['id'] !== $id));
    writeCollection($type, $items);
}
function nextId(string $prefix = ''): string {
    return $prefix . time() . '_' . rand(100, 999);
}

// ─── Users ─────────────────────────────────────────────────────
function getUsersList(): array {
    $f = DATA_DIR . 'users.json';
    if (file_exists($f)) return json_decode(file_get_contents($f), true) ?? [];
    // Default admin (change password after first login!)
    return [['id' => '1', 'name' => 'מנהל', 'email' => 'admin@example.com', 'role' => 'admin', 'password' => hash('sha256', 'admin123'), 'token' => '']];
}
function saveUsersList(array $users): void {
    ensureDataDir();
    file_put_contents(DATA_DIR . 'users.json', json_encode(array_values($users), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

// ─── WhatsApp via Green API ─────────────────────────────────────
function normalizePhone(string $phone): string {
    $d = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($d) < 9) return '';
    if (str_starts_with($d, '0'))    return '972' . substr($d, 1);
    if (!str_starts_with($d, '972')) return '972' . $d;
    return $d;
}
function sendWhatsapp(string $phone, string $message): bool {
    $s    = getSettings();
    $inst = $s['greenApiInstance'] ?? '';
    $tok  = $s['greenApiToken']    ?? '';
    if (!$inst || !$tok) return false;
    $num  = normalizePhone($phone);
    if (!$num) return false;

    $url = "https://api.green-api.com/waInstance{$inst}/sendMessage/{$tok}";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['chatId' => $num . '@c.us', 'message' => $message], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $res = curl_exec($ch); curl_close($ch);
    return $res !== false;
}

// ─── Template helper ───────────────────────────────────────────
function tpl(string $t, array $vars): string {
    foreach ($vars as $k => $v) $t = str_replace('{' . $k . '}', (string)$v, $t);
    return $t;
}

// ─── GROW / Meshulam ───────────────────────────────────────────
function createPaymentLink(array $q): ?string {
    $s   = getSettings();
    $uid = $s['growUserId']   ?? '';
    $pc  = $s['growPageCode'] ?? '';
    if (!$uid || !$pc) return null;

    $base = !empty($s['growSandbox']) ? 'https://sandbox.meshulam.co.il' : 'https://meshulam.co.il';
    $ch   = curl_init($base . '/api/light/server/1.0/createPaymentProcess');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_POSTFIELDS     => [
            'pageCode'            => $pc,
            'userId'              => $uid,
            'sum'                 => (float)($q['total'] ?? 0),
            'description'         => 'הצעה ' . ($q['proposalNum'] ?? $q['id'] ?? ''),
            'successUrl'          => $s['growSuccessUrl'] ?? '',
            'cancelUrl'           => $s['growSuccessUrl'] ?? '',
            'pageField[fullName]' => $q['clientName']  ?? '',
            'pageField[phone]'    => $q['clientPhone'] ?? '',
            'cField1'             => (string)($q['id'] ?? ''),
        ],
    ]);
    $json = json_decode(curl_exec($ch), true); curl_close($ch);
    return ($json['status'] ?? 0) === 1 && !empty($json['data']['url']) ? $json['data']['url'] : null;
}

// ─── Google Drive ──────────────────────────────────────────────
function uploadToDrive(string $filename, string $content, string $mime = 'text/plain'): ?string {
    $s        = getSettings();
    $folderId = $s['driveFolderId']      ?? '';
    $saJson   = $s['driveServiceAccount'] ?? '';
    if (!$folderId || !$saJson) return null;

    $sa = json_decode($saJson, true);
    if (empty($sa['private_key']) || empty($sa['client_email'])) return null;

    $b64 = fn($d) => rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
    $now = time();
    $h   = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $c   = $b64(json_encode(['iss' => $sa['client_email'], 'scope' => 'https://www.googleapis.com/auth/drive.file', 'aud' => 'https://oauth2.googleapis.com/token', 'exp' => $now + 3600, 'iat' => $now]));
    $sig = ''; openssl_sign("{$h}.{$c}", $sig, $sa['private_key'], 'SHA256');
    $jwt = "{$h}.{$c}." . $b64($sig);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10,
        CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $jwt])]);
    $token = json_decode(curl_exec($ch), true)['access_token'] ?? ''; curl_close($ch);
    if (!$token) return null;

    $boundary = 'crm_' . uniqid();
    $meta     = json_encode(['name' => $filename, 'parents' => [$folderId]], JSON_UNESCAPED_UNICODE);
    $body     = "--{$boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{$meta}\r\n--{$boundary}\r\nContent-Type: {$mime}\r\n\r\n{$content}\r\n--{$boundary}--";
    $ch       = curl_init('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: multipart/related; boundary=' . $boundary]]);
    $res = json_decode(curl_exec($ch), true); curl_close($ch);
    return $res['id'] ?? null;
}

// ─── Reminder engine ───────────────────────────────────────────
function runReminders(string $type = 'all'): array {
    $s       = getSettings();
    $quotes  = readCollection('quotes');
    $now     = time();
    $sent    = 0;
    $baseUrl = rtrim($s['baseUrl'] ?? '', '/');

    foreach ($quotes as $q) {
        $phone  = $q['clientPhone'] ?? '';
        $status = $q['quoteStatus'] ?? 'draft';
        if (!$phone) continue;

        // Reminder 1: sent but not opened
        if (in_array($type, ['all', 'not-open']) && !empty($s['reminderNotOpenEnabled'])) {
            if ($status === 'sent' && !empty($q['sentAt']) && empty($q['reminderNotOpenSentAt'])) {
                $hrs = (time() - strtotime($q['sentAt'])) / 3600;
                if ($hrs >= (float)($s['reminderNotOpenHours'] ?? 24)) {
                    $link = $baseUrl ? $baseUrl . '/quote/?id=' . $q['id'] : '';
                    $msg  = tpl($s['msgReminderNotOpen'] ?? "שלום {name} 👋\n\nשלחתי לך הצעת מחיר לפני {hours} שעות.\nלצפייה: {link}", [
                        'name' => $q['clientName'] ?? 'לקוח', 'num' => $q['proposalNum'] ?? '', 'link' => $link, 'hours' => (int)$hrs
                    ]);
                    if (sendWhatsapp($phone, $msg)) {
                        $q['reminderNotOpenSentAt'] = date('c');
                        upsert('quotes', $q); $sent++;
                    }
                }
            }
        }

        // Reminder 2: viewed but not signed
        if (in_array($type, ['all', 'not-signed']) && !empty($s['reminderNotSignedEnabled'])) {
            if ($status === 'viewed' && !empty($q['firstViewedAt']) && empty($q['reminderNotSignedSentAt'])) {
                $hrs = (time() - strtotime($q['firstViewedAt'])) / 3600;
                if ($hrs >= (float)($s['reminderNotSignedHours'] ?? 48)) {
                    $link = $baseUrl ? $baseUrl . '/quote/?id=' . $q['id'] : '';
                    $msg  = tpl($s['msgReminderNotSigned'] ?? "שלום {name} 👋\n\nראיתי שצפית בהצעה שלנו ☺️\nנשמח לענות על שאלות!\n📄 הצעה #{num}\n🔗 {link}", [
                        'name' => $q['clientName'] ?? 'לקוח', 'num' => $q['proposalNum'] ?? '', 'link' => $link
                    ]);
                    if (sendWhatsapp($phone, $msg)) {
                        $q['reminderNotSignedSentAt'] = date('c');
                        upsert('quotes', $q); $sent++;
                    }
                }
            }
        }
    }
    return ['sent' => $sent, 'processed' => count($quotes)];
}
