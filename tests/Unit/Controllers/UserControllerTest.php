<?php

use App\Http\Controllers\Auth\UserController;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\UserService;

beforeEach(function () {
    $this->controller = app()->makeWith(UserController::class, ['userService' => app()->make(UserService::class)]);
});

it('runs index method successfully', function () {
    User::factory()->count(3)->create();

    $response = $this->controller->index();

    expect($response->getStatusCode())->toEqual(200);
    expect($response->getData(true)['data'])->toHaveCount(3);
});

it('runs show method successfully', function () {
    $user = User::factory()->create();

    $response = $this->controller->show($user->id);

    expect($response->getStatusCode())->toEqual(200);
    expect($response->getData(true)['data']['id'])->toEqual($user->id);
    expect($response->getData(true)['data']['name'])->toEqual($user->name);
    expect($response->getData(true)['data']['email'])->toEqual($user->email);
});

it('runs store method successfully', function () {
    $request = Mockery::mock(UserRequest::class);
    $request->shouldReceive('validated')
        ->andReturn(userData);

    $response = $this->controller->store($request);

    expect($response->getStatusCode())->toEqual(200);
    expect($response->getData(true)['data']['name'])->toEqual(userData['name']);
    expect($response->getData(true)['data']['email'])->toEqual(userData['email']);
});

it('runs update method successfully', function () {
    $user = User::factory()->create();

    $request = Mockery::mock(UserRequest::class);
    $request->shouldReceive('validated')
        ->andReturn(updatedUserData);

    $response = $this->controller->update($request, $user->id);

    expect($response->getStatusCode())->toEqual(200);
    expect($response->getData(true)['data']['name'])->toEqual(updatedUserData['name']);
    expect($response->getData(true)['data']['email'])->toEqual(updatedUserData['email']);
});

it('runs delete method successfully', function () {
    $user = User::factory()->create();

    $response = $this->controller->destroy($user->id);

    expect($response->getStatusCode())->toEqual(200);
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
