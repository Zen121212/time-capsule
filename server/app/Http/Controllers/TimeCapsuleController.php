<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use Illuminate\Http\Request;
use App\Helpers\ApiResponse;
use App\Http\Requests\TimeCapsuleRequest;
use App\Services\TimeCapsuleService;

class TimeCapsuleController extends Controller
{
    protected $timeCapsuleService;

    public function __construct(TimeCapsuleService $timeCapsuleService)
    {
        $this->timeCapsuleService = $timeCapsuleService;
    }
    public function index()
    {
        $capsules = $this->timeCapsuleService->getUserCapsules(auth()->id());
        return ApiResponse::success($capsules, 'Time capsules retrieved');
    }

    public function getPublicCapsules()
    {
        $capsules = $this->timeCapsuleService->getPublicCapsules();
        return ApiResponse::success($capsules, 'Public time capsules retrieved');
    }

    public function store(TimeCapsuleRequest $request)
    {
        $data = $request->validated();
        $capsule = $this->timeCapsuleService->createCapsule($data, auth()->id());
        
        return ApiResponse::success($capsule, 'Time capsule created', 201);
    }

    public function show(TimeCapsule $timeCapsule)
    {
        if (!$this->timeCapsuleService->canUserAccessCapsule($timeCapsule, auth()->id())) {
            return ApiResponse::error('This action is unauthorized. You can only view your own time capsules, public ones, or unlisted ones via direct link.', 403);
        }
        
        $capsule = $this->timeCapsuleService->prepareCapsuleForViewing($timeCapsule, auth()->id());
        
        return ApiResponse::success($capsule, 'Time capsule found');
    }

    public function update(TimeCapsuleRequest $request, TimeCapsule $timeCapsule)
    {
        $updatedCapsule = $this->timeCapsuleService->updateCapsule($timeCapsule, $request->validated());
        
        return ApiResponse::success($updatedCapsule, 'Time capsule updated');
    }

    public function destroy(TimeCapsule $timeCapsule)
    {
        $this->timeCapsuleService->deleteCapsule($timeCapsule);
        
        return ApiResponse::success(null, 'Time capsule deleted', 204);
    }

    public function showByToken(string $token)
    {
        $timeCapsule = $this->timeCapsuleService->findByToken($token);
        
        if (!$timeCapsule) {
            return ApiResponse::error('Time capsule not found or invalid token', 404);
        }
        
        return ApiResponse::success($timeCapsule, 'Time capsule found');
    }

    public function generateShareLink(TimeCapsule $timeCapsule)
    {
        $result = $this->timeCapsuleService->generateShareLink($timeCapsule, auth()->id());
        
        if (!$result['success']) {
            return ApiResponse::error($result['message'], $result['message'] === 'You can only generate share links for your own capsules' ? 403 : 400);
        }
        
        return ApiResponse::success([
            'share_url' => $result['share_url'],
            'token' => $result['token']
        ], 'Share link generated');
    }
}
