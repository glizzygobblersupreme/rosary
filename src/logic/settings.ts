import type { PrayerId } from '../data/prayers';

export interface Settings {
  luminous: boolean;
  seasonalSunday: boolean;
  fatima: boolean;
  salve: boolean;
  popeIntentions: boolean;
  stMichael: boolean;
  memorare: boolean;
  litany: boolean;
  meditation: boolean;
  /** Strip of beads pinned to the top of each prayer screen. */
  beadGuide: boolean;
  counter: boolean;
  vibrate: boolean;
  textScale: number;
  theme: 'dark' | 'light';
  /** Prayers known by heart: shown as a first-words cue instead of full text. */
  known: PrayerId[];
}

export const DEFAULT_SETTINGS: Settings = {
  luminous: true,
  seasonalSunday: false,
  fatima: true,
  salve: true,
  popeIntentions: false,
  stMichael: false,
  memorare: false,
  litany: false,
  meditation: true,
  beadGuide: true,
  counter: true,
  vibrate: true,
  textScale: 1,
  theme: 'dark',
  known: [],
};
