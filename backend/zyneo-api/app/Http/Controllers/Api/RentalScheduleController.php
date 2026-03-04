<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRentalScheduleRequest;
use App\Http\Requests\UpdateRentalScheduleRequest;
use App\Http\Resources\RentalScheduleResource;
use App\Models\RentalSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RentalScheduleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $schedules = RentalSchedule::query()
            ->with('playstation')
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return RentalScheduleResource::collection($schedules);
    }

    public function store(StoreRentalScheduleRequest $request): JsonResponse
    {
        $rentalSchedule = RentalSchedule::query()->create($request->validated());

        return (new RentalScheduleResource($rentalSchedule->load('playstation')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(RentalSchedule $rentalSchedule): RentalScheduleResource
    {
        return new RentalScheduleResource($rentalSchedule->load('playstation'));
    }

    public function update(
        UpdateRentalScheduleRequest $request,
        RentalSchedule $rentalSchedule,
    ): RentalScheduleResource {
        $rentalSchedule->update($request->validated());

        return new RentalScheduleResource($rentalSchedule->fresh()->load('playstation'));
    }

    public function destroy(RentalSchedule $rentalSchedule): JsonResponse
    {
        $rentalSchedule->delete();

        return response()->json([
            'message' => 'Rental schedule deleted successfully.',
        ]);
    }
}
