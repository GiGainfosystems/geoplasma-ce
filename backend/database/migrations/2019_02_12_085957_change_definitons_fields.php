<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeDefinitonsFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('glossaries', function($table) {
            $table->text('definition_de')->nullable()->change();;
            $table->text('definition_pl')->nullable()->change();;
            $table->text('definition_cz')->nullable()->change();;
            $table->text('definition_sk')->nullable()->change();;
            $table->text('definition_sl')->nullable()->change();;
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
