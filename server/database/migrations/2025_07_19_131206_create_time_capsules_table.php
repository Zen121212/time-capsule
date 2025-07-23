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
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->dateTime('reveal_date');
            $table->boolean('is_public')->default(true);
            $table->string('color')->nullable();
            $table->string('emoji')->nullable();
            $table->string('privacy')->default('Public');
            $table->string('unlisted_token')->nullable()->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_capsules');
    }
};
