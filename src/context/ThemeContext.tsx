import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Crear el contexto con un valor inicial undefined (se proveerá en el Provider)
const ThemeContext = createContext<ThemeContextProps>(undefined as any);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
    } catch (error) {
        console.error("Error reading theme from localStorage", error);
        return 'light';
    }
  });

  useEffect(() => {

    const bodyClassList = document.body.classList;
    bodyClassList.remove('light-mode', 'dark-mode');
    bodyClassList.add(`${theme}-mode`);
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error("Error saving theme to localStorage", error);
    }
  }, [theme]); // Se ejecuta cada vez que 'theme' cambia

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para el cambio de tema
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};