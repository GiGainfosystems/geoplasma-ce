<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSynonymsMultilingualFieldsToGlossaryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('glossaries', function($table) {
            $table->string('synonyms_de')->nullable();
            $table->string('synonyms_pl')->nullable();
            $table->string('synonyms_cz')->nullable();
            $table->string('synonyms_sk')->nullable();
            $table->string('synonyms_sl')->nullable();
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
