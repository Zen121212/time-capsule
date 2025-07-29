<?php

namespace App\Policies;

use App\Models\TimeCapsule;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TimeCapsulePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Users can view their own time capsules
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TimeCapsule $timeCapsule): bool
    {
        // Users can view their own capsules
        if ($timeCapsule->user_id === $user->id) {
            return true;
        }
        
        // Users can view public capsules
        if ($timeCapsule->is_public || $timeCapsule->privacy === 'public') {
            return true;
        }
        
        // Users can view unlisted capsules via direct link
        if ($timeCapsule->privacy === 'unlisted') {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create time capsules
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TimeCapsule $timeCapsule): bool
    {
        // Users can only update their own time capsules
        return $timeCapsule->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimeCapsule $timeCapsule): bool
    {
        // Users can only delete their own time capsules
        return $timeCapsule->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TimeCapsule $timeCapsule): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TimeCapsule $timeCapsule): bool
    {
        return false;
    }
}
