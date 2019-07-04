<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Knowledgerepositorycontent;
use App\Contentcoverage;
use App\Contenttag;
use Illuminate\Support\Facades\Storage;
use App\Tag;
use Auth;

class ContentController extends Controller
{
    /**
     * getContent - Get the contents of the knowledge repository
     *
     * @return void - Return the contents with tags and coverages
     */
    public function getContent() {

        $contents = Knowledgerepositorycontent::orderBy('created_at', "desc")->get();
        $topics = Contentcoverage::all();
        $tags = Contenttag::all();

        foreach($contents as $content) {
            $topics_result = [];
            $tags_result = [];
            $id = $content->id;
            foreach($topics as $topic) {
                $t_id = $topic->content_id;
                if($id == $t_id) {
                    array_push($topics_result, $topic->coverage_id);
                }
            }
            foreach($tags as $tag) {
                $tag_id = $tag->content_id;
                if($id == $tag_id) {
                    $gettag = Tag::find($tag->tag_id);
                    $word = $gettag->tag;
                    array_push($tags_result, $word);
                }
            }
            $content->topics = $topics_result;
            $content->tags = $tags_result;
        }

        return response()->json($contents);
    }

    /**
     * saveContent - Save new content or update content for the knowledge platform
     *
     * @param  mixed $request - Reuqest object containing the content for the entry
     *
     * @return void - Return all contents of the knowledge platform, including the added
     */
    public function saveContent(Request $request) {


        $user_id = Auth::user()->id;

        $content = Knowledgerepositorycontent::where('user_id','=',$user_id)->where('id','=',$request->json("id"))->first();
        if(!$content) {
            $content = new Knowledgerepositorycontent;
        }

        $content->user_id = $user_id;
        $content->title = $request->json("title");
        $content->internal_id = $request->json("internal_id");
        $content->author = $request->json("author");
        $content->year = $request->json("year");
        $content->publisher_place = $request->json("publisher_place");
        $content->territorial_coverage = $request->json("territorial_coverage");
        $content->language = $request->json("language");
        $content->synopsis = $request->json("synopsis");
        $content->link = $request->json("link");
        $content->external_link = $request->json("external_link");
        $content->save();

        $topics = Contentcoverage::where('content_id','=',$content->id)->get();

        foreach($topics as $topic) {
            $topic->delete();
        }

        foreach($request->json('topics') as $topic) {
            $coverage = new Contentcoverage;
            $coverage->content_id = $content->id;
            $coverage->coverage_id = $topic;
            $coverage->save();
        }

        $tags = Contenttag::where('content_id','=',$content->id)->get();

        foreach($tags as $tag) {
            $tag->delete();
        }
        $unique = $request->json('tags');
        foreach($unique as $tag) {
            $newtag = Tag::where('tag','=',$tag)->first();
            if(!$newtag) {
                $newtag = new Tag;
                $newtag->tag = $tag;
                $newtag->save();
            }

            $connected_tag = new Contenttag;
            $connected_tag->content_id = $content->id;
            $connected_tag->tag_id = $newtag->id;
            $connected_tag->save();
        }

        $contents = Knowledgerepositorycontent::all();
        $topics = Contentcoverage::all();
        $tags = Contenttag::all();

        foreach($contents as $content) {
            $topics_result = [];
            $tags_result = [];
            $id = $content->id;
            foreach($topics as $topic) {
                $t_id = $topic->content_id;
                if($id == $t_id) {
                    array_push($topics_result, $topic->coverage_id);
                }
            }
            foreach($tags as $tag) {
                $tag_id = $tag->content_id;
                if($id == $tag_id) {
                    $gettag = Tag::find($tag->tag_id);
                    $word = $gettag->tag;
                    array_push($tags_result, $word);
                }
            }
            $content->topics = $topics_result;
            $content->tags = $tags_result;
        }

        return response()->json($contents);

    }

    /**
     * removeContent - Remove content from the knowlede platform
     *
     * @param  mixed $request - Request object containing the ID of the to-remove item
     *
     * @return void - Return all contents without the removed one
     */
    public function removeContent(Request $request) {
        $user_id = Auth::user()->id;
        $content = Knowledgerepositorycontent::where('user_id','=',$user_id)->where('id','=',$request->json("id"))->first();
        if($content) {
            $content->delete();
        }

        $contents = Knowledgerepositorycontent::all();
        $topics = Contentcoverage::all();
        $tags = Contenttag::all();

        foreach($contents as $content) {
            $topics_result = [];
            $tags_result = [];
            $id = $content->id;
            foreach($topics as $topic) {
                $t_id = $topic->content_id;
                if($id == $t_id) {
                    array_push($topics_result, $topic->coverage_id);
                }
            }
            foreach($tags as $tag) {
                $tag_id = $tag->content_id;
                if($id == $tag_id) {
                    $gettag = Tag::find($tag->tag_id);
                    $word = $gettag->tag;
                    array_push($tags_result, $word);
                }
            }
            $content->topics = $topics_result;
            $content->tags = $tags_result;
        }

        return response()->json($contents);
    }


    public function uploadContent(Request $request) {
        $path = $request->file('file')->store('content', 'custom');
        $response = [];
        $response['url'] = 'https://downloads.geoplasma-ce.eu/'.$path;
        return response()->json($response);
    }

}
