<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeExplanatoryNotesFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('explanatorynotes', function($table) {
            $table->text('explanatory_note')->change();
            $table->text('explanatory_note_de')->change();
            $table->text('explanatory_note_pl')->change();
            $table->text('explanatory_note_cz')->change();
            $table->text('explanatory_note_sk')->change();
            $table->text('explanatory_note_sl')->change();

            $table->text('layer_description')->change();
            $table->text('layer_description_pl')->change();
            $table->text('layer_description_de')->change();
            $table->text('layer_description_cz')->change();
            $table->text('layer_description_sk')->change();
            $table->text('layer_description_sl')->change();
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
