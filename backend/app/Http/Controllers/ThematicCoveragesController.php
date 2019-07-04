<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Thematiccoverage;

class ThematicCoveragesController extends Controller
{
    /**
     * getThematicCoverages
     * Get all thematic coverages (knowledge repository)
     *
     * @return void
     */
    public function getThematicCoverages() {

        $topics = Thematiccoverage::all();
        return response()->json($topics);
    }

}
