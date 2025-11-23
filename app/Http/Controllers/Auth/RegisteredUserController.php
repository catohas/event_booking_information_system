<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ReservationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RegisteredUserController extends Controller
{
    use AuthorizesRequests;

    protected ReservationService $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        // if the event page sent an intended URL, store it for later redirect
        if ($request->filled('intended')) {
            $request->session()->put('url.intended', $request->input('intended'));
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function index()
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('users/index', [
            'users' => User::all()
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|in:admin,redactor,cashier,viewer',
        ]);

        $user->update([
            'name' => $request->name,
            'role' => $request->role,
        ]);

        // redirect only if the authenticated user just changed their own role
        // to something other than 'admin'
        if (($request->user()->id === $user->id) && $request->role != 'admin') {
            return redirect('/');
        }

        return back()->with('success', 'Uživatel úspěšně upraven.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        if ($request->user()->id === $user->id) {
            return redirect('/');
        }

        return back()->with('success', 'Uživatel úspěšně smazán.');
    }
}
