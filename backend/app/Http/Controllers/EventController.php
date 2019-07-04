<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Event;
use Auth;

class EventController extends Controller
{
    /**
     * getEvents - Get all events for the knowledge platform
     *
     * @return void
     */
    public function getEvents() {
        $events = Event::orderBy('date1', "asc")->get();
        return response()->json($events);
    }

    /**
     * saveEvent - Create a new or update an event
     *
     * @param  mixed $request - Request object containing the event data
     *
     * @return void
     */
    public function saveEvent(Request $request) {

        $user_id = Auth::user()->id;

        $event = Event::where('user_id','=',$user_id)->where('id','=',$request->json("id"))->first();
        if(!$event) {
            $event = new Event;
        }

        $event->user_id = $user_id;
        $event->name = $request->json('name');
        $event->organized_by = $request->json('organized_by');
        $event->contact = $request->json('contact');
        $event->contact_email = $request->json('contact_email');
        $event->date1 = $request->json('date1');
        $event->date2 = $request->json('date2');
        $event->location = $request->json('location');
        $event->country = $request->json('country');
        $event->website = $request->json('website');

        $event->save();

        $events = Event::orderBy('date1', "asc")->get();
        return response()->json($events);

    }
    
    /**
     * removeEvent - remove an event
     *
     * @param  mixed $request - Request object containing the ID of the event that should be deleted
     *
     * @return void
     */
    public function removeEvent(Request $request) {
        $user_id = Auth::user()->id;
        $event = Event::where('user_id','=',$user_id)->where('id','=',$request->json("id"))->first();
        if($event) {
            $event->delete();
        }

        $events = Event::orderBy('date1', "asc")->get();
        return response()->json($events);
    }
}
