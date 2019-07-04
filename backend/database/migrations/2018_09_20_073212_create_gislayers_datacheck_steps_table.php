<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGislayersDatacheckStepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gislayers_datacheck_steps', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('gislayers_id');
            $table->integer('datacheck_steps_id');
            $table->boolean('checked')->default(0);
            $table->timestamps();

            $table->foreign('gislayers_id')->references('id')->on('gislayers');
            $table->foreign('datacheck_steps_id')->references('id')->on('datacheck_steps');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gislayers_datacheck_steps');
    }
}
