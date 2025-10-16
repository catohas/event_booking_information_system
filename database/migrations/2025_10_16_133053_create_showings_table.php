<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('showings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id');
            $table->string('name');
            $table->string('type');
            $table->string('description')->nullable();
            $table->time('length');
            $table->string('image_path')->nullable();
            $table->string('actors')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('showings');
    }
};
