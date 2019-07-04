<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Unit;
use App\Pilotarea;

class UnitController extends Controller
{
    /**
     * getUnits
     * Get all units for the virtual boreholes for all pilotareas
     *
     * @return void
     */
    public function getUnits() {
        $units = Unit::orderBy('id', 'asc')->get();
        return response()->json($units);
    }

    /**
     * saveUnit
     * Create or update an unit for the boreholes.
     *
     * @param  mixed $request - Request object containing the unit information
     *
     * @return void
     */
    public function saveUnit(Request $request) {

        $pilotarea = Pilotarea::find($request->json("area"));
        
        $unit = Unit::where('id','=',$request->json("id"))->first();
        if(!$unit) {
            $unit = new Unit;
        }

        $unit->pilotarea_id = $pilotarea->id;
        $unit->color = $request->json('color');;
        $unit->identifier = $request->json('identifier');
        $unit->title_en = $request->json('title_en');
        $unit->title_de = $request->json('title_de');
        $unit->title_cz = $request->json('title_cz');
        $unit->title_pl = $request->json('title_pl');
        $unit->title_sk = $request->json('title_sk');
        $unit->title_sl = $request->json('title_sl');

        $unit->description_en = $request->json('description_en');
        $unit->description_de = $request->json('description_de');
        $unit->description_cz = $request->json('description_cz');
        $unit->description_pl = $request->json('description_pl');
        $unit->description_sk = $request->json('description_sk');
        $unit->description_sl = $request->json('description_sl');
        
        $unit->save();

        $unit = Unit::orderBy('id', 'asc')->get();
        return response()->json($unit);
    }

    /**
     * removeUnit
     * Remove a unit
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function removeUnit(Request $request) {

        $unit = Unit::find($request->json('id'));
        if($unit) {
            $unit->delete();
        }
        $unit = Unit::orderBy('id', 'asc')->get();
        return response()->json($unit);
    }
}
