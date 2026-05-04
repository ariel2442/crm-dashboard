<?php
/**
 * reminders.php — cron endpoint.
 * Call this every hour from the server's cron job:
 *   0 * * * * curl -s "https://yourdomain.com/backend/reminders.php?token=YOUR_TOKEN"
 */
require_once __DIR__ . '/config.php';

$s     = getSettings();
$token = $_GET['token'] ?? '';

if (!($token && $token === ($s['cronToken'] ?? '')) && empty($_SESSION['auth'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

$type   = $_GET['type'] ?? 'all';
$result = runReminders($type);
echo json_encode(array_merge(['ok' => true], $result), JSON_UNESCAPED_UNICODE);
