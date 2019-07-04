<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMeasurementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('measurements', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('measurements_id');
            $table->integer('object_id')->unsingned();
            $table->string('pp_number');
            $table->string('m_input_parameter_id');
            $table->date('date_from');
            $table->date('date_to');
            $table->decimal('depth_from');
            $table->decimal('depth_to');
            $table->integer('n_value');
            $table->string('value_alphanum');
            $table->decimal('value_average')->nullable();
            $table->decimal('value_min')->nullable();
            $table->decimal('value_max')->nullable();
            $table->string('description');
            $table->string('m_link_to_document')->nullable();
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
        Schema::dropIfExists('measurements');
    }
}
