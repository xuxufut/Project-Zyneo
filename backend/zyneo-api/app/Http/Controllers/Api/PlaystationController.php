<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlaystationRequest;
use App\Http\Requests\UpdatePlaystationRequest;
use App\Http\Resources\PlaystationResource;
use App\Models\Playstation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlaystationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $playstations = Playstation::query()->latest()->get();

        return PlaystationResource::collection($playstations);
    }

    public function store(StorePlaystationRequest $request): JsonResponse
    {
        $playstation = Playstation::query()->create($request->validated());

        return (new PlaystationResource($playstation))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Playstation $playstation): PlaystationResource
    {
        return new PlaystationResource($playstation);
    }

    public function update(UpdatePlaystationRequest $request, Playstation $playstation): PlaystationResource
    {
        $playstation->update($request->validated());

        return new PlaystationResource($playstation->fresh());
    }

    public function destroy(Playstation $playstation): JsonResponse
    {
        $playstation->delete();

        return response()->json([
            'message' => 'Playstation deleted successfully.',
        ]);
    }
}
