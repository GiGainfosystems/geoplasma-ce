<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeFieldMeasurementsFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('measurements', function (Blueprint $table) {
            $table->string('description')->nullable()->change();
            $table->string('value_alphanum')->nullable()->change();
            $table->decimal('depth_from')->nullable()->change();
            $table->decimal('depth_to')->nullable()->change();
            $table->float('value_average')->nullable()->change();
            $table->float('value_min')->nullable()->change();
            $table->float('value_max')->nullable()->change();
            $table->date('date_from')->nullable()->change();
            $table->date('date_to')->nullable()->change();
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
