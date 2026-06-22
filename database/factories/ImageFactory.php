<?php

namespace Database\Factories;

use App\Models\Image;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Image>
 */
class ImageFactory extends Factory
{
    protected $model = Image::class;

    public function definition(): array
    {
        return [
            'wedding_id' => Wedding::factory(),
            'image_path' => 'weddings/'.fake()->uuid().'.jpg',
        ];
    }
}
