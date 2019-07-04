<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGislayersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gislayers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pilotarea_id');
            $table->string('name');
            $table->string('category');
            $table->date('last_updated');
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
        Schema::dropIfExists('gislayers');
    }
}
