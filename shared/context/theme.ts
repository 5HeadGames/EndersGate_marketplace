import { createContext } from 'react';

export type ThemeType = 'light' | 'dark';

interface ThemeContextInterface {
	theme: ThemeType;
	setTheme:
		| React.Dispatch<React.SetStateAction<ThemeType>>
		| ((value: ThemeType) => void);
}

export const ThemeContext = createContext<ThemeContextInterface>({
	theme: 'light',
	setTheme: () => null,
});
