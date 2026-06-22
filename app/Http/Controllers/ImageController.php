<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadImagesRequest;
use App\Models\Image;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function destroyBatch(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:images,id'],
        ]);

        $images = Image::whereIn('id', $data['ids'])->get();

        foreach ($images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        $count = $images->count();

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => "{$count} image(s) deleted."]]);
    }

    public function upload(UploadImagesRequest $request, Wedding $wedding): RedirectResponse
    {
        foreach ($request->file('images') as $file) {
            $path = $file->store('weddings', 'public');

            Image::create([
                'wedding_id' => $wedding->id,
                'image_path' => $path,
            ]);
        }

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Images uploaded successfully.']]);
    }

    public function destroy(Image $image): RedirectResponse
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('flash', ['toast' => ['type' => 'success', 'message' => 'Image deleted.']]);
    }
}
