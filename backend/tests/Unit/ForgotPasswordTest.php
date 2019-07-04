<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class PorgotPasswordTest extends TestCase
{

    use DatabaseTransactions;
    use WithoutMiddleware;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testForgotPassword()
    {
        // Create a new User in DB
        $response = $this->json('POST', '/api/user/signup', [
            'username' => 'John Doe',
            'email' => 'john@doe.com',
            'password' => 'password'
        ]);

        // Get the email address
        $json = $response->json();
        $email = $json['email'];

        // Make confirmation request including the confirmation_code
        $response = $this->json('POST', '/api/user/forgotpassword', [
            'email' => 'john@doe.com',
        ]);

        // Check if request is successfull with correct message
        $response
            ->assertStatus(200)
            ->assertJson([
                'form' => 'forgotpassword',
                'status' => true,
                'message' => 'expert.contribute.forgotpassword.mail_sent'
            ]);

        // Check if the according user is now confirmed in DB
        $this->assertDatabaseHas('password_resets', [
        'email' => 'john@doe.com'
        ]);


    }
}
