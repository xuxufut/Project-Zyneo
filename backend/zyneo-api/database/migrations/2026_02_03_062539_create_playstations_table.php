<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
          Schema::create('playstations', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // PS 4 / PS 5
        $table->string('type'); // PS4 / PS5
        $table->integer('price_per_day');
        $table->enum('status', ['available', 'rented'])->default('available');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('playstations');
    }
};
