import { describe, expect, it } from 'vitest';
import { adventStart, dayKey, daysForSet, easter, setForDate } from '../data/schedule';
import { SETS } from '../data/mysteries';
import { DEFAULT_SETTINGS } from './settings';
import { buildSegments, locate, stepCount } from './sequence';
import { BEAD_ORDER, placeFor, placesForSegment, stripFor } from './beads';
import { advance, back, clamp, fresh, jump, nextSegment, prevSegment, restore } from './progress';

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day, 9);

describe('schedule', () => {
  it('follows the weekly schedule with the Luminous Mysteries', () => {
    // 13–19 Sep 2026 is Sunday to Saturday
    const week = [13, 14, 15, 16, 17, 18, 19].map((day) =>
      setForDate(d(2026, 9, day), { luminous: true, seasonalSunday: false }),
    );
    expect(week).toEqual(['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful']);
  });

  it('follows the traditional schedule without them', () => {
    const week = [13, 14, 15, 16, 17, 18, 19].map((day) =>
      setForDate(d(2026, 9, day), { luminous: false, seasonalSunday: false }),
    );
    expect(week).toEqual(['glorious', 'joyful', 'sorrowful', 'glorious', 'joyful', 'sorrowful', 'glorious']);
  });

  it('names the days each set is prayed on', () => {
    const modern = { luminous: true, seasonalSunday: false };
    expect(daysForSet('joyful', modern)).toBe('Mondays and Saturdays');
    expect(daysForSet('luminous', modern)).toBe('Thursdays');
    expect(daysForSet('glorious', modern)).toBe('Wednesdays and Sundays');
    const old = { luminous: false, seasonalSunday: true };
    expect(daysForSet('glorious', old)).toBe('Wednesdays, Saturdays and Sundays');
    expect(daysForSet('sorrowful', old)).toBe('Tuesdays, Fridays and the Sundays of Lent');
    expect(daysForSet('luminous', old)).toBe('');
  });

  it('computes Easter and Advent', () => {
    expect(dayKey(easter(2024))).toBe('2024-03-31');
    expect(dayKey(easter(2026))).toBe('2026-04-05');
    expect(dayKey(easter(2027))).toBe('2027-03-28');
    expect(dayKey(adventStart(2026))).toBe('2026-11-29');
    expect(dayKey(adventStart(2022))).toBe('2022-11-27');
    expect(dayKey(adventStart(2023))).toBe('2023-12-03');
  });

  it('applies the seasonal Sunday rule only on Sundays and only when enabled', () => {
    const on = { luminous: true, seasonalSunday: true };
    expect(setForDate(d(2026, 3, 1), on)).toBe('sorrowful'); // Sunday in Lent
    expect(setForDate(d(2026, 3, 29), on)).toBe('sorrowful'); // Palm Sunday
    expect(setForDate(d(2026, 4, 5), on)).toBe('glorious'); // Easter
    expect(setForDate(d(2026, 12, 6), on)).toBe('joyful'); // Advent
    expect(setForDate(d(2026, 1, 4), on)).toBe('joyful'); // Christmas season
    expect(setForDate(d(2026, 9, 13), on)).toBe('glorious'); // Ordinary Time
    expect(setForDate(d(2026, 3, 4), on)).toBe('glorious'); // Wednesday in Lent
    expect(setForDate(d(2026, 3, 1), { luminous: true, seasonalSunday: false })).toBe('glorious');
  });
});

describe('sequence', () => {
  const segs = buildSegments('joyful', DEFAULT_SETTINGS);

  it('has opening, five decades and closing', () => {
    expect(segs.map((s) => s.kind)).toEqual(['opening', 'decade', 'decade', 'decade', 'decade', 'decade', 'closing']);
    expect(segs[2].detail).toBe(SETS.joyful.mysteries[1].title);
  });

  it('counts steps', () => {
    expect(stepCount(segs[0])).toBe(7); // cross, creed, OF, 3 HM, GB
    expect(stepCount(segs[1])).toBe(14); // mystery, OF, 10 HM, GB, Fatima
    expect(stepCount(segs[6])).toBe(4); // salve, versicle, concluding, cross
    const bare = buildSegments('joyful', { ...DEFAULT_SETTINGS, fatima: false, salve: false });
    expect(stepCount(bare[1])).toBe(13);
    expect(stepCount(bare[6])).toBe(1);
    const full = buildSegments('joyful', {
      ...DEFAULT_SETTINGS, litany: true, popeIntentions: true, stMichael: true, memorare: true,
    });
    expect(stepCount(full[6])).toBe(10);
  });

  it('locates a step inside the Hail Marys', () => {
    expect(locate(segs[1], 0)).toEqual({ itemIndex: 0, within: 0 });
    expect(locate(segs[1], 2)).toEqual({ itemIndex: 2, within: 0 });
    expect(locate(segs[1], 11)).toEqual({ itemIndex: 2, within: 9 });
    expect(locate(segs[1], 12)).toEqual({ itemIndex: 3, within: 0 });
  });

  it('every set has five complete mysteries', () => {
    for (const set of Object.values(SETS)) {
      expect(set.mysteries).toHaveLength(5);
      for (const m of set.mysteries) {
        expect(m.title && m.fruit && m.scripture && m.citation && m.meditation).toBeTruthy();
      }
    }
  });
});

describe('bead guide', () => {
  const segs = buildSegments('glorious', DEFAULT_SETTINGS);
  const item = (seg: number, key: string) => segs[seg].items.find((i) => i.key === key)!;

  it('covers the whole rosary: 59 beads, 5 spaces and the crucifix', () => {
    expect(BEAD_ORDER).toHaveLength(1 + 5 + 1 + 50 + 4 + 5);
    expect(new Set(BEAD_ORDER).size).toBe(BEAD_ORDER.length);
  });

  it('walks the pendant from the crucifix to the medal', () => {
    expect(placeFor(segs[0], 0, item(0, 'creed'), null).ids).toEqual(['crucifix']);
    expect(placeFor(segs[0], 0, item(0, 'of'), null).ids).toEqual(['p1']);
    expect(placeFor(segs[0], 0, item(0, 'hm'), 1).ids).toEqual(['p2-1']);
    expect(placeFor(segs[0], 0, item(0, 'gb'), null).ids).toEqual(['p3']);
    expect(placeFor(segs[1], 1, item(1, 'of'), null).ids).toEqual(['medal']);
  });

  it('places decades on the loop', () => {
    expect(placeFor(segs[3], 3, item(3, 'mystery'), null).ids).toEqual(['l3']);
    expect(placeFor(segs[3], 3, item(3, 'hm'), 9).ids).toEqual(['d3-9']);
    expect(placeFor(segs[3], 3, item(3, 'fatima'), null).ids).toEqual(['gap3']);
    expect(placeFor(segs[5], 5, item(5, 'fatima'), null).hint).toMatch(/medal/);
    expect(placesForSegment(segs[2], 2)).toHaveLength(12); // single bead, ten beads, the space
  });

  it('shows only the stretch of rosary a screen uses, and every bead it lights is on it', () => {
    expect(stripFor(segs[0], 0)).toEqual(['crucifix', 'p1', 'p2-0', 'p2-1', 'p2-2', 'p3', 'medal']);
    expect(stripFor(segs[1], 1)[0]).toBe('medal');
    expect(stripFor(segs[2], 2)).toHaveLength(13);
    expect(stripFor(segs[5], 5).at(-1)).toBe('medal-next');
    segs.forEach((s, i) => {
      const d = s.kind === 'decade' ? i : 0;
      for (const id of placesForSegment(s, d)) expect(stripFor(s, d)).toContain(id);
    });
  });

  it('only ever points at beads that exist', () => {
    segs.forEach((s, i) =>
      s.items.forEach((it) => {
        for (let w = 0; w < it.count; w++) {
          for (const id of placeFor(s, s.kind === 'decade' ? i : 0, it, it.count > 1 ? w : null).ids) {
            expect(BEAD_ORDER).toContain(id);
          }
        }
      }),
    );
  });

  it('ends back at the medal, then the crucifix', () => {
    expect(placeFor(segs[6], 0, item(6, 'salve'), null)).toMatchObject({ ids: ['medal'] });
    expect(placeFor(segs[6], 0, item(6, 'cross'), null).ids).toEqual(['crucifix']);
  });
});

describe('progress', () => {
  const segs = buildSegments('sorrowful', DEFAULT_SETTINGS);
  const start = fresh('2026-09-19', 'sorrowful');

  it('advances across a segment boundary and finishes', () => {
    let p = start;
    for (let i = 0; i < 7; i++) p = advance(p, segs);
    expect(p).toMatchObject({ seg: 1, step: 0, started: true });
    const total = segs.reduce((n, s) => n + stepCount(s), 0);
    p = start;
    for (let i = 0; i < total - 1; i++) p = advance(p, segs);
    expect(p).toMatchObject({ seg: 6, step: 3, done: false });
    expect(advance(p, segs).done).toBe(true);
  });

  it('goes back across a boundary', () => {
    expect(back(jump(start, 1), segs)).toMatchObject({ seg: 0, step: 6 });
    expect(back(start, segs)).toEqual(start);
    expect(back({ ...start, seg: 6, step: 3, done: true }, segs)).toMatchObject({ seg: 6, step: 3, done: false });
  });

  it('moves by segment', () => {
    expect(nextSegment(jump(start, 3), segs)).toMatchObject({ seg: 4, step: 0 });
    expect(nextSegment(jump(start, 6), segs).done).toBe(true);
    expect(prevSegment({ ...start, seg: 3, step: 5 })).toMatchObject({ seg: 3, step: 0 });
    expect(prevSegment(jump(start, 3))).toMatchObject({ seg: 2, step: 0 });
  });

  it('clamps when a segment gets shorter', () => {
    const shorter = buildSegments('sorrowful', { ...DEFAULT_SETTINGS, fatima: false });
    expect(clamp({ ...start, seg: 2, step: 13 }, shorter)).toMatchObject({ seg: 2, step: 12 });
  });

  it('restores same-day progress and discards anything else', () => {
    const saved = { ...start, seg: 3, step: 4, started: true };
    expect(restore(saved, '2026-09-19', 'joyful')).toEqual(saved);
    expect(restore(saved, '2026-09-20', 'glorious')).toEqual(fresh('2026-09-20', 'glorious'));
    expect(restore(null, '2026-09-19', 'joyful')).toEqual(fresh('2026-09-19', 'joyful'));
    expect(restore({ date: '2026-09-19', setId: 'nope', seg: 1, step: 1 }, '2026-09-19', 'joyful')).toEqual(
      fresh('2026-09-19', 'joyful'),
    );
  });
});
