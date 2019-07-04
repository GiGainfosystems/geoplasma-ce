<?php

namespace App\Http\Controllers;

use App\Professionalgroup;
use Illuminate\Http\Request;

class ProfessionalgroupController extends Controller
{
    /**
     * getProfessionalgroups
     * Get all professional groups (driller, experts, planner etc.)
     *
     * @return void
     */
    public function getProfessionalgroups() {
        $professionalgroups = Professionalgroup::orderBy('name', 'asc')->get();
        return response()->json($professionalgroups);
    }
}
