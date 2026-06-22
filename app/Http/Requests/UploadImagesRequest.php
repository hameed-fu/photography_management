<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImagesRequest extends FormRequest
{
    public const array ALLOWED_EXTENSIONS = [
        'jpeg', 'png', 'jpg', 'gif', 'webp',
        'nef', 'cr2', 'cr3', 'arw', 'dng',
        'orf', 'rw2', 'raf', 'pef', 'srw',
        'tif', 'tiff', 'bmp', 'heic', 'heif',
        'svg', 'ico', 'psd',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'images' => ['required', 'array'],
            'images.*' => [
                'required',
                'file',
                'mimes:' . implode(',', self::ALLOWED_EXTENSIONS),
                'max:204800',
                function (string $attribute, mixed $value, \Closure $fail) {
                    $ext = strtolower($value->getClientOriginalExtension());
                    if (!in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
                        $fail("Unsupported format (.{$ext}). Allowed: " . implode(', ', self::ALLOWED_EXTENSIONS));
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.max' => 'Each image must not exceed 20MB.',
        ];
    }
}
