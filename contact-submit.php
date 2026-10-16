<?php
// Haeman Tech contact endpoint. Hostinger PHP mail() must be configured.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); header('Allow: POST'); echo json_encode(['error'=>'Method not allowed']); exit; }
if (isset($_SERVER['CONTENT_LENGTH']) && (int)$_SERVER['CONTENT_LENGTH'] > 20000) { http_response_code(413); echo json_encode(['error'=>'Request too large']); exit; }
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) { http_response_code(400); echo json_encode(['error'=>'Invalid JSON']); exit; }
$fields = ['project_type','project_stage','technology','budget','timeline','description','name','company','email','phone'];
$clean = [];
foreach ($fields as $field) {
    $value = $data[$field] ?? '';
    if (!is_string($value) && !is_numeric($value)) $value = '';
    $clean[$field] = trim((string)$value);
    if (strlen($clean[$field]) > 4000) { http_response_code(400); echo json_encode(['error'=>'Field too long']); exit; }
}
if ($clean['name'] === '' || !filter_var($clean['email'], FILTER_VALIDATE_EMAIL) || strlen($clean['description']) < 10) {
    http_response_code(422); echo json_encode(['error'=>'Please provide a name, valid email and project description']); exit;
}
$labels = ['project_type'=>'Project Type','project_stage'=>'Project Stage','technology'=>'Technology','budget'=>'Budget','timeline'=>'Timeline','description'=>'Description','name'=>'Name','company'=>'Company','email'=>'Email','phone'=>'Phone'];
$lines = ['A new project inquiry was submitted via the Haeman Tech website.', ''];
foreach ($labels as $key => $label) { $lines[] = $label . ': ' . str_replace(["\r", "\n"], ' ', $clean[$key]); }
$subject = 'New Haeman Tech website inquiry';
$headers = [ 'From: Haeman Tech <official@haemantech.com>', 'Reply-To: ' . $clean['email'], 'Content-Type: text/plain; charset=UTF-8', 'X-Mailer: PHP/' . phpversion() ];
$sent = @mail('official@haemantech.com', $subject, implode("\n", $lines), implode("\r\n", $headers));
if (!$sent) { http_response_code(503); echo json_encode(['error'=>'Mail delivery unavailable']); exit; }
echo json_encode(['success'=>true]);
