<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Playstation;
use Illuminate\Http\Request;

class PlaystationController extends Controller
{
    // GET /api/playstations
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Playstation::all()
        ]);
    }

    // POST /api/playstations
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'price_per_day' => 'required|integer',
        ]);

        $playstation = Playstation::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Playstation created',
            'data' => $playstation
        ], 201);
    }

    // GET /api/playstations/{id}
    public function show($id)
    {
        $playstation = Playstation::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $playstation
        ]);
    }

    // PUT /api/playstations/{id}
    public function update(Request $request, $id)
    {
        $playstation = Playstation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|string',
            'price_per_day' => 'sometimes|integer',
            'status' => 'sometimes|in:available,rented',
        ]);

        $playstation->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Playstation updated',
            'data' => $playstation
        ]);
    }

    // DELETE /api/playstations/{id}
    public function destroy($id)
    {
        $playstation = Playstation::findOrFail($id);
        $playstation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Playstation deleted'
        ]);
    }
}
