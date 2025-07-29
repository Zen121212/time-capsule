<?php

namespace App\Services;

use App\Models\TimeCapsule;
use App\Services\LocationService;
use Illuminate\Database\Eloquent\Collection;

class TimeCapsuleService
{
    protected $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function getUserCapsules(int $userId): Collection
    {
        return TimeCapsule::forUser($userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getPublicCapsules(): Collection
    {
        return TimeCapsule::where('is_public', true)
            ->where('privacy', 'public')
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function createCapsule(array $data, int $userId): TimeCapsule
    {
        $data['user_id'] = $userId;
        
        $userIp = $this->locationService->getRealIpAddress();
        if (!isset($data['latitude']) || !isset($data['longitude'])) {
            \Log::info('Using IP-based location');
            $location = $this->locationService->getLocationFromIp($userIp);
            $data['location'] = $location['formatted_address'];
            $data['latitude'] = $location['latitude'];
            $data['longitude'] = $location['longitude'];
        } else {
            if (!isset($data['location'])) {
                $location = $this->locationService->getLocationFromCoordinates($data['latitude'], $data['longitude']);
                $data['location'] = $location['formatted_address'] ?? 'GPS Location';
            }
        }
        
        $data['ip_address'] = $userIp;
        
        return TimeCapsule::create($data);
    }

    public function prepareCapsuleForViewing(TimeCapsule $timeCapsule, int $currentUserId): TimeCapsule
    {
        if ($timeCapsule->is_public || $timeCapsule->user_id !== $currentUserId) {
            $timeCapsule->load('user:id,name');
        }

        return $timeCapsule;
    }

    public function updateCapsule(TimeCapsule $timeCapsule, array $data): TimeCapsule
    {
        $timeCapsule->update($data);
        return $timeCapsule->fresh();
    }

    public function deleteCapsule(TimeCapsule $timeCapsule): bool
    {
        return $timeCapsule->delete();
    }

    public function findByToken(string $token): ?TimeCapsule
    {
        return TimeCapsule::where('unlisted_token', $token)
            ->where('privacy', 'unlisted')
            ->with('user:id,name')
            ->first();
    }

    public function generateShareLink(TimeCapsule $timeCapsule, int $userId): array
    {
        if ($timeCapsule->user_id !== $userId) {
            return [
                'success' => false,
                'message' => 'You can only generate share links for your own capsules'
            ];
        }
        
        if ($timeCapsule->privacy !== 'unlisted') {
            return [
                'success' => false,
                'message' => 'Share links can only be generated for unlisted capsules'
            ];
        }
        
        if (!$timeCapsule->unlisted_token) {
            $timeCapsule->generateUnlistedToken();
        }
        
        return [
            'success' => true,
            'share_url' => $timeCapsule->getShareableUrl(),
            'token' => $timeCapsule->unlisted_token
        ];
    }

    public function canUserAccessCapsule(TimeCapsule $timeCapsule, int $userId): bool
    {
        return $timeCapsule->user_id === $userId || 
               $timeCapsule->is_public || 
               $timeCapsule->privacy === 'unlisted';
    }
}
