import apiClient from '../../../services/apiClient'; // Ajusta la ruta
import { ApiCountry } from '../types';

// La API no da continentes directamente, obtenemos todos los países
// y filtramos/agregamos en el cliente. Pedimos solo los campos necesarios.
const RELEVANT_FIELDS = 'name,population,region';

export const getAllCountries = async (): Promise<ApiCountry[]> => {
  try {
    const response = await apiClient.get<ApiCountry[]>(`/all?fields=${RELEVANT_FIELDS}`);
    // Filtrar países sin región o población válida si es necesario
    return response.data.filter(c => c.region && typeof c.population === 'number' && c.population >= 0);
  } catch (error) {
    console.error("Error fetching all countries:", error);
    throw error;
  }
};