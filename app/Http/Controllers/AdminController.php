<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function weddings(Request $request): Response
    {
        $weddings = Wedding::with('user', 'images')
            ->latest()
            ->paginate(12);

        return Inertia::render('admin/weddings', [
            'weddings' => $weddings,
        ]);
    }

    public function show(Wedding $wedding): Response
    {
        $wedding->load('user', 'images');

        return Inertia::render('admin/gallery', [
            'wedding' => $wedding,
        ]);
    }
}
