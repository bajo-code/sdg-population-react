import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getCountriesByRegion } from '../services/countryService';
import type { ApiCountry } from '../types';


interface PopulationFilterOptions {
  minPopulation?: number;
  maxPopulation?: number;
}

export const useCountriesData = (options?: PopulationFilterOptions) => {
  const { continentName } = useParams<{ continentName: string }>();

  const minPopulationFilter = options?.minPopulation ?? 0;
  const maxPopulationFilter = options?.maxPopulation ?? Infinity;

  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Efecto para obtener datos cuando cambia continentName
  useEffect(() => {
    if (!continentName) {
      setCountries([]);
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCountries = await getCountriesByRegion(continentName);
        setCountries(fetchedCountries);
      } catch (err) {
        console.error(`Error in useCountriesData for ${continentName}:`, err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setCountries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [continentName]);

  // useMemo para FILTRADO
  const filteredData = useMemo(() => {
    if (!countries) return [];

    return countries.filter(country => {
      const passesMin = country.population >= minPopulationFilter;
      // Aplica filtro MAX
      const passesMax = country.population <= maxPopulationFilter;
      // Debe pasar AMBOS filtros
      return passesMin && passesMax;
    });
  }, [countries, minPopulationFilter, maxPopulationFilter]);

  return {
    data: filteredData,
    continentName,
    isLoading,
    error,
  };
};