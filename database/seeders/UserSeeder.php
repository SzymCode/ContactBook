<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
         User::factory()->create([
             'id' => 1,
             'name' => 'Test Admin',
             'email' => 'test@example.com',
             'role' => 'admin',
             'password' => Hash::make('admin123'),
         ]);
    }
}
