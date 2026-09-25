import type { SetId } from './mysteries';

export interface ScheduleOptions {
  /** Include the Luminous Mysteries (Thursday). Off = traditional 15-mystery week. */
  luminous: boolean;
  /** Sundays of Advent and Christmas are Joyful, Sundays of Lent are Sorrowful. */
  seasonalSunday: boolean;
}

// Sunday = 0
const WITH_LUMINOUS: SetId[] = ['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'];
const TRADITIONAL: SetId[] = ['glorious', 'joyful', 'sorrowful', 'glorious', 'joyful', 'sorrowful', 'glorious'];

const DAY = 86_400_000;
const atNoon = (y: number, m: number, d: number) => new Date(y, m, d, 12);

/** Easter Sunday, Gregorian calendar (anonymous / Meeus algorithm). */
export function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return atNoon(year, month - 1, day);
}

/** First Sunday of Advent: the Sunday falling on 27 Nov – 3 Dec. */
export function adventStart(year: number): Date {
  const nov27 = atNoon(year, 10, 27);
  return new Date(nov27.getTime() + ((7 - nov27.getDay()) % 7) * DAY);
}

function sundaySeason(date: Date): SetId | null {
  const y = date.getFullYear();
  const t = atNoon(y, date.getMonth(), date.getDate()).getTime();
  const e = easter(y).getTime();
  if (t >= e - 46 * DAY && t < e) return 'sorrowful'; // Lent, Ash Wednesday to Holy Saturday
  // Advent + Christmas season, taken as running to the Baptism of the Lord (~13 Jan)
  if (t >= adventStart(y).getTime() || t <= atNoon(y, 0, 13).getTime()) return 'joyful';
  return null;
}

export function setForDate(date: Date, opts: ScheduleOptions): SetId {
  if (opts.seasonalSunday && date.getDay() === 0) {
    const seasonal = sundaySeason(date);
    if (seasonal) return seasonal;
  }
  return (opts.luminous ? WITH_LUMINOUS : TRADITIONAL)[date.getDay()];
}

const DAY_NAMES = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

/** When a set is prayed, as a phrase: "Mondays and Saturdays". Empty if it has no day. */
export function daysForSet(setId: SetId, opts: ScheduleOptions): string {
  const table = opts.luminous ? WITH_LUMINOUS : TRADITIONAL;
  // Monday first, Sunday last, the way the week is usually recited
  const days = [1, 2, 3, 4, 5, 6, 0].filter((d) => table[d] === setId).map((d) => DAY_NAMES[d]);
  if (opts.seasonalSunday && setId === 'joyful') days.push('the Sundays of Advent and Christmas');
  if (opts.seasonalSunday && setId === 'sorrowful') days.push('the Sundays of Lent');
  if (days.length < 2) return days.join('');
  return `${days.slice(0, -1).join(', ')} and ${days[days.length - 1]}`;
}

/** Local calendar day as YYYY-MM-DD; progress is keyed on this. */
export function dayKey(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}
