<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeContentsFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contents', function($table) {           
            $table->text('text_de')->nullable()->change();
            $table->text('text_pl')->nullable()->change();
            $table->text('text_cz')->nullable()->change();
            $table->text('text_sk')->nullable()->change();
            $table->text('text_sl')->nullable()->change();
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
