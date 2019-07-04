<?php

namespace App\Http\Controllers;

use App\Pilotarea;
use Illuminate\Http\Request;

class PilotAreaController extends Controller
{
    /**
     * getPilotareas
     * Get all pilot areas
     *
     * @return void
     */
    public function getPilotareas() {
        $pilotareas = Pilotarea::all();
        return response()->json($pilotareas);
    }
}
