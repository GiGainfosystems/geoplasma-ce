<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToExplanatorynotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('explanatorynotes', function($table) {
          $table->boolean('basic')->default(1);
          $table->string('explanatory_note_de')->nullable();
          $table->string('explanatory_note_pl')->nullable();
          $table->string('explanatory_note_cz')->nullable();
          $table->string('explanatory_note_sk')->nullable();
          $table->string('explanatory_note_sl')->nullable();
          $table->string('layer_description_pl')->nullable();
          $table->string('layer_description_de')->nullable();
          $table->string('layer_description_cz')->nullable();
          $table->string('layer_description_sk')->nullable();
          $table->string('layer_description_sl')->nullable();

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
