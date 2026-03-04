<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Playstation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'version',
        'controllers',
        'price_per_day',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'controllers' => 'integer',
            'price_per_day' => 'integer',
        ];
    }

    public function rentalSchedules(): HasMany
    {
        return $this->hasMany(RentalSchedule::class);
    }
}
