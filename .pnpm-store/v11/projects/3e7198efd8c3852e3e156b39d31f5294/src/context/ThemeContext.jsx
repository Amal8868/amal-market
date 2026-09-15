import React, { useState, useEffect } from 'react';

import { ThemeContext } from './theme';

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('amal-theme');
        return saved ? saved === 'dark' : false; // Default: light mode
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('amal-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
            localStorage.setItem('amal-theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
