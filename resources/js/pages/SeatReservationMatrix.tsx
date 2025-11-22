import React, { useEffect, useState } from 'react';
import { Reservation, SelectedSeat } from '@/types';

interface ReservedSeatsProps {
    row_amt: number;
    col_amt: number;
    reservations: Reservation[];
    onReserve: (seats: SelectedSeat[]) => void;
    currentUserId?: number;
}

export default function SeatReservationMatrix({ row_amt, col_amt, reservations, onReserve, currentUserId }: ReservedSeatsProps) {

    useEffect(() => {
        console.dir(reservations);
    }, []);

    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

    const isSeatReserved = (row: number, col: number) => {
        return reservations.some(
            (seat) => seat.seat_row === row && seat.seat_col === col,
        );
    };

    const isSeatReservedByCurrentUser = (row: number, col: number) => {
        if (!currentUserId) return false;

        return reservations.some(
            (seat) =>
                seat.seat_row === row &&
                seat.seat_col === col &&
                seat.user_id === currentUserId,
        );
    };

    const isSeatSelected = (row: number, col: number) => {
        return selectedSeats.some(
            (seat) => seat.seat_row === row && seat.seat_col === col,
        );
    };

    const handleSeatClick = (row: number, col: number) => {
        if (isSeatReserved(row, col)) return;

        const seatIndex = selectedSeats.findIndex(
            (seat) => seat.seat_row === row && seat.seat_col === col,
        );

        if (seatIndex > -1) {
            // deselect seat
            setSelectedSeats(
                selectedSeats.filter((_, index) => index !== seatIndex),
            );
        } else {
            // select seat (max 5)
            if (selectedSeats.length < 5) {
                setSelectedSeats([
                    ...selectedSeats,
                    { seat_row: row, seat_col: col },
                ]);
            }
        }
    };

    const handleReserve = () => {
        if (selectedSeats.length > 0 && onReserve) {
            onReserve(selectedSeats);
        }
    };

    const renderSeats = () => {
        const rows = [];
        for (let row = 1; row <= row_amt; row++) {
            const cols = [];
            for (let col = 1; col <= col_amt; col++) {
                const reserved = isSeatReserved(row, col);
                const reservedByCurrentUser = isSeatReservedByCurrentUser(row, col);
                const selected = isSeatSelected(row, col);

                cols.push(
                    <button
                        key={`${row}-${col}`}
                        onClick={() => handleSeatClick(row, col)}
                        disabled={reserved}
                        className={`
                              w-8 h-8 rounded-md transition-all duration-200
                              ${reservedByCurrentUser
                                  ? 'bg-blue-500 cursor-not-allowed'
                                  : reserved
                                      ? 'bg-red-500 cursor-not-allowed'
                                      : selected
                                          ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                                          : 'bg-gray-300 hover:bg-gray-400 cursor-pointer'}
                              ${reserved || selected ? '' : 'hover:scale-120'}
                        `}
                        title={`Řada ${row}, Sedadlo ${col}`}
                    />,
                );
            }
            rows.push(
                <div key={row} className="flex gap-2 items-center">
                    <span className="w-6 text-sm font-medium text-gray-600">{row}</span>
                    <div className="flex gap-2">{cols}</div>
                </div>,
            );
        }
        return rows;
    };

    return (
        <div className="flex flex-col items-center p-6">
            <div className="mb-8 w-full max-w-3xl">
                <div className="h-2 bg-gray-300 rounded-full mb-2"></div>
                <p className="text-center text-sm">Plátno</p>
            </div>

            <div className="flex flex-col gap-2 mb-6">{renderSeats()}</div>

            <div className="flex flex-wrap gap-6 mb-6 text-sm justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
                    <span>Dostupné</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-md"></div>
                    <span>Vybrané</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
                    <span>Moje rezervace</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-md"></div>
                    <span>Rezervované</span>
                </div>
            </div>

            <div className="mb-4 text-center">
                <p className="text-lg font-semibold">
                    Vybrané sedadla: {selectedSeats.length} / 5
                </p>
                {selectedSeats.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                        {selectedSeats
                            .map(
                                (seat) =>
                                    `Řada ${seat.seat_row}, Sedadlo ${seat.seat_col}`,
                            )
                            .join(' • ')}
                    </p>
                )}
            </div>

            <button
                onClick={handleReserve}
                disabled={selectedSeats.length === 0}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
                  ${selectedSeats.length > 0
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'}
                `}
            >
                Dokončit rezervaci
            </button>
        </div>
    );
}
