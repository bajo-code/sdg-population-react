import apiClient from '../../../services/apiClient'; // Ajusta la ruta
import { ApiCountry } from '../types';

const RELEVANT_FIELDS = 'name,population,cca3,capital,currencies,languages'; // Pide más info si quieres

// Obtener países por región (continente)
export const getCountriesByRegion = async (region: string): Promise<ApiCountry[]> => {
   // La API usa 'region' para continentes
  if (!region) throw new Error("Region is required");

  try {
    const response = await apiClient.get<ApiCountry[]>(`/region/${encodeURIComponent(region)}?fields=${RELEVANT_FIELDS}`);
    // Filtrar o procesar si es necesario
    return response.data.filter(c => c.population >= 0).sort((a, b) => b.population - a.population); // Ordenar por población
  } catch (error) {
    console.error(`Error fetching countries for region ${region}:`, error);
    throw error;
  }
};