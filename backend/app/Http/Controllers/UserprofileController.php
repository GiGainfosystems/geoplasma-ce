<?php

namespace App\Http\Controllers;

use App\Userprofile;
use App\Userprofilegroup;
use Auth;
use Illuminate\Http\Request;

class UserprofileController extends Controller
{
    /**
     * getUserprofiles
     * Get all userprofiles
     *
     * @return void
     */
    public function getUserprofiles() {

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

        return response()->json($userprofiles);
    }


    /**
     * saveUserprofile
     * Create or update an existing userprofile
     *
     * @param  mixed $request - Request object contains the userprofile data
     *
     * @return void
     */
    public function saveUserprofile(Request $request) {
        $user_id = Auth::user()->id;
        $userprofile = Userprofile::where('user_id','=',$user_id)->first();
        if(!$userprofile) {
            $userprofile = new Userprofile;
        }

        $userprofile->name = $request->json('name');
        $userprofile->user_id = $user_id;
        $userprofile->street = $request->json('street');
        $userprofile->zip = $request->json('zip');
        $userprofile->city = $request->json('city');
        $userprofile->country = $request->json('country');
        $userprofile->phone = $request->json('phone');
        $userprofile->email = $request->json('email');
        $userprofile->website = $request->json('website');
        $userprofile->pilot_area = $request->json('pilotArea');
        $userprofile->lat = $request->json('lat');
        $userprofile->lon = $request->json('lon');
        $userprofile->contactform = $request->json('contactForm');
        $userprofile->activated = $request->json('activated');
        $userprofile->profile = $request->json('profile');
        $userprofile->save();

        $userprofilegroups = Userprofilegroup::where('userprofile_id','=',$userprofile->id)->get();

        foreach($userprofilegroups as $group) {
            $group->delete();
        }

        foreach($request->json('occupation') as $occupation) {
            $group = new Userprofilegroup;
            $group->userprofile_id = $userprofile->id;
            $group->group_id = $occupation;
            $group->save();
        }

        $userprofiles = Userprofile::all();
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
        return response()->json($userprofiles);
    }

    /**
     * toggleActivation
     * Activate or deactivate a useprofile (visibility on yellow pages)
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function toggleActivation(Request $request) {
        $user_id = Auth::user()->id;
        $id = $request->json('id');

        $userprofile = Userprofile::where('user_id','=',$user_id)->where('id','=',$id)->first();
        if($userprofile) {
            if($userprofile->activated) {
                $userprofile->activated = false;
            } else {
                $userprofile->activated = true;
            }
            $userprofile->save();
        }

        $userprofiles = Userprofile::all();
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
        return response()->json($userprofiles);
    }
}
