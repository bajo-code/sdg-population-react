import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ContinentView } from '../modules/continents/components/ContinentView';
import { CountryView } from '../modules/countries/components/CountryView';
import { PATHS } from './paths';

const routes: RouteObject[] = [
  {
    element: <MainLayout />, // Layout que envuelve las rutas hijas
    children: [
      {
        path: PATHS.HOME,
        element: <ContinentView />, // Vista global de continentes (home)
      },
      {
        path: PATHS.CONTINENT_DETAIL,
        element: <CountryView />, // Vista de países por continente
      },
    ],
  },
];

export const router = createBrowserRouter(routes);