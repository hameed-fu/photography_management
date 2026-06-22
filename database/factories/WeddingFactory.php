<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Wedding>
 */
class WeddingFactory extends Factory
{
    protected $model = Wedding::class;

    public function definition(): array
    {
        return [
            'title' => fake()->name().' & '.fake()->name().' Wedding',
            'event_date' => fake()->date(),
            'user_id' => User::factory(),
        ];
    }
}
