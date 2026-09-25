import { createTheme } from '@mui/material/styles';
import type { SetId } from './data/mysteries';

// Ground: neutral near-black in dark mode, plain white in light mode.
// The accent changes with the mysteries being prayed, so the colour of the
// active bead tells you which set you are in without reading anything.
const ACCENT: Record<'dark' | 'light', Record<SetId, string>> = {
  dark: { joyful: '#E6A9B2', luminous: '#8FC8E6', sorrowful: '#B3A0E0', glorious: '#DFBC63' },
  light: { joyful: '#A3465A', luminous: '#1C6A92', sorrowful: '#5A4496', glorious: '#84640F' },
};

const GROUND = {
  dark: { bg: '#111111', paper: '#1C1C1C', text: '#ECE8DF', muted: '#A6A6A6', line: 'rgba(255,255,255,0.14)' },
  light: { bg: '#FFFFFF', paper: '#FFFFFF', text: '#1A1A1A', muted: '#595959', line: 'rgba(0,0,0,0.14)' },
};

export const FONT = '"Literata Variable", Georgia, "Times New Roman", serif';

export function makeTheme(mode: 'dark' | 'light', setId: SetId) {
  const g = GROUND[mode];
  const accent = ACCENT[mode][setId];
  return createTheme({
    palette: {
      mode,
      primary: { main: accent, contrastText: mode === 'dark' ? '#111111' : '#FFFFFF' },
      background: { default: g.bg, paper: g.paper },
      text: { primary: g.text, secondary: g.muted },
      divider: g.line,
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: FONT,
      h1: { fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.01em' },
      h2: { fontSize: '1.9rem', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.005em' },
      h3: { fontSize: '1.05rem', fontWeight: 650, lineHeight: 1.3 },
      body1: { fontSize: '1.2rem', lineHeight: 1.6 },
      body2: { fontSize: '1rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600, fontSize: '1.05rem' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          'html, body, #root': { height: '100%' },
          body: { overscrollBehavior: 'none', WebkitTapHighlightColor: 'transparent' },
          ':focus-visible': { outline: `2px solid ${accent}`, outlineOffset: 2 },
        },
      },
      // Ripples are a lot of movement for something looked at while praying.
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none' } } },
    },
  });
}
