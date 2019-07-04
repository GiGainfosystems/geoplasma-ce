<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Explanatorynote;

class ExplanatorynoteController extends Controller
{

  /**
   * getExplanatoryNotes - get all explanatory notes
   *
   * @return void
   */
  public function getExplanatoryNotes() {
      $entries = Explanatorynote::all();
      return response()->json($entries);
  }


  /**
   * saveExplanatoryNote - Create a new or update an explanatory note
   *
   * @param  mixed $request - Request object containing the note (multilingual) and and key
   *
   * @return void
   */
  public function saveExplanatoryNote(Request $request) {

      $entry = Explanatorynote::find($request->json('id'));
      if(!$entry) {
          $entry = new Explanatorynote;
      }

      $entry->key = $request->json('key');
      $entry->explanatory_note = $request->json('explanatory_note');
      $entry->explanatory_note_de = $request->json('explanatory_note_de');
      $entry->explanatory_note_cz = $request->json('explanatory_note_cz');
      $entry->explanatory_note_pl = $request->json('explanatory_note_pl');
      $entry->explanatory_note_sk = $request->json('explanatory_note_sk');
      $entry->explanatory_note_sl = $request->json('explanatory_note_sl');
      $entry->layer_description = $request->json('layer_description');
      $entry->layer_description_de = $request->json('layer_description_de');
      $entry->layer_description_cz = $request->json('layer_description_cz');
      $entry->layer_description_pl = $request->json('layer_description_pl');
      $entry->layer_description_sk = $request->json('layer_description_sk');
      $entry->layer_description_sl = $request->json('layer_description_sl');

      $entry->save();

      $entries = Explanatorynote::all();
      return response()->json($entries);
  }

}
