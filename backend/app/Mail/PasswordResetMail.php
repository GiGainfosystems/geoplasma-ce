<?php

namespace App\Mail;


use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\PasswordReset;
use App\User;
class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
     public function __construct(PasswordReset $password_reset, User $user)
     {
         $this->password_reset = $password_reset;
         $this->password_reset->user = $user->id;
     }

     /**
      * Build the message.
      *
      * @return $this
      */
     public function build()
     {
         return $this->from('portal@geoplasma-ce.eu')
                     ->view('email.password')->with('data', $this->password_reset);
     }
}
