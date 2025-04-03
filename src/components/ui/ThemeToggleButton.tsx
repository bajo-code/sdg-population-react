import { useTheme } from '../../context/ThemeContext';
import lightTheme from '../../assets/nav/light-theme.svg'
import darkTheme from '../../assets/nav/dark-theme.svg'
import './ThemeToggleButton.css';

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const Icon = theme === 'light' ? darkTheme : lightTheme;
  const buttonText = `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`;

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={buttonText}
      title={buttonText}
    >
      <img
        src={Icon}
        alt=""
        aria-hidden="true"
        className="theme-toggle-icon"
      />
    </button>
  );
};