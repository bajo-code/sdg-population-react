import { useSearchParams } from 'react-router-dom';
import { useContinentsData } from '../hooks/useContinentsData';
import { ContinentChart } from './ContinentChart';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../../../components/ui/ErrorDisplay';
import { useTheme } from '../../../context/ThemeContext';

// iconos info
import infoIconLight from '../../../assets/icons/info-light.svg';
import infoIconDark from '../../../assets/icons/info-dark.svg';



export const ContinentView: React.FC = () => {

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

  const { data: continentData, isLoading, error } = useContinentsData(filterOptions);

  if (isLoading) { return <LoadingSpinner />; }
  if (error) {  return <ErrorDisplay message={error instanceof Error ? error.message : 'Failed to load continent data.'} />; }

  if (!continentData || continentData.length === 0) {
    const filtersActive = minPopulation || maxPopulation;
    let filterDescription = '';

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
            <p>No continent data available{filterDescription}.</p>
            {filtersActive && (
                <p>Please try adjusting the filters or view global data for all continents.</p>
            )}
            {!filtersActive && (
                <p>There might be an issue loading the data, or the data source might be empty.</p>
            )}
        </div>
    </div>
);
}

  // Renderizado del gráfico si hay datos
  return (
    <div className="chart-container">
        <ContinentChart data={continentData} />
    </div>
  );
};