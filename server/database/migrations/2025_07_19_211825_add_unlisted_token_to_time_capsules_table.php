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
        Schema::table('time_capsules', function (Blueprint $table) {
            $table->string('unlisted_token')->nullable()->unique()->after('privacy');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            $table->dropColumn('unlisted_token');
        });
    }
};
