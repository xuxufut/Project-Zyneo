<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'playstation_id' => $this->playstation_id,
            'playstation_name' => $this->whenLoaded('playstation', fn () => $this->playstation->name),
            'customer_name' => $this->customer_name,
            'date' => $this->date?->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
