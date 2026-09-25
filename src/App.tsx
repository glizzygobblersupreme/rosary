import { useCallback, useEffect, useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { SETS, type SetId } from './data/mysteries';
import { setForDate } from './data/schedule';
import Home from './components/Home';
import MapDrawer from './components/MapDrawer';
import SegmentScreen from './components/SegmentScreen';
import SettingsSheet from './components/SettingsSheet';
import { useStoredState } from './hooks/useStoredState';
import { useToday } from './hooks/useToday';
import { useWakeLock } from './hooks/useWakeLock';
import { advance, back, clamp, fresh, jump, nextSegment, prevSegment, restore, type Progress } from './logic/progress';
import { buildSegments, locate } from './logic/sequence';
import { DEFAULT_SETTINGS, type Settings } from './logic/settings';
import { makeTheme } from './theme';

const reviveSettings = (stored: unknown): Settings => ({
  ...DEFAULT_SETTINGS,
  ...(stored && typeof stored === 'object' ? (stored as Partial<Settings>) : {}),
});

export default function App() {
  const today = useToday();
  const [settings, setSettings] = useStoredState('rosary.settings', reviveSettings);
  const todaysSet = useMemo(
    () => setForDate(new Date(), settings),
    [today, settings.luminous, settings.seasonalSunday],
  );
  const [stored, setProgress] = useStoredState('rosary.progress', (raw) => restore(raw, today, todaysSet));

  const segments = useMemo(() => buildSegments(stored.setId, settings), [stored.setId, settings]);
  const progress = clamp(stored, segments);

  // Open straight onto the place you stopped at, if there is one from today.
  const [view, setView] = useState<'home' | 'pray'>(progress.started && !progress.done ? 'pray' : 'home');
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Offline-first: the service worker serves the cached app; when a newer build
  // has been fetched in the background, the start screen offers to switch.
  const {
    needRefresh: [updateReady],
    updateServiceWorker,
  } = useRegisterSW();

  // A new day: yesterday's place no longer applies.
  useEffect(() => {
    if (stored.date !== today) {
      setProgress(fresh(today, todaysSet));
      setView('home');
    }
  }, [today, todaysSet, stored.date, setProgress]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.textScale * 100}%`;
  }, [settings.textScale]);

  const theme = useMemo(() => makeTheme(settings.theme, progress.setId), [settings.theme, progress.setId]);
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.palette.background.default);
    // Tell the browser which scheme the page is already in. Without "only light", phone
    // browsers with a forced dark mode (Samsung Internet, Chrome's auto dark theme)
    // repaint the light theme as dark with white text.
    const scheme = settings.theme === 'light' ? 'only light' : 'dark';
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', scheme);
    document.documentElement.style.colorScheme = scheme;
  }, [theme, settings.theme]);

  useWakeLock(view === 'pray');

  const buzz = useCallback(
    (pattern: number | number[]) => {
      if (settings.vibrate) navigator.vibrate?.(pattern);
    },
    [settings.vibrate],
  );

  const move = useCallback(
    (next: Progress, stepped = false) => {
      if (next.done) {
        buzz([40, 80, 40, 80, 120]);
        setView('home');
      } else if (next.seg !== progress.seg) {
        buzz([35, 60, 35]);
      } else if (stepped) {
        const from = locate(segments[progress.seg], progress.step).itemIndex;
        const to = locate(segments[next.seg], next.step).itemIndex;
        // a longer pulse when a run of Hail Marys ends, so you know without looking
        buzz(from !== to && segments[progress.seg].items[from].count > 1 ? 60 : 12);
      }
      setProgress(next);
    },
    [buzz, progress.seg, progress.step, segments, setProgress],
  );

  const drawerOpen = mapOpen || settingsOpen;
  useEffect(() => {
    if (view !== 'pray' || drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('button, input, [role="slider"]')) return;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (settings.counter) move(advance(progress, segments), true);
      } else if (e.key === 'ArrowUp' || e.key === 'Backspace') move(back(progress, segments));
      else if (e.key === 'ArrowRight') move(nextSegment(progress, segments));
      else if (e.key === 'ArrowLeft') move(prevSegment(progress));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, drawerOpen, settings.counter, progress, segments, move]);

  const changeSettings = (next: Settings) => {
    setSettings(next);
    // Until you have begun, the day's set follows the schedule options.
    if (!progress.started && !progress.done) {
      const set = setForDate(new Date(), next);
      if (set !== progress.setId) setProgress(fresh(today, set));
    }
  };

  const startAt = (seg: number, setId: SetId = progress.setId) => {
    setProgress(jump({ ...progress, setId }, seg));
    setMapOpen(false);
    setView('pray');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {view === 'home' ? (
        <Home
          progress={progress}
          todaysSet={todaysSet}
          segments={segments}
          schedule={settings}
          onPickSet={(setId) => setProgress(fresh(today, setId))}
          onStartAt={startAt}
          onContinue={() => setView('pray')}
          onOpenSettings={() => setSettingsOpen(true)}
          updateReady={updateReady}
          onUpdate={() => updateServiceWorker(true)}
        />
      ) : (
        <SegmentScreen
          setAdjective={SETS[progress.setId].adjective}
          segments={segments}
          seg={progress.seg}
          step={progress.step}
          settings={settings}
          onAdvance={() => move(advance(progress, segments), true)}
          onBack={() => move(back(progress, segments))}
          onNext={() => move(nextSegment(progress, segments))}
          onPrev={() => move(prevSegment(progress))}
          onOpenMap={() => setMapOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}
      <MapDrawer
        open={mapOpen}
        title={SETS[progress.setId].name}
        segments={segments}
        current={progress.seg}
        onClose={() => setMapOpen(false)}
        onPick={startAt}
        onHome={() => {
          setMapOpen(false);
          setView('home');
        }}
      />
      <SettingsSheet
        open={settingsOpen}
        settings={settings}
        onChange={changeSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </ThemeProvider>
  );
}
