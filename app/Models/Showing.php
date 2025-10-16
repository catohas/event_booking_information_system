<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Showing extends Model
{
    use HasFactory;

    public function event(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
