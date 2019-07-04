<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Example;

class ExampleController extends Controller
{
    public function getExamples() {
        $examples = Example::all();
        return response()->json($examples);
    }

    public function saveExample(Request $request) {
        $example = Example::find($request->json('id'));
        if(!$example) {
            $example = new Example;
        }

        $example->pilotarea_id = $request->json('pilotarea_id');
        $example->title = $request->json('title');
        $example->address_of_project = $request->json('address_of_project');
        $example->gps_coordinates = $request->json('gps_coordinates');
        $example->usage_form = $request->json('usage_form');
        $example->heating_capacity = $request->json('heating_capacity');
        $example->heating_production = $request->json('heating_production');
        $example->cooling_capacity = $request->json('cooling_capacity');
        $example->cooling_production = $request->json('cooling_production');
        $example->seasonal_performance = $request->json('seasonal_performance');
        $example->number_of_tubes_wells = $request->json('number_of_tubes_wells');
        $example->depth_of_tubes_wells = $request->json('depth_of_tubes_wells');
        $example->geothermal_coverage_rate = $request->json('geothermal_coverage_rate');
        $example->supply_temperature_borehole = $request->json('supply_temperature_borehole');
        $example->supply_temperature_heating = $request->json('supply_temperature_heating');
        $example->supply_temperature_cooling = $request->json('supply_temperature_cooling');
        $example->planning_company = $request->json('planning_company');
        $example->specialties_of_project = $request->json('specialties_of_project');
        $example->drilling_company = $request->json('drilling_company');
        $example->heating_installer = $request->json('heating_installer');
        $example->thermal_response_test = $request->json('thermal_response_test');
        $example->year_of_installation = $request->json('year_of_installation');
        $example->web_link = $request->json('web_link');
        $example->description = $request->json('description');
        $example->introduction = $request->json('introduction');
       

        $example->save();

        $examples = Example::all();
        return response()->json($examples);
    }
}
