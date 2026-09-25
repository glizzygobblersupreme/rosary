import { ORDINALS, SETS, type Mystery, type SetId } from '../data/mysteries';
import type { PrayerId } from '../data/prayers';
import type { Settings } from './settings';

/** One block on a segment screen. `count` taps of the counter pass through it. */
export interface Item {
  key: string;
  kind: 'mystery' | 'prayer';
  prayerId?: PrayerId;
  count: number;
  note?: string;
}

export interface Segment {
  id: string;
  kind: 'opening' | 'decade' | 'closing';
  /** Short name for the map and the "next" button, e.g. "Second decade". */
  label: string;
  /** Second line in the map, e.g. the mystery title. */
  detail: string;
  ordinal?: string;
  mystery?: Mystery;
  items: Item[];
}

type SequenceOptions = Pick<
  Settings,
  'fatima' | 'salve' | 'popeIntentions' | 'stMichael' | 'memorare' | 'litany'
>;

const prayer = (key: string, prayerId: PrayerId, count = 1, note?: string): Item => ({
  key,
  kind: 'prayer',
  prayerId,
  count,
  note,
});

export function buildSegments(setId: SetId, o: SequenceOptions): Segment[] {
  const opening: Segment = {
    id: 'opening',
    kind: 'opening',
    label: 'Opening prayers',
    detail: 'Creed, Our Father, three Hail Marys',
    items: [
      prayer('cross', 'signOfCross'),
      prayer('creed', 'creed'),
      prayer('of', 'ourFather'),
      prayer('hm', 'hailMary', 3, 'For an increase of faith, hope and charity'),
      prayer('gb', 'gloryBe'),
    ],
  };

  const decades: Segment[] = SETS[setId].mysteries.map((mystery, i) => ({
    id: `decade-${i + 1}`,
    kind: 'decade',
    label: `${ORDINALS[i]} decade`,
    detail: mystery.title,
    ordinal: ORDINALS[i],
    mystery,
    items: [
      { key: 'mystery', kind: 'mystery', count: 1 },
      prayer('of', 'ourFather'),
      prayer('hm', 'hailMary', 10),
      prayer('gb', 'gloryBe'),
      ...(o.fatima ? [prayer('fatima', 'fatima')] : []),
    ],
  }));

  const closingItems: Item[] = [
    ...(o.salve
      ? [prayer('salve', 'hailHolyQueen'), prayer('versicle', 'versicle'), prayer('concluding', 'concluding')]
      : []),
    ...(o.litany ? [prayer('litany', 'litany')] : []),
    ...(o.popeIntentions
      ? [
          prayer('pope-of', 'ourFather', 1, 'For the intentions of the Holy Father'),
          prayer('pope-hm', 'hailMary'),
          prayer('pope-gb', 'gloryBe'),
        ]
      : []),
    ...(o.stMichael ? [prayer('michael', 'stMichael')] : []),
    ...(o.memorare ? [prayer('memorare', 'memorare')] : []),
    prayer('cross', 'signOfCross'),
  ];

  const closing: Segment = {
    id: 'closing',
    kind: 'closing',
    label: 'Closing prayers',
    detail: o.salve ? 'Hail, Holy Queen' : 'Sign of the Cross',
    items: closingItems,
  };

  return [opening, ...decades, closing];
}

export const stepCount = (segment: Segment) => segment.items.reduce((n, item) => n + item.count, 0);

/** Which item a step falls in, and how far through that item's count it is. */
export function locate(segment: Segment, step: number): { itemIndex: number; within: number } {
  let remaining = step;
  for (let i = 0; i < segment.items.length; i++) {
    if (remaining < segment.items[i].count) return { itemIndex: i, within: remaining };
    remaining -= segment.items[i].count;
  }
  const last = segment.items.length - 1;
  return { itemIndex: last, within: segment.items[last].count - 1 };
}
