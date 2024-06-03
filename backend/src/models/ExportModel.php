<?php
namespace App\Models;

use Dompdf\Dompdf;
use PDO;

class ExportModel extends SqlConnect
{
  public function exportToCSVPDF($eventId, $format)
  {
    $stmt = $this->db->prepare(
      "SELECT e.name as event_name, e.created_at as created_at, e.place as place, e.time as time,e.description as description, u.firstname as author_firstname, u.lastname as author_lastname
      FROM events as e
      INNER JOIN users as u ON e.user_id = u.id
      LEFT JOIN custom_fields AS cf ON cf.event_id = e.id
      WHERE e.id = :eventId"
    );
    $stmt->execute(['eventId' => $eventId]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
      throw new \Exception("Event not found");
    }

    if ($format === 'csv') {
      return $this->generateCSV($event);
    } elseif ($format === 'pdf') {
      return $this->generatePDF($event);
    } else {
      throw new \Exception("Invalid format");
    }
  }

  private function generateCSV($event)
  {
    $csvData = [
      ['Event Name', $event['event_name']],
      ['Author', $event['author_firstname'] . ' ' . $event['author_lastname']],
      ['Date Created', $event['created_at']],
      ['Description', $event['description']],
      ['Place', $event['place']],
      ['Time', $event['time']],
    ];

    // Use output buffering to capture CSV output
    ob_start();
    $output = fopen('php://output', 'w');
    foreach ($csvData as $row) {
      // Write each row to the CSV
      fputcsv($output, $row);
    }
    fclose($output);

    // Capture the CSV content and ensure no extra content => There was a extra null row at the end
    $csvContent = ob_get_clean();

    // Delete extra blank lines
    $csvContent = trim($csvContent);

    return $csvContent;
  }



  private function generatePDF($event)
  {
    $html = "
        <h1>{$event['event_name']}</h1>
        <p><strong>Author:</strong> {$event['author_firstname']} {$event['author_lastname']}</p>
        <p><strong>Date Created:</strong> {$event['created_at']}</p>
        <p><strong>Description:</strong> {$event['description']}</p>
        <p><strong>Place:</strong> {$event['place']}</p>
        <p><strong>Time:</strong> {$event['time']}</p>
        ";
    $options = new \Dompdf\Options();
    $options->set('isHtml5ParserEnabled', true);
    $options->set('isRemoteEnabled', true);
    $options->set('debugPng', true);
    $options->set('debugKeepTemp', true);
    $options->set('isPhpEnabled', true);

    // Use Dompdf with options to convert HTML to PDF
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    return $dompdf->output();
  }
}
