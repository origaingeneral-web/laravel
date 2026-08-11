<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LanguageWebController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/masters/index', ['entity' => 'languages']);
    }
}
