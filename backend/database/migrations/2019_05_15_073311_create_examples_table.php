<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamplesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('examples', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pilotarea_id')->unsigned();
            $table->string('title');
            $table->string('address_of_project')->nullable();
            $table->string('gps_coordinates')->nullable();
            $table->string('usage_form')->nullable();
            $table->string('heating_capacity')->nullable();
            $table->string('heating_production')->nullable();
            $table->string('cooling_capacity')->nullable();
            $table->string('cooling_production')->nullable();
            $table->string('seasonal_performance')->nullable();
            $table->string('number_of_tubes_wells')->nullable();
            $table->string('depth_of_tubes_wells')->nullable();
            $table->string('geothermal_coverage_rate')->nullable();
            $table->string('supply_temperature_borehole')->nullable();
            $table->string('supply_temperature_heating')->nullable();
            $table->string('supply_temperature_cooling')->nullable();
            $table->text('planning_company')->nullable();
            $table->text('specialties_of_project')->nullable();
            $table->text('drilling_company')->nullable();
            $table->text('heating_installer')->nullable();
            $table->string('thermal_response_test')->nullable();
            $table->string('year_of_installation')->nullable();
            $table->string('web_link')->nullable();
            $table->text('description')->nullable();
            $table->text('introduction')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('examples');
    }
}
