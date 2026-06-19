<?php

namespace App\Providers;

use App\Models\Wedding;
use App\Policies\WeddingPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Wedding::class => WeddingPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
