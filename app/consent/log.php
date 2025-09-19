<?php
// /api/consent/log/index.php

// Sécurité basique CORS (si besoin) – adapter selon ton infra :
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Lire le JSON
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Validation minimale (évite d’avaler n’importe quoi)
// Tu peux renforcer avec un schéma JSON (justinrainbow/json-schema) si tu veux.
$required = ['consent_id','ts','site_host','locale','policy_version','categories','device_id'];
foreach ($required as $k) {
    if (!array_key_exists($k, $data)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => "Missing field: $k"]);
        exit;
    }
}

// Normalisations / limites pour éviter les colonnes surdimensionnées
$consent_id   = substr($data['consent_id'], 0, 64);
$ts_iso       = substr($data['ts'], 0, 40);
$site_host    = substr($data['site_host'], 0, 255);
$locale       = substr($data['locale'], 0, 32);
$banner_ver   = isset($data['banner_version']) ? substr($data['banner_version'], 0, 32) : null;
$policy_ver   = substr($data['policy_version'], 0, 32);
$policy_url   = !empty($data['policy_url']) ? substr($data['policy_url'], 0, 512) : null;
$policy_hash  = !empty($data['policy_hash']) ? substr($data['policy_hash'], 0, 128) : null;
$device_id    = substr($data['device_id'], 0, 64);
$referrer     = !empty($data['referrer']) ? substr($data['referrer'], 0, 512) : null;
$user_agent_c = !empty($data['user_agent']) ? substr($data['user_agent'], 0, 512) : null;

// Côté serveur : IP et UA (on garde les deux — si tu veux minimiser, hash IP/supprimer après 30j)
$ip = $_SERVER['REMOTE_ADDR'] ?? null;
$ua = $_SERVER['HTTP_USER_AGENT'] ?? $user_agent_c;

// Conversion ISO → DATETIME
$dt = date_create($ts_iso);
$ts_db = $dt ? $dt->format('Y-m-d H:i:s') : date('Y-m-d H:i:s');

// JSON des catégories tel que reçu
$categories_json = json_encode($data['categories'], JSON_UNESCAPED_UNICODE);

// Connexion PDO (adapter DSN/identifiants)
$dsn = 'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4';
$user = 'app_user';
$pass = 'app_pass';

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $sql = "INSERT INTO consent_log (
                consent_id, ts, site_host, locale, banner_version,
                policy_version, policy_url, policy_hash,
                device_id, referrer, user_agent, ip_addr, categories
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $consent_id, $ts_db, $site_host, $locale, $banner_ver,
        $policy_ver, $policy_url, $policy_hash,
        $device_id, $referrer, $ua, $ip, $categories_json
    ]);

    http_response_code(201);
    echo json_encode(['ok' => true, 'id' => $consent_id]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DB insert failed']);
}
