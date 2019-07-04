<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Measurement;
use App\MeasurementsLocation;
use App\Pilotarea;
use Auth;

class MeasurementController extends Controller
{
    /**
     * getMeasurements
     * Get all the field measurements for the given area
     *
     * @param  mixed $area
     *
     * @return void
     */
    public function getMeasurements($area) {
        $pilotarea = Pilotarea::where('uri','=',$area)->first();
        $locations = MeasurementsLocation::select(
            'object_id',
            'object_type',
            'object_name',
            'utm_east',
            'utm_north',
            'utm_merid',
            'gps_lon',
            'gps_lat',
            'gps_alt',
            'gps_alt_reference'
        )->where('pilotarea_id','=',$pilotarea->id)->get();
        foreach($locations as $location) {
            $measurements = Measurement::select(
                'measurements_id', 
                'pp_number', 
                'm_input_parameter_id',
                'date_from',
                'date_to',
                'depth_from',
                'depth_to',
                'value_alphanum',
                'value_average',
                'value_min',
                'value_max',
                'description',
                'm_link_to_document')->where('object_id','=',$location->object_id)->where('pilotarea_id','=',$pilotarea->id)->get();
            $location['measurements'] = $measurements;           
        }

        return response()->json($locations);
    }

}
