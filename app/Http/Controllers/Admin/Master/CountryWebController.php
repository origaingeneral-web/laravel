<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CountryWebController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/masters/index', ['entity' => 'countries']);
    }
}
