<?php

namespace App\Http\Controllers;

use App\Http\Requests\HallRequest;
use App\Http\Resources\HallResource;
use App\Models\Hall;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class HallController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Hall::class);

        return HallResource::collection(Hall::all());
    }

    public function store(HallRequest $request)
    {
        $this->authorize('create', Hall::class);

        return Hall::create($request->validated());
    }

    public function show(Hall $hall)
    {
        $this->authorize('view', $hall);

        return $hall;
    }

    public function update(HallRequest $request, Hall $hall)
    {
        $this->authorize('update', $hall);

        $hall->update($request->validated());

        return $hall;
    }

    public function destroy(Hall $hall)
    {
        $this->authorize('delete', $hall);

        $hall->delete();

        return response()->json();
    }
}
