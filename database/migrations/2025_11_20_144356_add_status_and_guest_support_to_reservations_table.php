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
        Schema::table('reservations', function (Blueprint $table) {
            // Add status enum: pending, confirmed, cancelled
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');

            // Add index for faster queries on active reservations
            $table->index(['event_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex(['event_id', 'status']);
            $table->dropColumn('status');
        });
    }
};
