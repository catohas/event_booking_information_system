<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShowingRequest;
use App\Http\Resources\ShowingResource;
use App\Models\Showing;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

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

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('images', 'public');
        }

        Showing::create($data);

        return back()->with('success', 'Představení úspěšně vytvořeno.');
    }

    public function show(Showing $showing)
    {
        $this->authorize('view', $showing);

        return $showing;
    }

    public function update(ShowingRequest $request, Showing $showing)
    {
        $this->authorize('update', $showing);

        $data = $request->validated();

        if ($request->hasFile('image')) {

            // delete old image if exists
            if ($showing->image_path) {
                Storage::disk('public')->delete($showing->image_path);
            }
            $data['image_path'] = $request->file('image')->store('images', 'public');
        }

        try {
            $showing->updateOrFail($data);
            return back()->with('success', 'Představení úspěšně upraveno.');
        }
        catch (\Throwable $e) {
            return back()->with('error', 'Představení se nepodařilo upravit.');
        }

    }

    public function destroy(Showing $showing)
    {
        $this->authorize('delete', $showing);

        if ($showing->image_path) {
            Storage::disk('public')->delete($showing->image_path);
        }

        try {
            $showing->delete();
            return back()->with('success', 'Představení úspěšně smazáno.');
        }
        catch (\Exception $e) {
            return back()->with('error', 'Představení se nepodařilo smazat.');
        }

    }
}
