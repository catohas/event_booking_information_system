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

        Hall::create($request->validated());

        return back()->with('success', 'Sál úspěšně vytvořen.');
    }

    public function show(Hall $hall)
    {
        $this->authorize('view', $hall);

        return $hall;
    }

    public function update(HallRequest $request, Hall $hall)
    {
        $this->authorize('update', $hall);

        try {
            $hall->updateOrFail($request->validated());
            return back()->with('success', 'Sál úspěšně upraven.');
        }
        catch (\Throwable $e) {
            return back()->with('error', 'Sál se nepodařilo upravit.');
        }

    }

    public function destroy(Hall $hall)
    {
        $this->authorize('delete', $hall);

        try {
            $hall->delete();
            return back()->with('success', 'Sál úspěšně smazán.');
        }
        catch (\Exception $e) {
            return back()->with('error', 'Sál se nepodařilo smazat.');
        }

    }
}
