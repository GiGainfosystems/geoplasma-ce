<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInternationalLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('international_links', function (Blueprint $table) {
            $table->increments('id');
            $table->string('acronym')->nullable();
            $table->string('title_of_project_initiative')->nullable();
            $table->string('website')->nullable();
            $table->string('financing_program_source')->nullable();
            $table->text('summary')->nullable();
            $table->string('type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('international_links');
    }
}
