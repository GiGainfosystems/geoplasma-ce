<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Glossary;

class GlossaryController extends Controller
{
    /**
     * getGlossary
     * Get all glossary entries
     *
     * @return void
     */
    public function getGlossary() {
        $entries = Glossary::orderBy('keyword', "asc")->get();
        return response()->json($entries);
    }


    /**
     * saveGlossaryEntry
     * Create a new or update a glossary entry
     *
     * @param  mixed $request - Contains the data for the entry
     *
     * @return void
     */
    public function saveGlossaryEntry(Request $request) {

        $entry = Glossary::find($request->json('id'));
        if(!$entry) {
            $entry = new Glossary;
        }

        $entry->keyword = $request->json('keyword');
        $entry->synonyms = $request->json('synonyms');
        $entry->definition = $request->json('definition');
        $entry->link = $request->json('link');
        $entry->basic = ($request->json('basic') ? true : false);

        $entry->definition_de = $request->json('definition_de');
        $entry->definition_pl = $request->json('definition_pl');
        $entry->definition_cz = $request->json('definition_cz');
        $entry->definition_sk = $request->json('definition_sk');
        $entry->definition_sl = $request->json('definition_sl');

        $entry->keyword_de = $request->json('keyword_de');
        $entry->keyword_pl = $request->json('keyword_pl');
        $entry->keyword_cz = $request->json('keyword_cz');
        $entry->keyword_sk = $request->json('keyword_sk');
        $entry->keyword_sl = $request->json('keyword_sl');

        $entry->synonyms_de = $request->json('synonyms_de');
        $entry->synonyms_pl = $request->json('synonyms_pl');
        $entry->synonyms_cz = $request->json('synonyms_cz');
        $entry->synonyms_sk = $request->json('synonyms_sk');
        $entry->synonyms_sl = $request->json('synonyms_sl');

        $entry->save();

        $entries = Glossary::orderBy('keyword', "asc")->get();
        return response()->json($entries);
    }

    /**
     * removeGlossaryEntry
     * Remove a glossary entry
     *
     * @param  mixed $request - Contains the ID of the entry that should be deleted
     *
     * @return void
     */
    public function removeGlossaryEntry(Request $request) {

        $entry = Glossary::find($request->json('id'));
        if($entry) {
            $entry->delete();
        }

        $entries = Glossary::orderBy('keyword', "asc")->get();
        return response()->json($entries);
    }
}
