import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string = string> {
    key: K;
    direction: SortDirection;
}

export type SortComparator<T> = (a: T, b: T) => number;

export type SortComparators<T, K extends string = string> = {
    [key in K]?: SortComparator<T>;
};

export function useSort<T, K extends string = string>(
    items: T[],
    initialSort: SortState<K>,
    comparators: SortComparators<T, K>,
) {
    const [sort, setSort] = useState<SortState<K>>(initialSort);

    const sortedItems = useMemo(() => {
        const comparator = comparators[sort.key];
        if (!comparator) {
            return items;
        }

        const sorted = [...items].sort((a, b) => {
            const result = comparator(a, b);
            return sort.direction === 'asc' ? result : -result;
        });

        return sorted;
    }, [items, sort, comparators]);

    const toggleSort = (key: K) => {
        setSort((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === 'asc' ? 'desc' : 'asc',
                };
            }

            return {
                key,
                direction: 'asc',
            };
        });
    };

    return {
        sort,
        sortedItems,
        toggleSort,
    } as const;
}
