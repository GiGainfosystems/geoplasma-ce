<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class ConfirmationTest extends TestCase
{

    use DatabaseTransactions;
    use WithoutMiddleware;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testConfirmation()
    {
        // Create a new User in DB
        $response = $this->json('POST', '/api/user/signup', [
            'username' => 'John Doe',
            'email' => 'john@doe.com',
            'password' => 'password'
        ]);

        // Get randomly generated confirmation_code from response
        $json = $response->json();
        $confirmation = $json['confirmation_code'];
        $email = $json['email'];

        // Make confirmation request including the confirmation_code
        $response = $this->json('GET', '/api/user/confirm/'.$confirmation.'/'.$email);

        // Check if request is successfull with correct message
        $response
            ->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'expert.contribute.confirm.confirm_success'
            ]);

        // Check if the according user is now confirmed in DB
        $this->assertDatabaseHas('users', [
        'email' => 'john@doe.com',
        'confirmed' => 1
        ]);

        // Check if confirmation link is visited again the correct message is sent
        $response = $this->json('GET', '/api/user/confirm/'.$confirmation.'/'.$email);
        $response
            ->assertStatus(200)
            ->assertJson([
                'status' => false,
                'message' => 'expert.contribute.confirm.already_confirmed'
            ]);
    }
}
