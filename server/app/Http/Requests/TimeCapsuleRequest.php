<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimeCapsuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->isMethod('post')) {
            return auth()->check();
        }


        $capsule = $this->route('timeCapsule'); 
        return $capsule && $capsule->user_id === auth()->id();
    }

    public function rules(): array
    {
        $isUpdate = $this->method() !== 'POST';

        return [
            'title' => $isUpdate ? 'sometimes|string|max:255' : 'required|string|max:255',
            'message' => $isUpdate ? 'sometimes|string' : 'required|string',
            'location' => 'sometimes|string|max:255',
            'reveal_date' => $isUpdate ? 'sometimes|date' : 'required|date',
            'is_public' => 'sometimes|boolean',
            'color' => 'nullable|string|max:7',
            'emoji' => 'nullable|string|max:4',
            'privacy' => 'nullable|string|in:public,private,unlisted',
        ];
    }
}
