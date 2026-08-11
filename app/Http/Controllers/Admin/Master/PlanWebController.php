<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PlanWebController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/masters/index', ['entity' => 'plans']);
    }
}
