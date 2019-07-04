<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contact;

class ContactController extends Controller
{
  
    /**
     * getContacts - Get all contacts
     *
     * @return void
     */
    public function getContacts() {
      $contacts = Contact::all();
      return response()->json($contacts);
    }

    /**
     * saveContact - Save a new contact
     *
     * @param  mixed $request - Request object containing the contact data
     *
     * @return void
     */
    public function saveContact(Request $request) {

      $position = $request->json('position');
      $title = $request->json('title');
      $name = $request->json('name');
      $company = $request->json('company');
      $email = $request->json('email');
      $phone = $request->json('phone');

      $contact = new Contact;
      $contact->position = $position;
      $contact->title = $title;
      $contact->name = $name;
      $contact->company = $company;
      $contact->email = $email;
      $contact->phone = $phone;
      $contact->save();

      $contact = Contact::all();
      return response()->json($contact);

    }

    /**
     * deleteContact - Remove a contact
     *
     * @param  mixed $request - Request object containing the ID of the to-remove item
     *
     * @return void
     */
    public function deleteContact(Request $request) {
        $contact = Contact::find($request->json("id"));
        $contact->delete();
        $contact = Contact::all();
        return response()->json($contact);
    }
}
