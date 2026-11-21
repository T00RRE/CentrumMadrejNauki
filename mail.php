<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

parse_str(file_get_contents('php://input'), $data);

function s(mixed $v): string {
    return htmlspecialchars(strip_tags(trim((string)($v ?? ''))), ENT_QUOTES, 'UTF-8');
}

// Honeypot – cicha blokada botów
if (!empty($data['bot-field'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$formName = s($data['form-name'] ?? '');
$to       = 'kontakt@centrummadrejnauki.pl';

$subjects = [
    'rezerwacja-urodziny'    => 'Rezerwacja urodzin',
    'zapis-matlandoo'        => 'Zapis na Matlandoo',
    'kontakt'                => 'Wiadomość z formularza kontaktowego',
    'zapis-wydarzenie'       => 'Zapis na wydarzenie',
    'zapis-angielski'        => 'Zapis na angielski',
    'zapytanie-laboratorium' => 'Zapytanie – Laboratorium',
    'zapis-kreatywne'        => 'Zapis na zajęcia kreatywne',
];

$subjectText = $subjects[$formName] ?? 'Zgłoszenie: ' . $formName;
$subject = '=?UTF-8?B?' . base64_encode('[CMN] ' . $subjectText) . '?=';

$labels = [
    'imie-dziecka'  => 'Imię dziecka',
    'imie-rodzica'  => 'Imię rodzica/opiekuna',
    'wiek'          => 'Wiek dziecka',
    'wiek-dziecka'  => 'Wiek dziecka',
    'pakiet'        => 'Pakiet',
    'data'          => 'Preferowana data',
    'liczba-dzieci' => 'Liczba dzieci',
    'dodatki'       => 'Dodatki',
    'telefon'       => 'Telefon',
    'email'         => 'E-mail',
    'uwagi'         => 'Uwagi',
    'info'          => 'Dodatkowe informacje',
    'wydarzenie'    => 'Wydarzenie',
    'rodzaj-zajec'  => 'Rodzaj zajęć',
    'rodzaj'        => 'Rodzaj',
    'temat'         => 'Temat',
    'wiadomosc'     => 'Wiadomość',
    'imie'          => 'Imię i nazwisko',
];

$skip = ['form-name', 'bot-field', 'gdpr'];

$lines   = [];
$lines[] = 'Formularz: ' . $subjectText;
$lines[] = 'Data:      ' . date('d.m.Y H:i:s');
$lines[] = str_repeat('-', 40);
$lines[] = '';

foreach ($data as $key => $value) {
    if (in_array($key, $skip, true) || trim((string)$value) === '') continue;
    $label   = $labels[$key] ?? ucfirst(str_replace(['-', '_'], ' ', $key));
    $lines[] = $label . ': ' . s($value);
}

$body = implode("\n", $lines);

$senderEmail = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);

$headers  = 'From: Centrum Madrej Nauki <kontakt@centrummadrejnauki.pl>' . "\r\n";
if ($senderEmail) {
    $headers .= 'Reply-To: ' . $senderEmail . "\r\n";
}
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
$headers .= 'Content-Transfer-Encoding: 8bit' . "\r\n";

$ok = @mail($to, $subject, $body, $headers, '-f kontakt@centrummadrejnauki.pl');

http_response_code($ok ? 200 : 500);
echo json_encode(['ok' => $ok]);
