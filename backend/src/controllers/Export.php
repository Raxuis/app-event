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
    $eventId = $_POST['event_id'] ?? null;
    $format = $_POST['format'] ?? null;

    if (!$eventId || !$format) {
      http_response_code(400);
      echo "Invalid parameters";
      return;
    }

    try {
      $fileContent = $this->export->exportToCSVPDF($eventId, $format);
      if ($format === 'csv') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="event_' . $eventId . '.csv"');
      } elseif ($format === 'pdf') {
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="event_' . $eventId . '.pdf"');
      }
      echo $fileContent;
    } catch (\Exception $e) {
      http_response_code(500);
      echo $e->getMessage();
    }
  }
}
