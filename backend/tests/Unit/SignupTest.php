<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class SignupTest extends TestCase
{

    // Undo all changes to the database after test
    use DatabaseTransactions;
    use WithoutMiddleware;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testSignup()
    {
        // Creates a new user in the DB
        $response = $this->json('POST', '/api/user/signup', [
            'username' => 'John Doe',
            'email' => 'john@doe.com',
            'password' => 'password'
        ]);

        // Checks if the request was successfull and the response is correct
        $response
            ->assertStatus(200)
            ->assertJson([
                'username' => 'John Doe',
                'email' => 'john@doe.com'
            ]);

        // Check if new user is written to database
        $this->assertDatabaseHas('users', [
        'email' => 'john@doe.com'
        ]);



        // Writes the same user to the database again
        $response = $this->json('POST', '/api/user/signup', [
            'username' => 'John Doe',
            'email' => 'john@doe.com',
            'password' => 'password'
        ]);

        // Check if the according error message is sent to the frontend
        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => 'expert.contribute.signup.error.user_exists'
            ]);
    }

}
