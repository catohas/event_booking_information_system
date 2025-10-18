<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShowingRequest;
use App\Http\Resources\ShowingResource;
use App\Models\Showing;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ShowingController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Showing::class);

        return ShowingResource::collection(Showing::all());
    }

    public function store(ShowingRequest $request)
    {
        $this->authorize('create', Showing::class);

        return Showing::create($request->validated());
    }

    public function show(Showing $showing)
    {
        $this->authorize('view', $showing);

        return $showing;
    }

    public function update(ShowingRequest $request, Showing $showing)
    {
        $this->authorize('update', $showing);

        $showing->update($request->validated());

        return $showing;
    }

    public function destroy(Showing $showing)
    {
        $this->authorize('delete', $showing);

        $showing->delete();

        return response()->json();
    }
}
