<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Page;

class PageController extends Controller
{
    /**
     * getPages
     * Get all pages
     *
     * @return void
     */
    public function getPages() {
        $pages = Page::all();
        return response()->json($pages);
    }


    /**
     * savePage
     * Create or update a page
     *
     * @param  mixed $request - Request object containing the page data
     *
     * @return void
     */
    public function savePage(Request $request) {
        $page = Page::where('id','=',$request->json("id"))->first();
        if(!$page) {
            $page = new Page;
        }
        $page->title = $request->json('title');
        $page->title_de = $request->json('title_de');
        $page->title_pl = $request->json('title_pl');
        $page->title_sk = $request->json('title_sk');
        $page->title_sl = $request->json('title_sl');
        $page->title_cs = $request->json('title_cs');
        $page->url = $request->json('url');
        $page->navigation = $request->json('navigation');
        $page->save();

        $pages = Page::all();
        return response()->json($pages);

    }

    /**
     * removePage
     * Remove a page
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function removePage(Request $request) {
        $page = Page::where('id','=',$request->json("id"))->first();
        if($page) {
            $page->delete();
        }
        $pages = Page::all();
        return response()->json($pages);
    }
}
