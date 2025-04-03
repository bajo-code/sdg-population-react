import { ApiCountry, AggregatedContinentData } from '../types';

export const aggregatePopulationByContinent = (countries: ApiCountry[]): AggregatedContinentData[] => {
  const continentMap: { [key: string]: number } = {};

  countries.forEach(country => {
    // Usamos 'region' como el continente principal. Ignoramos Antártida si existe.
    const continent = country.region;
    if (continent && continent !== 'Antarctic') {
      continentMap[continent] = (continentMap[continent] || 0) + country.population;
    }
  });

  return Object.entries(continentMap)
    .map(([name, population]) => ({ name, population }))
    .sort((a, b) => b.population - a.population); // Ordenar por población desc
};