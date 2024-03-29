<?php

// USE THIS IF YOU RUN TESTS ON LINUX
$data = require_once 'tests/TestConstants.php';
$updatedData = require_once 'tests/TestConstants.php';
$userData = require_once 'tests/TestConstants.php';
$updatedUserData = require_once 'tests/TestConstants.php';

// USE THIS IF YOU RUN TESTS ON WINDOWS
// $data = require_once 'tests\TestConstants.php';
// $updatedData = require_once 'tests\TestConstants.php';
// $userData = require_once 'tests\TestConstants.php';
// $updatedUserData = require_once 'tests\TestConstants.php';

uses(Tests\TestCase::class)
    ->beforeEach(function () {
        $this->artisan('migrate:fresh');
    })
    ->in('Feature', 'Unit', 'Global');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function apiTest($method, $route, $status, $data = null, $expectedJsonStructure = null, $expectedJsonFragment = null, $validationErrors = null): Closure
{
    return function () use ($method, $route, $data, $status, $expectedJsonStructure, $expectedJsonFragment, $validationErrors) {
        $request = match ($method) {
            'GET' => $this->getJson(route($route)),
            'SHOW' => $this->getJson(route($route, $data)),
            'POST' => $this->postJson(route($route), $data),
            'PUT' => $this->putJson(route($route, 1), $data),
            'DELETE' => $this->deleteJson(route($route, 1)),
        };

        $request->assertStatus($status);

        $expectedJsonStructure && $request->assertJsonStructure($expectedJsonStructure);
        $expectedJsonFragment && $request->assertJsonFragment($expectedJsonFragment);
        $validationErrors && $request->assertJsonValidationErrors($validationErrors);
    };
}

// TESTS GROUPS

uses()
    ->group('user-api')
    ->in('Feature/Api/User');

uses()
    ->group('contact-api')
    ->in('Feature/Api/Contact');

uses()
    ->group('feature')
    ->in('Feature');

uses()
    ->group('global')
    ->in('Global');

uses()
    ->group('unit')
    ->in('Unit');

uses()
    ->group('controllers')
    ->in('Unit/Controllers');

uses()
    ->group('database')
    ->in('Feature/Database');

uses()
    ->group('factories')
    ->in('Feature/Database/Factories');

uses()
    ->group('migrations')
    ->in('Feature/Database/Migrations');

uses()
    ->group('models')
    ->in('Unit/Models');
