<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToPilotareas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pilotareas', function (Blueprint $table) {
            $table->text('description_en')->default("");
            $table->text('description_de')->default("");
            $table->text('description_cs')->default("");
            $table->text('description_pl')->default("");
            $table->text('description_sk')->default("");
            $table->text('description_sl')->default("");
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
