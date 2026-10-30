import { HOURS } from './data.js';
import { key } from './utils.js';

// Turns an uploaded timetable (.ics calendar export or .csv) into the CLASSES shape: { d, s, e, mins, short }.
// Times are rounded out to whole hours so classes fit the grid. Anything outside Mon to Fri, 9:00 to 17:00 is left out.

const FIRST = HOURS[0];
const LAST = HOURS[HOURS.length - 1] + 1;
const DAY_WORDS = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
const ICS_DAYS = { MO: 0, TU: 1, WE: 2, TH: 3, FR: 4, SA: 5, SU: 6 };

export const CSV_TEMPLATE = 'day,start,end,module\nMon,10:00,11:00,Data Storytelling\nWed,14:00,16:00,Language Models\n';

export function parseTimetable(text, filename = '') {
  const isIcs = /\.ics$/i.test(filename) || text.includes('BEGIN:VCALENDAR');
  const raw = isIcs ? parseIcs(text) : parseCsv(text);
  const classes = tidy(raw);
  if (!classes.length) {
    throw new Error(isIcs
      ? 'No weekday classes between 9:00 and 17:00 found in that calendar.'
      : 'No classes found. Use one row per class: day, start, end, module.');
  }
  return classes;
}

// Hours between your first and last class each day that have no class are free on campus.
export function freeFromClasses(classes) {
  const free = [];
  for (let d = 0; d < 5; d++) {
    const today = classes.filter((c) => c.d === d);
    if (!today.length) continue;
    const from = Math.min(...today.map((c) => c.s));
    const to = Math.max(...today.map((c) => c.e));
    for (let h = from; h < to; h++) if (!today.some((c) => h >= c.s && h < c.e)) free.push(key(d, h));
  }
  return free;
}

function parseIcs(text) {
  const lines = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
  const out = [];
  let ev = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { ev = {}; continue; }
    if (line === 'END:VEVENT') {
      if (ev.start && ev.end) {
        const days = ev.byday?.length ? ev.byday : [ev.start.d];
        days.forEach((d) => out.push({ d, start: ev.start.t, end: ev.end.t, name: ev.name || 'Class' }));
      }
      ev = null;
      continue;
    }
    if (!ev) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const prop = line.slice(0, i).split(';')[0].toUpperCase();
    const value = line.slice(i + 1).trim();
    if (prop === 'DTSTART') ev.start = icsTime(value);
    else if (prop === 'DTEND') ev.end = icsTime(value);
    else if (prop === 'SUMMARY') ev.name = value.replace(/\\([,;\\])/g, '$1').replace(/\\n/gi, ' ');
    else if (prop === 'RRULE') {
      const m = value.match(/BYDAY=([^;]+)/);
      if (m) ev.byday = m[1].split(',').map((x) => ICS_DAYS[x.slice(-2)]).filter((x) => x !== undefined);
    }
  }
  return out;
}

// 20261027T100000 (local) or 20261027T100000Z (UTC). All-day events have no time and are skipped.
function icsTime(v) {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return null;
  const [, y, mo, da, h, mi] = m.map(Number);
  const date = v.endsWith('Z') ? new Date(Date.UTC(y, mo - 1, da, h, mi)) : new Date(y, mo - 1, da, h, mi);
  return { d: (date.getDay() + 6) % 7, t: date.getHours() + date.getMinutes() / 60 };
}

function parseCsv(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const cols = line.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 3) continue;
    const d = DAY_WORDS[cols[0].slice(0, 3).toLowerCase()];
    const start = clock(cols[1]);
    const end = clock(cols[2]);
    if (d === undefined || start === null || end === null) continue; // header or junk row
    out.push({ d, start, end, name: cols.slice(3).join(', ') || 'Class' });
  }
  return out;
}

// "10:00", "10.30", "10", "2pm", "2:30 pm" -> hours as a number
function clock(v) {
  const m = v.toLowerCase().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return h + (m[2] ? Number(m[2]) / 60 : 0);
}

// Weekdays only, rounded to the hour grid, repeats from a term export collapsed, overlaps merged.
function tidy(raw) {
  const seen = new Set();
  const list = [];
  for (const c of raw) {
    if (c.d > 4 || c.end <= c.start) continue;
    const s = Math.max(FIRST, Math.floor(c.start));
    const e = Math.min(LAST, Math.ceil(c.end));
    if (e <= s) continue;
    const id = `${c.d}-${s}-${e}-${c.name}`;
    if (seen.has(id)) continue;
    seen.add(id);
    list.push({ d: c.d, s, e, mins: Math.round((c.end - c.start) * 60), short: c.name });
  }
  list.sort((a, b) => a.d - b.d || a.s - b.s);
  const merged = [];
  for (const c of list) {
    const prev = merged[merged.length - 1];
    if (prev && prev.d === c.d && c.s < prev.e) {
      prev.e = Math.max(prev.e, c.e);
      prev.mins += c.mins;
      if (!prev.short.includes(c.short)) prev.short += ` / ${c.short}`;
    } else merged.push({ ...c });
  }
  return merged;
}
