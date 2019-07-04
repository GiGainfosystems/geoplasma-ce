<?php

namespace App\Mail;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactForm extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $email, $topic, $message)
    {
        $this->name = $name;
        $this->email = $email;
        $this->topic = $topic;
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->email)
                    ->view('email.contact')->with([
                        'name' => $this->name,
                        'email' => $this->email,
                        'topic' => $this->topic,
                        'contactmessage' => $this->message,
                        ]);
    }
}
