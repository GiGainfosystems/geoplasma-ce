<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUnitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('units', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pilotarea_id')->unsigned();
            $table->string('identifier');
            $table->string('color');
            $table->string('title_en');
            $table->string('title_de');
            $table->string('title_cz');
            $table->string('title_pl');
            $table->string('title_sk');
            $table->string('title_sl');
            $table->text('description_en');
            $table->text('description_de');
            $table->text('description_cz');
            $table->text('description_pl');
            $table->text('description_sk');
            $table->text('description_sl');
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
        Schema::dropIfExists('units');
    }
}
