<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessCategoryWebController extends Controller
{
    /**
     * Render the UI page for business categories.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('admin/masters/index', ['entity' => 'business-categories']);
    }
}
