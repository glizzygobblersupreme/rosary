import type { SetId } from '../data/mysteries';
import { stepCount, type Segment } from './sequence';

export interface Progress {
  /** Local day (YYYY-MM-DD) this progress belongs to. */
  date: string;
  setId: SetId;
  seg: number;
  step: number;
  started: boolean;
  done: boolean;
}

export const fresh = (date: string, setId: SetId): Progress => ({
  date,
  setId,
  seg: 0,
  step: 0,
  started: false,
  done: false,
});

export function jump(p: Progress, seg: number): Progress {
  return { ...p, seg, step: 0, started: true, done: false };
}

export function nextSegment(p: Progress, segments: Segment[]): Progress {
  if (p.seg >= segments.length - 1) return { ...p, done: true };
  return jump(p, p.seg + 1);
}

/** Back to the top of this segment first, then to the previous one. */
export function prevSegment(p: Progress): Progress {
  if (p.step > 0) return { ...p, step: 0 };
  return jump(p, Math.max(0, p.seg - 1));
}

export function advance(p: Progress, segments: Segment[]): Progress {
  if (p.step + 1 < stepCount(segments[p.seg])) return { ...p, step: p.step + 1, started: true };
  return nextSegment(p, segments);
}

export function back(p: Progress, segments: Segment[]): Progress {
  if (p.done) return { ...p, done: false };
  if (p.step > 0) return { ...p, step: p.step - 1 };
  if (p.seg === 0) return p;
  return { ...p, seg: p.seg - 1, step: stepCount(segments[p.seg - 1]) - 1 };
}

/** Keep a position valid after settings change the length of a segment. */
export function clamp(p: Progress, segments: Segment[]): Progress {
  const seg = Math.min(Math.max(0, p.seg), segments.length - 1);
  const step = Math.min(Math.max(0, p.step), stepCount(segments[seg]) - 1);
  return seg === p.seg && step === p.step ? p : { ...p, seg, step };
}

/** Saved progress is only good for the day it was made on. */
export function restore(saved: unknown, today: string, todaysSet: SetId): Progress {
  const p = saved as Partial<Progress> | null;
  const valid =
    p &&
    p.date === today &&
    typeof p.seg === 'number' &&
    typeof p.step === 'number' &&
    typeof p.setId === 'string' &&
    ['joyful', 'luminous', 'sorrowful', 'glorious'].includes(p.setId);
  if (!valid) return fresh(today, todaysSet);
  return { date: today, setId: p.setId!, seg: p.seg!, step: p.step!, started: !!p.started, done: !!p.done };
}
