<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the Super Admin dashboard.
     */
    public function __invoke(): Response
    {
        return Inertia::render('dashboard');
    }
}
