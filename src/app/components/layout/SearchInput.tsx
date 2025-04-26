'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get('search') || '';
    const [value, setValue] = useState(initialSearch);

    const debouncedSearch = useCallback(
        (searchValue: string) => {
            const params = new URLSearchParams(Array.from(searchParams.entries()));
            if (searchValue) {
                params.set('search', searchValue);
            } else {
                params.delete('search');
            }
            router.push(`?${params.toString()}`);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ searchParams]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            debouncedSearch(value);
        }, 500); 

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <input
            className="p-2 border rounded w-full mb-4"
            type="text"
            placeholder="Search products..."
            value={value}
            onChange={handleChange} 
        />
    );
}
