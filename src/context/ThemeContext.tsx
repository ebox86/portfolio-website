import React from 'react';

export type ThemeMode = 'light' | 'dark';

const ThemeContext = React.createContext<ThemeMode>('light');

export default ThemeContext;
