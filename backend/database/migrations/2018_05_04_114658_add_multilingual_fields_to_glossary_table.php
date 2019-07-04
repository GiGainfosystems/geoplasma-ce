<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMultilingualFieldsToGlossaryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('glossaries', function($table) {
          $table->string('keyword_de')->nullable();
          $table->string('keyword_pl')->nullable();
          $table->string('keyword_cz')->nullable();
          $table->string('keyword_sk')->nullable();
          $table->string('keyword_sl')->nullable();
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
