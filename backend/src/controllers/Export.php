<?php
namespace App\Controllers;

use App\Models\ExportModel;

class Export extends Controller
{
  protected object $export;

  public function __construct($params)
  {
    $this->export = new ExportModel();

    parent::__construct($params);
  }

  protected function postExport()
  {
    $body = $this->sanitizeInput($this->body);
    $eventId = $body['event_id'] ?? null;
    $format = $body['format'] ?? null;

    if (!$eventId || !$format) {
      http_response_code(400);
      echo "Invalid parameters";
      return;
    }
    try {
      $fileContent = $this->export->exportToCSVPDF($eventId, $format);

      if ($format === 'csv') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="event-' . $eventId . '.csv"');
        echo $fileContent;
        exit; // Ensuring the script stops after outputting the CSV => To avoid null values at the end of the file
      } elseif ($format === 'pdf') {
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="event-' . $eventId . '.pdf"');
        echo $fileContent;
        exit;
      }
    } catch (\Exception $e) {
      $this->respond(500, ['error' => 'Error exporting: ' . $e->getMessage()]);
    }
  }
}
