<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeddingController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Photographer routes
    Route::prefix('weddings')->name('weddings.')->group(function () {
        Route::get('/', [WeddingController::class, 'index'])->name('index');
        Route::get('/create', [WeddingController::class, 'create'])->name('create');
        Route::post('/', [WeddingController::class, 'store'])->name('store');
        Route::get('/{wedding}/upload', [WeddingController::class, 'uploadForm'])->name('upload');
        Route::post('/{wedding}/images', [ImageController::class, 'upload'])->name('images.upload');
        Route::delete('/{wedding}', [WeddingController::class, 'destroy'])->name('destroy');
    });

    // Image routes
    Route::delete('/images/{image}', [ImageController::class, 'destroy'])->name('images.destroy');
    Route::post('/images/bulk-delete', [ImageController::class, 'destroyBatch'])->name('images.destroy-batch');

    // Admin routes
    Route::middleware([AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/weddings', [AdminController::class, 'weddings'])->name('weddings');
        Route::get('/weddings/{wedding}', [AdminController::class, 'show'])->name('weddings.show');
        Route::get('/weddings/{wedding}/download', [AdminController::class, 'download'])->name('weddings.download');
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/settings.php';
