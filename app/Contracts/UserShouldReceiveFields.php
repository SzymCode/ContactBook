<?php

namespace App\Contracts;


interface UserShouldReceiveFields
{
    public function getName(): string;
    public function getEmail(): string;
    public function getRole(): string;
}
