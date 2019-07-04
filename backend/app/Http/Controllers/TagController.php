<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;

class TagController extends Controller
{
    /**
     * getTags
     * Get all tags (knowledge repository)
     *
     * @return void
     */
    public function getTags() {

        $tags = Tag::all();
        return response()->json($tags);
    }

}
