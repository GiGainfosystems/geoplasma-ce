<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKnowledgeRepositoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('knowledgerepositorycontents', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('internal_id')->default(0);
            $table->string('title');
            $table->string('year');
            $table->string('author');
            $table->string('publisher_place');
            $table->string('territorial_coverage');
            $table->integer('language');
            $table->integer('user_id');
            $table->text('synopsis');
            $table->string('link');
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
        Schema::dropIfExists('knowledgerepositorycontents');
    }
}
