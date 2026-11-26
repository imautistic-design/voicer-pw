<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const IDEA_TO = 'labas@imautistic.org';
const IDEA_FROM = 'labas@imautistic.org';
const IDEA_MAX_LENGTH = 1000;
const IDEA_MIN_SECONDS_BETWEEN = 30;

function reply(int $status, string $message): void {
	http_response_code($status);
	echo json_encode(['ok' => $status === 200, 'message' => $message], JSON_UNESCAPED_UNICODE);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	reply(405, 'Netinkamas užklausos tipas.');
}

// Botai dažniausiai užpildo paslėptą lauką.
if (!empty($_POST['website'])) {
	reply(200, 'Ačiū!');
}

$idea = trim((string)($_POST['idea'] ?? ''));
if ($idea === '') {
	reply(400, 'Parašyk savo idėją.');
}
if (mb_strlen($idea) > IDEA_MAX_LENGTH) {
	reply(400, 'Idėja per ilga – sutrumpink iki ' . IDEA_MAX_LENGTH . ' simbolių.');
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$stamp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'idea_' . md5($ip);
if (is_file($stamp) && time() - filemtime($stamp) < IDEA_MIN_SECONDS_BETWEEN) {
	reply(429, 'Palauk kelias sekundes ir bandyk dar kartą.');
}
touch($stamp);

$headers = [
	'From: I\'m Autistic <' . IDEA_FROM . '>',
	'Content-Type: text/plain; charset=UTF-8',
];
$subject = '=?UTF-8?B?' . base64_encode('Nauja idėja iš imautistic.org') . '?=';
$body = $idea . "\n\n--\nIP: " . $ip . "\n" . date('Y-m-d H:i:s');

if (!mail(IDEA_TO, $subject, $body, implode("\r\n", $headers))) {
	reply(500, 'Nepavyko išsiųsti. Bandyk vėliau.');
}

reply(200, 'Ačiū! Tavo idėja gauta.');
