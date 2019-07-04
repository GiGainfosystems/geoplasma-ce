<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\LocalContact;

class LocalContactcontroller extends Controller
{
    /**
     * getTags
     * Get all contacts
     *
     * @return void
     */
    public function getTags() {

        $contacts = LocalContact::all();
        return response()->json($contacts);
    }

    /**
     * saveContact
     * Save a new or update an existing contact
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function saveContact(Request $request) {

        $contacts = LocalContact::where('id','=',$request->json("id"))->first();
        if(!$contacts) {
            $contacts = new LocalContact;
        }

        $contacts->language = $request->json('language');
        $contacts->contactinfo = $request->json('contactinfo');
        $contacts->pilotarea = $request->json('pilotarea');
        $contacts->save();

        $contacts = LocalContact::all();
        return response()->json($contacts);

    }
}
