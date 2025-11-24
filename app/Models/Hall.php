<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'row_amt',
        'col_amt',
    ];

    public function event(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Delete reservations that are now outside this hall's dimensions.
     */
    public function deleteOutOfBoundsReservations(): void
    {
        $rowMax = $this->row_amt;
        $colMax = $this->col_amt;

        if ($rowMax === null || $colMax === null) {
            return;
        }

        // iterate through all events in this hall and clean their reservations
        foreach ($this->event as $event) {
            $event->reservations()
                ->where(function ($query) use ($rowMax, $colMax) {
                    $query
                        ->where('seat_row', '<', 1)
                        ->orWhere('seat_col', '<', 1)
                        ->orWhere('seat_row', '>', $rowMax)
                        ->orWhere('seat_col', '>', $colMax);
                })
                ->delete();
        }
    }
}
