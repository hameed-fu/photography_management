<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWeddingRequest;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WeddingController extends Controller
{
    public function index(Request $request): Response
    {
        $weddings = Wedding::with('images')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('photographer/weddings', [
            'weddings' => $weddings,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('photographer/create');
    }

    public function store(StoreWeddingRequest $request): RedirectResponse
    {
        $wedding = Wedding::create([
            'title' => $request->title,
            'event_date' => $request->event_date,
            'user_id' => $request->user()->id,
        ]);

        return to_route('weddings.upload', $wedding)
            ->with('flash', ['toast' => ['type' => 'success', 'message' => 'Wedding project created successfully.']]);
    }

    public function uploadForm(Wedding $wedding): Response
    {
        $wedding->load('images');

        return Inertia::render('photographer/upload', [
            'wedding' => $wedding,
        ]);
    }

    public function destroy(Wedding $wedding): RedirectResponse
    {

        foreach ($wedding->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $wedding->delete();

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Wedding project deleted.']]);
    }
}
