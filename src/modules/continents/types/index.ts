export interface ApiCountry {
    name: {
      common: string;
    };
    population: number;
    region: string; // Continente principal
    subregion?: string; // Subcontinente
    cca3: string; // Código de país
  }
  
  // Tipo para los datos agregados por continente
  export interface AggregatedContinentData {
    name: string;
    population: number;
  }