<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class TimeCapsule extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'message',
        'location',
        'latitude',
        'longitude',
        'reveal_date',
        'is_public',
        'color',
        'emoji',
        'privacy',
        'user_id',
        'ip_address',
        'unlisted_token',
    ];
    
    protected $casts = [
        'reveal_date' => 'datetime',
        'is_public' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    private function generateUniqueToken(): string
    {
        do {
            $token = Str::random(32);
        } while (self::where('unlisted_token', $token)->exists());
        
        return $token;
    }

    public function generateUnlistedToken()
    {
        $this->unlisted_token = $this->generateUniqueToken();
        $this->save();
        
        return $this->unlisted_token;
    }

    public function getShareableUrl()
    {
        if ($this->privacy !== 'unlisted' || !$this->unlisted_token) {
            return null;
        }
        
        return config('app.frontend_url', 'http://localhost:3000') . '/capsule/unlisted/' . $this->unlisted_token;
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($timeCapsule) {
            if ($timeCapsule->privacy === 'unlisted' && !$timeCapsule->unlisted_token) {
                $timeCapsule->unlisted_token = $timeCapsule->generateUniqueToken();
            }
        });
        
        static::updating(function ($timeCapsule) {
            if ($timeCapsule->privacy === 'unlisted' && !$timeCapsule->unlisted_token) {
                $timeCapsule->unlisted_token = $timeCapsule->generateUniqueToken();
            }
            
            if ($timeCapsule->privacy !== 'unlisted' && $timeCapsule->unlisted_token) {
                $timeCapsule->unlisted_token = null;
            }
        });
    }
}
