<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeCoordsField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('measurements_locations', function($table) {
            $table->float('gps_lon', 8, 2)->change();
            $table->float('gps_lat', 8, 2)->change();
            $table->float('utm_east', 8, 2)->change();
            $table->float('utm_north', 8, 2)->change();
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
