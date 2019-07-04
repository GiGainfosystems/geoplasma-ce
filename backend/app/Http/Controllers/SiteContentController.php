<?php

namespace App\Http\Controllers;

use App\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class SiteContentController extends Controller
{
    /**
     * getSiteContent
     * Get all content for the landingpage
     *
     * @return void
     */
    public function getSiteContent() {
        $content = Content::orderBy('position', 'asc')->get();
        return response()->json($content);
    }

    /**
     * saveContent
     * Create new or update content
     *
     * @param  mixed $request - Request object containing the content
     *
     * @return void
     */
    public function saveContent(Request $request) {
        $content = Content::where('id','=',$request->json("id"))->first();
        if(!$content) {
            $content = new Content;
        }

        $content->title = $request->json('title');
        $content->title_de = $request->json('title_de');
        $content->title_cz = $request->json('title_cz');
        $content->title_pl = $request->json('title_pl');
        $content->title_sk = $request->json('title_sk');
        $content->title_sl = $request->json('title_sl');
        $content->page_id = $request->json('page_id');
        $content->text = $request->json('text');
        // The following needs to be done because an empty rich text editor will give the following input..
        $content->text_de = ($request->json('text_de') != '<p class="md-block-unstyled"><br/></p>' ? $request->json('text_de') : '');
        $content->text_cz = ($request->json('text_cz') != '<p class="md-block-unstyled"><br/></p>' ? $request->json('text_cz') : '');
        $content->text_pl = ($request->json('text_pl') != '<p class="md-block-unstyled"><br/></p>' ? $request->json('text_pl') : '');
        $content->text_sk = ($request->json('text_sk') != '<p class="md-block-unstyled"><br/></p>' ? $request->json('text_sk') : '');
        $content->text_sl = ($request->json('text_sl') != '<p class="md-block-unstyled"><br/></p>' ? $request->json('text_sl') : '');
        $content->position = $request->json('position');
        $content->save();

        $content = Content::all();
        return response()->json($content);

    }

    /**
     * removeContent
     * Remove content
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function removeContent(Request $request) {
        $content = Content::where('id','=',$request->json("id"))->first();
        if($content) {
            $content->delete();
        }
        $content = Content::all();
        return response()->json($content);
    }

    /**
     * uploadImage
     * Upload an image. This function gets called from the RTE when adding / editing content
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function uploadImage(Request $request) {

        $path = $request->file('image')->store('images', 'custom');
        $response = [];
        $response['url'] = "https://downloads.geoplasma-ce.eu/".$path;
        return response()->json($response);
    }
}
