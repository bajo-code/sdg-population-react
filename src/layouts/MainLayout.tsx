import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useSearchParams } from 'react-router-dom';
import { PATHS } from '../router/paths';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useContinentsData as useContinentsDataForNav } from '../modules/continents/hooks/useContinentsData';
import { ThemeToggleButton } from '../components/ui/ThemeToggleButton';
import { AnimationTimingProvider } from '../context/AnimationTimingContext';

// iconos logo
import logoWhite from '../assets/nav/sdg-logo-white.webp'
import logoBlack from '../assets/nav/sdg-logo-black.webp'

//iconos nav
import GlobalLightIcon from '../assets/nav/global-light.svg';
import GlobalDarkIcon from '../assets/nav/global-dark.svg';
import AfricaLightIcon from '../assets/nav/africa-light.svg';
import AfricaDarkIcon from '../assets/nav/africa-dark.svg';
import AmericasLightIcon from '../assets/nav/america-light.svg';
import AmericasDarkIcon from '../assets/nav/america-dark.svg';
import AsiaLightIcon from '../assets/nav/asia-light.svg';
import AsiaDarkIcon from '../assets/nav/asia-dark.svg';
import EuropeLightIcon from '../assets/nav/europe-light.svg';
import EuropeDarkIcon from '../assets/nav/europe-dark.svg';
import OceaniaLightIcon from '../assets/nav/oceania-light.svg';
import OceaniaDarkIcon from '../assets/nav/oceania-dark.svg';

import './MainLayout.css';

const continentImageMap: Record<string, { light: string; dark: string }> = {
  Africa: { light: AfricaDarkIcon, dark: AfricaLightIcon },
  Americas: { light: AmericasDarkIcon, dark: AmericasLightIcon },
  Asia: { light: AsiaDarkIcon, dark: AsiaLightIcon },
  Europe: { light: EuropeDarkIcon, dark: EuropeLightIcon },
  Oceania: { light: OceaniaDarkIcon, dark: OceaniaLightIcon },
};


const formatNumberString = (value: string): string => {
  if (!value) return '';
  const numberValue = parseInt(value.replace(/\D/g, ''), 10);
  if (isNaN(numberValue)) {
    return ''; // Devuelve vacío si no es un número válido
  }
  return numberValue.toLocaleString('es-ES');
};

const unformatNumberString = (value: string): string => {
  // Reemplaza cualquier carácter que NO sea un dígito con vacío
  return value.replace(/\D/g, '');
};

const ANIMATION_DURATION_MS = 400;

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const { theme } = useTheme();

  const [visualLocationPathname, setVisualLocationPathname] = useState(location.pathname);

  const [searchParams, setSearchParams] = useSearchParams();

  const [localMinFilterInput, setLocalMinFilterInput] = useState<string>(() => {
    return unformatNumberString(searchParams.get('minPopulation') || '');
  });
  const [localMaxFilterInput, setLocalMaxFilterInput] = useState<string>(() => {
    return unformatNumberString(searchParams.get('maxPopulation') || '');
  });

  const debouncedMinFilter = useDebounce(localMinFilterInput, 500);
  const debouncedMaxFilter = useDebounce(localMaxFilterInput, 500);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { continentNames, isLoading: navIsLoading, error: navError } = useContinentsDataForNav();

  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const mainSubtitleRef = useRef<HTMLHeadingElement>(null);
  const filterContainerRef  = useRef<HTMLInputElement>(null);

  const [textAnimationsComplete, setTextAnimationsComplete] = useState(false);

  //useEffect para controlar animaciones
  useEffect(() => {
    if (location.pathname !== visualLocationPathname) {
      const timerId = setTimeout(() => {
        setVisualLocationPathname(location.pathname);
      }, ANIMATION_DURATION_MS);

      return () => clearTimeout(timerId);
    }
  }, [location.pathname, visualLocationPathname]);
    
  // useEffect Para los input
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);

    const numericMinFilter = parseInt(debouncedMinFilter, 10);
    let currentMin = 0;

    // Manejo Min Population en URL
    if (!isNaN(numericMinFilter) && numericMinFilter > 0) {
      currentParams.set('minPopulation', String(numericMinFilter));
      currentMin = numericMinFilter;
    } else {
      currentParams.delete('minPopulation');

    }

    // Manejo Max Population en URL
    const numericMaxFilter = parseInt(debouncedMaxFilter, 10);

    if (!isNaN(numericMaxFilter) && numericMaxFilter > 0) {
       if (numericMaxFilter >= currentMin) {
         currentParams.set('maxPopulation', String(numericMaxFilter));
       } else {
         currentParams.delete('maxPopulation');

       }
    } else {
       currentParams.delete('maxPopulation');
    }

    if (currentParams.toString() !== searchParams.toString()) {
      setSearchParams(currentParams, { replace: true });
    }
  }, [debouncedMinFilter, debouncedMaxFilter, searchParams, setSearchParams]);



  // Cerrar menú móvil si la ruta cambia
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMinFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatNumberString(event.target.value);
    if (/^[0-9]*$/.test(rawValue)) {
        setLocalMinFilterInput(rawValue);
    }
  };

  const handleMaxFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatNumberString(event.target.value);
    if (/^[0-9]*$/.test(rawValue)) {
        setLocalMaxFilterInput(rawValue);
    }
  };

  // Función para determinar si un enlace de continente está activo
  const isContinentLinkActive = (continent: string): boolean => {
    return location.pathname === PATHS.CONTINENT_DETAIL.replace(':continentName', continent);
  }

  const isGlobalLinkActive = (): boolean => {
    return location.pathname === PATHS.HOME;
  }

  // Función para menu hamburguesa
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cierra el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  //useEffect para animaciones
  useEffect(() => {

    let tl: gsap.core.Timeline | null = null;

    setTextAnimationsComplete(false);
    console.log(`Route changed to: ${location.pathname}. Resetting animations.`); // Para depurar

    const refsExist = mainTitleRef.current && mainSubtitleRef.current && filterContainerRef.current;
    if (refsExist) {

      gsap.set([mainTitleRef.current, mainSubtitleRef.current, filterContainerRef.current], {
        opacity: 0,
        y: 50,
        overwrite: true
      });

      // Crear la nueva timeline
      tl = gsap.timeline({
        onComplete: () => {
          setTextAnimationsComplete(true);
          console.log("GSAP text animations complete for:", location.pathname);
        }
      });

      tl.to(mainTitleRef.current, { duration: 1.0, y: 0, opacity: 1, ease: 'power3.out' }, 0.2);
      tl.to(mainSubtitleRef.current, { duration: 1.0, y: 0, opacity: 1, ease: 'power3.out' }, 0.3);
      tl.to(filterContainerRef.current, { duration: 1.0, y: 0, opacity: 1, ease: 'power3.out' }, 0.5);

    }
    return () => {
      console.log("Cleaning GSAP"); // Para depurar
      tl?.kill(); //mato el proceso cuando acaben las animaciones
    
    };

    
  }, [location.pathname]); 

  const currentLogoSrc = theme === 'light' ? logoBlack : logoWhite;
  const globalIconSrc = theme === 'light' ? GlobalDarkIcon : GlobalLightIcon;
  
  return (
  <AnimationTimingProvider value={{ textAnimationsComplete }}>
    <div className="main-layout">
    <header className="main-header">
      <nav className="main-nav">
        <div className='nav-logo-container'>
          <Link to={PATHS.HOME} className="nav-logo-link" onClick={handleLinkClick}>
            <img
              src={currentLogoSrc}
              alt="SDG Group"
              className="nav-logo"
            />
          </Link>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-controls ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link
              to={PATHS.HOME}
              className={`nav-link ${isGlobalLinkActive() ? 'active' : ''}`}
              onClick={handleLinkClick}
              title="Global"
            >
              <span className="nav-link-content">
                <img
                  src={globalIconSrc}
                  alt=""
                  aria-hidden="true"
                  className="nav-continent-icon"
                />
                <span className="nav-global-name">Global</span>
              </span>
            </Link>

          {navIsLoading && <span className="nav-link-info">Loading...</span>}
          {navError && <span className="nav-link-info error">Error</span>}

          {!navIsLoading && !navError && continentNames && continentNames.map((continent) => {
              // Obtener la imagen correcta del mapa basado en continente y tema
              const imageSrc = continentImageMap[continent]?.[theme];

              return (
                <Link
                  key={continent}
                  to={PATHS.CONTINENT_DETAIL.replace(':continentName', continent)}
                  className={`nav-link ${isContinentLinkActive(continent) ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  title={continent}
                >
                  <span className="nav-link-content">
                    {imageSrc && (
                      <img
                        src={imageSrc}
                        alt=""
                        aria-hidden="true"
                        className="nav-continent-icon"
                      />
                    )}
                    <span className="nav-continent-name">{continent}</span>
                  </span>
                </Link>
              );
            })}
        </div>

        <div className="nav-theme-toggle-container">
          <ThemeToggleButton />
        </div>
      </nav>
    </header>

    <main className="main-content">
      <div className="content-title">
        <h1 ref={mainTitleRef} className="main-title">
            <Link to={PATHS.HOME}>
              Population Explorer
            </Link>
        </h1>
        <div ref={filterContainerRef} className="filter-container">
          <h2 ref={mainSubtitleRef} className="main-subtitle">
              <Link to={PATHS.HOME}>
                Filter by population:
              </Link>
          </h2>
          <input
            type="text"
            inputMode="numeric"
            placeholder="(Min e. 1,000,000)"
            value={formatNumberString(localMinFilterInput)}
            onChange={handleMinFilterChange}
            className="filter-input"
            aria-label="Minimum population filter"
          />
           <input
            type="text"
            inputMode="numeric"
            placeholder="(Max e. 50,000,000)"
            value={formatNumberString(localMaxFilterInput)}
            onChange={handleMaxFilterChange}
            className="filter-input"
            aria-label="Maximum population filter"
          />
        </div>
      </div>
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            {visualLocationPathname === location.pathname && <Outlet />}
          </div>
        </AnimatePresence>
    </main>
  </div>
  </AnimationTimingProvider>  
 );
};
