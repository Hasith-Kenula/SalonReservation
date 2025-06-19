import { DarkTheme, LightTheme } from '@/constants/Theme';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeContextType {
  theme: typeof LightTheme | typeof DarkTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DarkTheme,
  toggleTheme: () => { },
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  const theme = isDark ? DarkTheme : LightTheme;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

