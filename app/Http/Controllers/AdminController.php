<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    public function download(Wedding $wedding): StreamedResponse
    {
        $wedding->load('images');

        $zip = new \ZipArchive;
        $zipFileName = tempnam(sys_get_temp_dir(), 'wedding_').'.zip';

        if ($zip->open($zipFileName, \ZipArchive::CREATE) !== true) {
            abort(500, 'Could not create zip archive.');
        }

        foreach ($wedding->images as $image) {
            $filePath = Storage::disk('public')->path($image->image_path);
            if (file_exists($filePath)) {
                $zip->addFile($filePath, basename($image->image_path));
            }
        }

        $zip->close();

        return new StreamedResponse(function () use ($zipFileName) {
            readfile($zipFileName);
            unlink($zipFileName);
        }, 200, [
            'Content-Type' => 'application/zip',
            'Content-Disposition' => 'attachment; filename="'.$wedding->title.'.zip"',
            'Content-Length' => filesize($zipFileName),
        ]);
    }
}
