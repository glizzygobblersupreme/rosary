import type { Item, Segment } from './sequence';

// Where each prayer sits on a physical five-decade rosary, following the beads
// from the crucifix up the pendant (single bead, three beads, single bead) to
// the centre medal and then around the loop.
//
// Bead ids, in the order they are prayed:
//   crucifix, p1, p2-0..2, p3, medal,
//   d1-0..9, gap1, l2, d2-0..9, gap2, l3, ... d5-0..9, gap5   (then the medal again)

export interface BeadPlace {
  /** Beads (or spaces) this prayer is said on. */
  ids: string[];
  /** Short name of the spot, e.g. "The ten beads". */
  name: string;
  /** One line saying whether to move your fingers on, and to where, before this prayer. */
  hint: string;
}

const range = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}-${i}`);

/** Every bead id in prayer order; its index is how far along the rosary it is. */
export const BEAD_ORDER: string[] = [
  'crucifix',
  'p1',
  ...range('p2', 3),
  'p3',
  'medal',
  ...[1, 2, 3, 4, 5].flatMap((d) => [...(d > 1 ? [`l${d}`] : []), ...range(`d${d}`, 10), `gap${d}`]),
];

/**
 * @param decade 1–5 for a decade segment, ignored otherwise
 * @param within which of the item's repeats is being prayed, or null for the item as a whole
 */
export function placeFor(segment: Segment, decade: number, item: Item, within: number | null): BeadPlace {
  if (segment.kind === 'opening') {
    switch (item.key) {
      case 'cross':
        return { ids: ['crucifix'], name: 'Crucifix', hint: 'Hold the crucifix' };
      case 'creed':
        return { ids: ['crucifix'], name: 'Crucifix', hint: 'Stay on the crucifix' };
      case 'of':
        return { ids: ['p1'], name: 'First single bead', hint: 'Move up to the first single bead' };
      case 'hm':
        return {
          ids: within === null ? range('p2', 3) : [`p2-${within}`],
          name: 'The three beads',
          hint: 'Move onto the three beads, one bead for each Hail Mary',
        };
      default:
        return { ids: ['p3'], name: 'Last single bead', hint: 'Move to the last single bead, just below the medal' };
    }
  }

  if (segment.kind === 'decade') {
    const single = decade === 1 ? 'medal' : `l${decade}`;
    const singleName = decade === 1 ? 'centre medal' : 'next single bead';
    switch (item.key) {
      case 'mystery':
        return { ids: [single], name: decade === 1 ? 'Centre medal' : 'Single bead', hint: `Move to the ${singleName} and announce the mystery` };
      case 'of':
        return { ids: [single], name: decade === 1 ? 'Centre medal' : 'Single bead', hint: decade === 1 ? 'Stay on the medal' : 'Stay on the single bead' };
      case 'hm':
        return {
          ids: within === null ? range(`d${decade}`, 10) : [`d${decade}-${within}`],
          name: 'The ten beads',
          hint: 'Move onto the ten beads, one bead for each Hail Mary',
        };
      case 'gb':
        return { ids: [`gap${decade}`], name: 'Space after the tenth bead', hint: 'Move to the space after the tenth bead' };
      default:
        return {
          ids: [`gap${decade}`],
          name: 'Space after the tenth bead',
          hint: decade === 5 ? 'Stay in the space; the medal comes next' : 'Stay in the space; a single bead comes next',
        };
    }
  }

  // closing: the loop has brought you back round to the medal
  if (item.key === 'cross') return { ids: ['crucifix'], name: 'Crucifix', hint: 'Hold the crucifix' };
  return { ids: ['medal'], name: 'Centre medal', hint: item.key === segment.items[0].key ? 'Move on to the centre medal, where the loop ends' : 'Stay on the medal' };
}

/**
 * The stretch of rosary a segment is prayed on, in order, plus the bead that
 * comes next so you can see where you are heading.
 */
export function stripFor(segment: Segment, decade: number): string[] {
  if (segment.kind === 'opening') return ['crucifix', 'p1', ...range('p2', 3), 'p3', 'medal'];
  if (segment.kind === 'closing') return ['medal', 'crucifix'];
  return [
    decade === 1 ? 'medal' : `l${decade}`,
    ...range(`d${decade}`, 10),
    `gap${decade}`,
    decade === 5 ? 'medal-next' : `l${decade + 1}`,
  ];
}

/** All beads a whole segment covers, for when the on-screen counter is not in use. */
export function placesForSegment(segment: Segment, decade: number): string[] {
  return [...new Set(segment.items.flatMap((item) => placeFor(segment, decade, item, null).ids))];
}
