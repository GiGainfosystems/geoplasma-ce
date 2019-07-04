<?php

namespace App\Http\Controllers;

use Hash;
use Validator;
use Carbon\Carbon;
use App\Mail\ConfirmSignup;
use App\Mail\PasswordResetMail;
use App\User;
use App\Ip;
use App\Event;
use App\Knowledgerepositorycontent;
use App\PasswordReset;
use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request as Requester;


class UserController extends Controller
{
    /**
     * signUp
     * Function handles registration on the expert platform
     *
     * @param  mixed $request - Username, Email address and Password in $request
     *
     * @return void
     */
    public function signUp(Request $request)
    {

        // Validator will check if fields are filled correctly
        // Should never fail due to frontend validation
        $validator = Validator::make($request->json()->all(), [
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // In case the validator fails, a general error message will appear
        // saying that all fields are required and the email needs to be a correct address
        if($validator->fails()) {
            return response()->json([
                'form' => 'signup',
                'status' => false,
                'message' => 'forms.general.error.message.fields_required'
            ]);
        }

        $email = strtolower($request->json('email'));
        $user = User::where('email', '=', $email)->first();
        if($user) {
            return response()->json([
                'form' => 'signup',
                'status' => false,
                'message' => 'forms.signup.error.message.email_exists'
            ]);
        }

        // If validation is successfull, a new model for the user is created
        // and filled with the according inputs from the AJAX request
        $user = new User;
        $user->username = $request->json('username');
        $user->email = strtolower($request->json('email'));
        $user->password = Hash::make($request->json('password'));
        $user->confirmation_code = str_random(30);

        // Model is saved into the database
        $user->save();
        // Confirmation email is sent to the given email address
        // Confirmation email includes a link with the confirmation code added
        // Clicking the link will activate the account and make it possible to signin.
        Mail::to($user->email)->send(new ConfirmSignup($user));

        // The created user object is returned to the frontend
        unset($user->confirmation_code);
        unset($user->superuser);
        unset($user->projectpartner);

        $user->isSignedUp = true;
        return response()->json($user);
    }

    /**
     * confirmSignup
     * Function handles confirmation of an account via the link that was sent in the confirmation email
     *
     * @param  mixed $confirmation_code - Confirmation code as GET parameter
     * @param  mixed $email - Email of the user to be confirmed
     *
     * @return void
     */
    public function confirmSignup($confirmation_code, $email) {

        // Checks if a user with the given confirmation code exists
        $user = User::where('confirmation_code', '=', $confirmation_code)->where('id','=',$email)->first();

        // If a user exists with such a confirmation code, check if the account is already activated.
        if($user) {
            // If account is already confirmed return according message
            if($user->confirmed) {
                return response()->json([
                    'data' => 'confirm',
                    'status' => false,
                    'message' => 'confirmaccount.already_confirmed'
                ]);
            }
            // Confirm the user and return success message
            else {
                $user->confirmed = 1;
                $user->save();
                return response()->json([
                    'data' => 'confirm',
                    'status' => true,
                    'message' => 'confirmaccount.confirm_success'
                ]);
            }
        // User with the given confirmation code can not be found => return error message
        } else {
            return response()->json([
                'data' => 'confirm',
                'status' => false,
                'message' => 'confirmaccount.confirm_fail'
            ]);
        }
    }

    /**
     * forgotPasswordRequest
     * Function handles the request that is sent when the forgot password form is submitted
     * Checks if a user with the given mail address exists and if so sends an email with a password reset link to the email address
     *
     * @param  mixed $request - Email address
     *
     * @return void
     */
    public function forgotPasswordRequest(Request $request) {
        // Validator will check if the email field was filled correctly
        // Should never fail due to frontend validation
        $validator = Validator::make($request->json()->all(), [
            'email' => 'required|email',
        ]);

        // In case the validator fails, a general error message will appear
        // saying that a valid email must be entered
        if($validator->fails()) {
            return response()->json([
                'form' => 'forgotpassword',
                'status' => false,
                'message' => 'forgotpassword.error.general'
            ]);
        }

        // Check if a user with the given email address exists in database
        $user = User::where('email', '=', $request->json('email'))->first();
        if($user) {
            // A user with the given email address exists
            // Check if a password reset token was already created for this user
            $password_reset = PasswordReset::where('email', '=', strtolower($request->json('email')))->first();
            if(!$password_reset) {
                // No token was created for this email address
                // Create a new reset token for the given address
                $password_reset = new PasswordReset;
                $password_reset->email = $request->json('email');
                $password_reset->token = str_random(29);
                $password_reset->save();
            }
            // Send a password reset email to the given address including the token that was created
            Mail::to($password_reset->email)->send(new PasswordResetMail($password_reset, $user));

            // Return success message to the frontend
            return response()->json([
                'form' => 'forgotpassword',
                'status' => true,
                'message' => 'forgotpassword.mail_sent'
            ]);
        // No user with the given email address was found
        // Return error message that the email was not found
        } else {
            return response()->json([
                'form' => 'forgotpassword',
                'status' => false,
                'message' => 'forgotpassword.error.email_not_found'
            ]);
        }
    }

    /**
     * passwordResetRequest
     * Function checks if a password reset request exists for the given address and token
     *
     * @param  mixed $token - JWT toke 
     * @param  mixed $email - Email address
     *
     * @return void
     */
    public function passwordResetRequest($token, $email) {
      $user = User::find($email);

        // Check if a password reset was requested with the given token and email
        $password_reset = PasswordReset::where('token','=',$token)->where('email','=',$user->email)->first();

        // If password reset entry exists return success message to the frontend
        if($password_reset) {
            return response()->json([
                'data' => 'confirmpasswordreset',
                'status' => true,
                'message' => 'forgotpassword.change_password'
            ]);
        }
        // A password reset entry with the given details was not found, return error message
        else {
            return response()->json([
                'data' => 'confirmpasswordreset',
                'status' => false,
                'message' => 'forgotpassword.error.invalid_data'
            ]);
        }
    }

    /**
     * changePassword
     * // Function changes password of a user
     *
     * @param  mixed $request - Contains user object
     *
     * @return void
     */
    public function changePassword(Request $request) {


        // Validator will check if the password field was filled correctly
        // Should never fail due to frontend validation
        $validator = Validator::make($request->json()->all(), [
            'password' => 'required',
        ]);

        // In case the validator fails, a general error message will appear
        // saying that a password must be entered
        if($validator->fails()) {
            return response()->json([
                'form' => 'changepassword',
                'status' => false,
                'message' => 'changepassword.error.general'
            ]);
        }

        $user = User::find($request->json('email'));
        // Check if a password reset request was created for the given email address
        $password_reset = PasswordReset::where('token','=',$request->json('token'))->where('email','=',$user->email)->first();

        // If request was created and token is valid, get the user model for the given email
        if($password_reset) {
            $user = User::where('id', '=', $request->json('email'))->first();

            // Change the password to the password given in the request
            // Delete the password reset entry from the database and return success message
            if($user) {
                $user->password = Hash::make($request->json('password'));
                $user->save();
                // Delete password reset entry
                $password_reset->delete();
                return response()->json([
                    'form' => 'changepassword',
                    'status' => true,
                    'message' => 'changepassword.success'
                ]);
            }
            // An error occured, the user can not be found
            else {
                return response()->json([
                    'form' => 'changepassword',
                    'status' => false,
                    'message' => 'changepassword.error.general'
                ]);
            }
        // Password could not be changed because no password reset request was found
        } else {
            return response()->json([
                'form' => 'changepassword',
                'status' => false,
                'message' => 'changepassword.error.access_not_allowed'
            ]);
        }

    }
    
    /**
     * removeUser
     * Remove a user
     *
     * @return void
     */
    public function removeUser() {

      $user_id = Auth::user()->id;
      $userprofile = User::where('id','=',$user_id)->first();
      if($userprofile) {

        $events = Event::where('user_id','=',$user_id)->get();
        foreach($events as $event) {
          $event->user_id = 1;
          $event->save();
        }

        $contents = Knowledgerepositorycontent::where('user_id','=',$user_id)->get();
        foreach($contents as $content) {
          $content->user_id = 1;
          $content->save();
        }


          $userprofile->delete();
          return response()->json([
              'form' => 'removeuser',
              'status' => true,
              'message' => 'remove_user.success'
          ]);
      } else {
        return response()->json([
            'form' => 'removeuser',
            'status' => false,
            'message' => 'remove_user.error'
        ]);
      }
    }

}
