import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { SharedData } from '@/types';

export function ToastHandler() {
    const { flash, errors } = usePage<SharedData & { errors: Record<string, string> }>().props;

    // flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    // validation errors
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors);

            // if there's only one error, show it directly
            if (errorMessages.length === 1) {
                toast.error(errorMessages[0]);
            } else {
                // if multiple errors, show them as a list
                toast.error(
                    <div>
                        <div className="font-semibold mb-1">Chyba:</div>
                        <ul className="list-disc list-inside space-y-1">
                            {errorMessages.map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
        }
    }, [errors]);

    return null;
}
