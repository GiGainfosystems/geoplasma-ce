<?php

namespace App\Http\Controllers;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Illuminate\Http\Request;
use App\User;

class AuthenticateController extends Controller
{
    /**
     * signIn the user if the correct credentials are given
     *
     * @param  mixed $request The request object containing the given email and password
     *
     * @return void Return JSON response with the user details or error message
     */
    public function signIn(Request $request)
    {
        // Get the credentials from the request
        $email = strtolower($request->json('email'));
        $password = $request->json('password');
        $credentials = [];
        $credentials['email'] = $email;
        $credentials['password'] = $password;


        try {
            // Attempt authorization based on the credentials
            // If not successfull return error message
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'form' => 'signin',
                    'status' => false,
                    'message' => 'forms.signin.error.message.credentials'
                ]);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            // Return corresponding error message
            return response()->json([
                'form' => 'signin',
                'status' => false,
                'message' => 'forms.signin.error.message.general_error'
            ]);
        }
        // If everything worked, get user from database
        $user = User::where('email', '=',$request->json('email'))->first();
        if($user->deactivated) {
            return response()->json([
                'form' => 'signin',
                'status' => false,
                'message' => 'forms.signin.error.message.deactivated'
            ]);
        }

        $user->isLoggedIn = true;
        unset($user->confirmation_code);
        if(!$user->superuser) {
            unset($user->superuser);
        }

        if(!$user->projectpartner) {
            unset($user->projectpartner);
        }

        // If user is confirmed return the user with the authentication token to the frontend
        if($user->confirmed) {
            $user->token = compact('token');
            // all good so return the token
            return response()->json($user);
        }
        // If user is not confirmed return error message
        else {
            return response()->json([
                'form' => 'signin',
                'status' => false,
                'message' => 'forms.signin.error.message.not_confirmed'
            ]);
        }

    }

    /**
     * checkIfLoggedIn - Check the JWT token for validity
     *
     * @return void
     */
    public function checkIfLoggedIn() {
        try {

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json([]);
            }

        } catch (TokenExpiredException $e) {

            return response()->json([], $e->getStatusCode());

        } catch (TokenInvalidException $e) {

            return response()->json([], $e->getStatusCode());

        } catch (JWTException $e) {

            return response()->json([], $e->getStatusCode());

        }
        
        $user->isLoggedIn = true;
        unset($user->confirmation_code);
        if(!$user->superuser) {
            unset($user->superuser);
        }

        if(!$user->projectpartner) {
            unset($user->projectpartner);
        }

        // the token is valid and we have found the user via the sub claim
        return response()->json($user);
    }
}
