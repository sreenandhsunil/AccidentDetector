import { useTheme } from "../contexts/ThemeContext";

export function useDarkMode() {
  const { theme, toggleTheme } = useTheme();
  
  return {
    isDarkMode: theme === "dark",
    toggleDarkMode: toggleTheme,
  };
}
