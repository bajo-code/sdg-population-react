import { useState, useEffect } from 'react';


// Este hook toma un valor que probablemente cambia con frecuencia (como el texto de un input mientras el usuario escribe) y 
// devuelve una versión "debounced" (retrasada o estabilizada) de ese valor. 
// La versión debounced solo se actualiza si el valor original deja de cambiar durante un período de tiempo específico (el delay).
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);
        return () => {
        clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}