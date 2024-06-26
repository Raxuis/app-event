<?php
namespace App\Models;

use Dompdf\Dompdf;
use PDO;

class ExportModel extends SqlConnect
{
  public function exportToCSVPDF(int $eventId, string $format)
  {
    $stmt = $this->db->prepare(
      "SELECT e.name as event_name, e.created_at as created_at, e.place as place, e.time as time, e.description as description, u.firstname as author_firstname, u.lastname as author_lastname, e.image as image_url
      FROM events as e
      INNER JOIN users as u ON e.user_id = u.id
      LEFT JOIN custom_fields AS cf ON cf.event_id = e.id
      WHERE e.id = :eventId"
    );
    $stmt->execute(['eventId' => (int) $eventId]);
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

  // Still an issue with null value at the end of the file
  private function generateCSV(array $event): string
  {
    $csvData = [
      ['Event Name', $event['event_name']],
      ['Author', $event['author_firstname'] . ' ' . $event['author_lastname']],
      ['Date Created', $event['created_at']],
      ['Description', $event['description']],
      ['Place', $event['place']],
      ['Time', $event['time']]
    ];

    ob_start(); // Start output buffering
    $output = fopen('php://output', 'w');

    foreach ($csvData as $row) {
      fputcsv($output, $row);
    }

    fclose($output); // Closing the output stream

    $csvContent = ob_get_clean(); // Getting the buffered content and clean the buffer

    return rtrim($csvContent, "\n"); // Using rtrim to remove trailing newline characters
  }


  private function generatePDF(array $event)
  {
    (string) $imageHtml = !empty($event['image_url']) ? "<img src=\"{$event['image_url']}\" style=\"width:100%;\"/>" : "";

    // Defining HTML content with UTF-8 encoding and a font that supports emojis
    $html = "
        <html>
        <head>
            <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
            <style>
                @font-face {
                    font-family: 'DejaVu Sans';
                    font-style: normal;
                    font-weight: normal;
                    src: url('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/fonts/DejaVuSans.ttf') format('truetype');
                }
                body {
                    font-family: 'DejaVu Sans', sans-serif;
                }
                img {
                    width: 100%;
                }
            </style>
        </head>
        <body>
            $imageHtml
            <h1>{$event['event_name']}</h1>
            <p><strong>Author:</strong> {$event['author_firstname']} {$event['author_lastname']}</p>
            <p><strong>Date Created:</strong> {$event['created_at']}</p>
            <p><strong>Description:</strong> {$event['description']}</p>
            <p><strong>Place:</strong> {$event['place']}</p>
            <p><strong>Time:</strong> {$event['time']}</p>
        </body>
        </html>
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
