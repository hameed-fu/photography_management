<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $stats = [
                'total_weddings' => Wedding::count(),
                'total_images' => Image::count(),
                'total_photographers' => User::where('role', 'photographer')->count(),
            ];

            $recentWeddings = Wedding::with('user')
                ->latest()
                ->take(5)
                ->get();
        } else {
            $weddingIds = Wedding::where('user_id', $user->id)->pluck('id');

            $stats = [
                'total_weddings' => $weddingIds->count(),
                'total_images' => Image::whereIn('wedding_id', $weddingIds)->count(),
                'total_photographers' => 0,
            ];

            $recentWeddings = Wedding::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentWeddings' => $recentWeddings,
        ]);
    }
}
