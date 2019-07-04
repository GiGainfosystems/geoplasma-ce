<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMeasurementsLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('measurements_locations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('object_id');
            $table->string('object_type');
            $table->string('object_name');
            $table->integer('pilotarea_id')->unsigned();
            $table->decimal('utm_east');
            $table->decimal('utm_north');
            $table->string('utm_merid');
            $table->decimal('gps_lon');
            $table->decimal('gps_lat');
            $table->decimal('gps_alt');
            $table->string('gps_alt_reference');
            $table->timestamps();

            $table->foreign('pilotarea_id')->references('id')->on('pilotareas');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('measurements_locations');
    }
}
