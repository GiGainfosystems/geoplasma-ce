<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\InternationalLink;
use Illuminate\Support\Facades\Storage;
use Excel;

class InternationalLinkController extends Controller
{

    private $rsync = 'rsync -stuz "/public/inbox/';

    /**
     * getLinks
     * Get all links to international projects / organizations
     *
     * @return void
     */
    public function getLinks() {
        $links = InternationalLink::all();
        return response()->json($links);
    }

    /**
     * updateLinks
     * Update the links - The links are updated in batch on base of the according Excel file
     *
     * @return void
     */
    public function updateLinks() {

        $existing = InternationalLink::all();
        if($existing) {
            foreach($existing as $exists) {
                $exists->delete();
            }
        }

        $cmd = $this->rsync.'links/Links.xlsx" /var/www/html/backend/storage/excel 2>&1';
        exec($cmd, $output, $return_v);

        $exists = Storage::disk('excel')->exists('Links.xlsx');
        if($exists) {
            
            $data = Excel::load('storage/excel/Links.xlsx')->get();
            foreach($data as $dat) {
                $newdata = new InternationalLink();
                if($dat['show_on_landing_page'] === 'Yes') {
                    foreach($dat as $key => $value) {
                        if($key !== 'show_on_landing_page' && $key !== 'impact_on_wpt4' && $key !== 'duration') {
                            $newdata[$key] = $value;
                        }
                    }
                }
                $newdata->save();
            }   
        }  
        $links = InternationalLink::all();
        return response()->json($links);        
    }
}
