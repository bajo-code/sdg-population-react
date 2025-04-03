import { useSearchParams } from 'react-router-dom';
import { useCountriesData } from '../hooks/useCountriesData';
import { CountryChart } from './CountryChart';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../../../components/ui/ErrorDisplay';
import { useTheme } from '../../../context/ThemeContext';

// iconos info
import infoIconLight from '../../../assets/icons/info-light.svg';
import infoIconDark from '../../../assets/icons/info-dark.svg';


export const CountryView: React.FC = () => {

  const [searchParams] = useSearchParams();

  const { theme } = useTheme();

  const minPopulationParam = searchParams.get('minPopulation');
  const maxPopulationParam = searchParams.get('maxPopulation');

  // Asegurarse que sea un número válido > 0
  const minPopulation = minPopulationParam && parseInt(minPopulationParam, 10) > 0
                        ? parseInt(minPopulationParam, 10)
                        : undefined;
  const maxPopulation = maxPopulationParam && parseInt(maxPopulationParam, 10) > 0
                        ? parseInt(maxPopulationParam, 10)
                        : undefined;

  const filterOptions = {
    minPopulation: minPopulation,
    maxPopulation: maxPopulation
  };

  const { data: countryData, continentName, isLoading, error } = useCountriesData(filterOptions);

  // Mensaje de carga específico
  if (isLoading) {  return <LoadingSpinner text={`Loading countries for ${continentName || 'selected region'}...`} />; }
  if (error) { return <ErrorDisplay message={error instanceof Error ? error.message : `Failed to load data for ${continentName}.`} />;  }
  if (!continentName) { return <ErrorDisplay message="Continent not specified in the URL." />; }

  // --- Renderizado Condicional de Estado Vacío (MODIFICADO) ---
  if (!countryData || countryData.length === 0) {
  const filtersActive = minPopulation || maxPopulation;
  let filterDescription = '';

  // Construir descripción de filtros si están activos
  if (filtersActive) {
      if (minPopulation && maxPopulation) {
          filterDescription = ` with population between ${minPopulation.toLocaleString()} and ${maxPopulation.toLocaleString()}`;
      } else if (minPopulation) {
          filterDescription = ` with population greater than ${minPopulation.toLocaleString()}`;
      } else if (maxPopulation) {
          filterDescription = ` with population less than ${maxPopulation.toLocaleString()}`;
      }
  }

  const currentInfoIcon = theme === 'light' ? infoIconDark : infoIconLight;

  return (
      <div className="empty-state-message with-icon">
         <img
            src={currentInfoIcon}
            alt="Info"
            className="empty-state-icon"
            aria-hidden="true"
          />
           <div className="empty-state-text">
              <p>No country data available for <strong>{continentName}</strong>{filterDescription}.</p>
              {filtersActive && (
                  <p>Please try adjusting the filters or select a different continent.</p>
              )}
              {!filtersActive && (
                  <p>There might be an issue loading the data for <strong>{continentName}</strong>, or this region has no listed countries.</p>
              )}
          </div>
        </div>
    );
  }

  // Renderizado del gráfico si hay datos
  return (
      <div className="chart-container">
        <CountryChart data={countryData} continentName={continentName} />
      </div>
  );
};