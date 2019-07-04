<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToGlossaryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('glossaries', function($table) {
          $table->boolean('basic')->default(1);
          $table->string('definition_de')->nullable();
          $table->string('definition_pl')->nullable();
          $table->string('definition_cz')->nullable();
          $table->string('definition_sk')->nullable();
          $table->string('definition_sl')->nullable();
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
