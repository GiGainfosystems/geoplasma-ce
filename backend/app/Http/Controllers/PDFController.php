<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PDF;
class PDFController extends Controller
{

  /**
   * standardReport
   * Create a report PDF based on the according template
   *
   * @param  mixed $request
   *
   * @return void
   */
  public function standardReport(Request $request) {    
    $headline = $request->json('headline');
    $html = $request->json('html');
    $image = $request->json('image');
    $notes = $request->json('notes');
    $exNotesHeadline = $request->json('exNotesHeadline');
    $content = [];
    $content["headline"] = $headline;
    $content["image"] = $image;
    $content["notes"] = $notes;
    $content["html"] = $html;
    $content["exNotesHeadline"] = $exNotesHeadline;
    $pdf = PDF::loadView('pdf.standardreport', $content);
    return $pdf->download('Report.pdf');
  }

}
