<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeFieldMeasurementsLocationsFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('measurements_locations', function (Blueprint $table) {
            $table->float('gps_lon')->change();
            $table->float('gps_lat')->change();
            $table->float('utm_east')->change();
            $table->float('utm_north')->change();
            $table->string('gps_alt_reference')->nullable()->change();
            $table->string('gps_alt')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
