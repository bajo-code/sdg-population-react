import { useState, useEffect, useMemo } from 'react';
import { getAllCountries } from '../services/continentService';
import { aggregatePopulationByContinent } from '../utils/aggregateData';
import type { ApiCountry } from '../types';


interface PopulationFilterOptions {
  minPopulation?: number;
  maxPopulation?: number;
}

export const useContinentsData = (options?: PopulationFilterOptions) => {
  const minPopulationFilter = options?.minPopulation ?? 0;
  const maxPopulationFilter = options?.maxPopulation ?? Infinity;

  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); setError(null);
      try {
        const fetchedCountries = await getAllCountries();
        setCountries(fetchedCountries);
      } catch (err) {
        console.error("Error in useContinentsData:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setCountries([]);
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // useMemo para datos 
  const aggregatedData = useMemo(() => {
    return countries ? aggregatePopulationByContinent(countries) : [];
  }, [countries]);

  // --- useMemo para FILTRADO
  const filteredData = useMemo(() => {
    if (!aggregatedData) return [];

    return aggregatedData.filter(continent => {
      // Aplica filtro MIN
      const passesMin = continent.population >= minPopulationFilter;
      // Aplica filtro MAX
      const passesMax = continent.population <= maxPopulationFilter;
      // Debe pasar AMBOS filtros
      return passesMin && passesMax;
    });
  }, [aggregatedData, minPopulationFilter, maxPopulationFilter]);

  // useMemo para continentNames
  const continentNames = useMemo(() => {
    if (!countries) return [];
    const regions = countries
      .map(country => country.region)
      .filter(region => region && region !== 'Antarctic');
    return Array.from(new Set(regions)).sort();
  }, [countries]);

  // Devolver el estado y los datos
  return {
    data: filteredData,
    continentNames,
    isLoading,
    error,
  };
};