<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('time_capsules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('location');
            $table->dateTime('reveal_date');
            $table->boolean('is_public')->default(true);
            $table->string('color')->nullable();
            $table->string('emoji')->nullable();
            $table->string('privacy')->default('Public');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_capsules');
    }
};
