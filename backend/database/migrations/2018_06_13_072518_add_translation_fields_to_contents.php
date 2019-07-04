<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTranslationFieldsToContents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('contents', function($table) {
          $table->string('title_de')->nullable();
          $table->string('title_pl')->nullable();
          $table->string('title_cz')->nullable();
          $table->string('title_sk')->nullable();
          $table->string('title_sl')->nullable();
          $table->string('text_de')->default("");
          $table->string('text_pl')->default("");
          $table->string('text_cz')->default("");
          $table->string('text_sk')->default("");
          $table->string('text_sl')->default("");
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
