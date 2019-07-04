<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Knowledgerepositorycontent;
use App\Glossary;
use App\Event;
use App\Explanatorynote;
use App\Page;
use App\Pilotarea;
use App\Professionalgroup;
use App\Content;
use App\Tag;
use App\Userprofile;
use App\Contentcoverage;
use App\Contenttag;
use App\Userprofilegroup;
use App\Contact;
use App\LocalContact;
use App\Unit;
use App\InternationalLink;
use App\Example;
use App\Mail\ContactForm;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class DataController extends Controller
{
    /**
     * getAllData - Fetch all data that is needed for the frontend (except Web GIS layers)
     *
     * @return void - Return all needed data
     */
    public function getAllData() {
        $response = [];


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

        $response['content'] = $contents;

        $events = Event::orderBy('date1', "asc")->get();
        $response['events'] = $events;

        $glossary = Glossary::orderBy('keyword', "asc")->get();
        $response['glossary'] = $glossary;

        $pages = Page::all();
        $response['pages'] = $pages;

        $units = Unit::orderBy('id', 'asc')->get();
        $response['units'] = $units;

        $pilotareas = Pilotarea::all();
        $response['pilotareas'] = $pilotareas;

        $professionalgroups = Professionalgroup::orderBy('name', 'asc')->get();
        $response['professionalgroups'] = $professionalgroups;

        $sitecontent = Content::orderBy('position', 'asc')->get();
        $response['sitecontent'] = $sitecontent;

        $tags = Tag::all();
        $response['tags'] = $tags;

        $localcontacts = LocalContact::all();
        $response['localcontacts'] = $localcontacts;

        $notes = Explanatorynote::all();
        $response['explanatory_notes'] = $notes;

        $links = InternationalLink::all();
        $response['links'] = $links;

        $contacts = Contact::all();
        $response['contacts'] = $contacts;

        $examples = Example::all();
        $response['examples'] = $examples;

        $userprofiles = Userprofile::orderBy('created_at', "desc")->get();
        $userprofilegroups = Userprofilegroup::all();
        foreach($userprofiles as $userprofile) {
            $occupation = [];
            foreach($userprofilegroups as $group) {
                if($userprofile->id == $group->userprofile_id) {
                    array_push($occupation, $group->group_id);
                }
            }
            $userprofile->occupation = $occupation;
        }



        $response['userprofiles'] = $userprofiles;

        return response()->json($response);
    }


    /**
     * contactForm - Send a email to a user of the yellow pages based on the Contact form
     *
     * @param  mixed $request - Request object containing the content of the contact form and the contact email
     *
     * @return void - Return success message
     */
    public function contactForm(Request $request) {

        $contactemail = $request->json('contactemail');
        $name = $request->json('name');
        $email = $request->json('email');
        $topic = $request->json('topic');
        $message = $request->json('message');

        Mail::to($contactemail)->send(new ContactForm($name, $email, $topic, $message));

        return response()->json([
            'form' => 'contactform',
            'status' => true
        ]);
    }
}
