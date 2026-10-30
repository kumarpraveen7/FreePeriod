import { HOURS, TODAY, DAY_NAMES, REQUESTS, SYNONYMS, HEAT } from './data.js';

export const fmt = (h) => `${h < 10 ? '0' : ''}${h}:00`;
export const key = (d, h) => `${d}-${h}`;

export function dayLabel(d) {
  if (d === TODAY) return 'Today';
  return d < TODAY ? `Next ${DAY_NAMES[d]}` : DAY_NAMES[d];
}

export const when = (r) => `${dayLabel(r.day)}, ${fmt(r.start)} to ${fmt(r.end)}`;
export const gapLabel = (g) => `${dayLabel(g.d)}, ${fmt(g.s)} to ${fmt(g.e)}`;
export const findRequest = (id) => REQUESTS.find((r) => r.id === id) || null;
export const classHours = (classes) => Math.round(classes.reduce((a, c) => a + c.mins, 0) / 60);
export const initials = (name) => name.split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();

// Contiguous runs of free hours, e.g. [{ d: 1, s: 11, e: 14 }]
export function gaps(free) {
  const out = [];
  for (let d = 0; d < 5; d++) {
    let run = null;
    for (const h of HOURS) {
      if (free.includes(key(d, h))) {
        if (run && run.e === h) run.e = h + 1;
        else { run = { d, s: h, e: h + 1 }; out.push(run); }
      }
    }
  }
  return out;
}

export function nextGap(free) {
  const g = gaps(free);
  return g.find((x) => x.d >= TODAY) || g[0] || null;
}

// Core matching rule: a request shows if it overlaps any of your free hours. Group plans (evenings) always show.
export function overlaps(r, free) {
  if (r.type === 'event') return true;
  for (let h = r.start; h < r.end; h++) if (free.includes(key(r.day, h))) return true;
  return false;
}

export function inGap(g, free) {
  return REQUESTS.filter((r) => r.type !== 'event' && r.day === g.d && r.start < g.e && r.end > g.s && overlaps(r, free));
}

// How well a request fits your profile. Learning-type requests match what you want; helping-type match what you have.
export function fitScore(r, have, want) {
  const tags = r.tags.map((t) => t.toLowerCase());
  const h = have.map((t) => t.toLowerCase());
  const w = want.map((t) => t.toLowerCase());
  let s = 0;
  if (r.type === 'learn') s += tags.filter((t) => w.includes(t)).length * 2;
  if (r.type === 'teach' || r.type === 'team') s += tags.filter((t) => h.includes(t)).length * 2;
  if (r.type === 'swap') s += tags.filter((t) => w.includes(t) || h.includes(t)).length * 1.5;
  if (r.type === 'team') s += tags.filter((t) => w.includes(t)).length;
  return s;
}

const STOP = new Set(['i', 'me', 'my', 'a', 'an', 'the', 'to', 'for', 'with', 'and', 'or', 'on', 'in', 'of', 'need', 'help', 'want', 'learn', 'some', 'someone', 'how', 'do', 'is', 'it', 'stuck', 'keep', 'keeps', 'get', 'getting', 'can', 'please', 'about', 'minutes', 'quick']);

// Smart match: turns a plain-English need into ranked requests, with a reason for each.
// A production version would send this to an AI model; here it runs on keywords so it works offline.
export function smartMatch(query, free) {
  const tokens = query.toLowerCase().split(/[^a-z0-9+#]+/).filter((t) => t.length > 1 && !STOP.has(t));
  if (!tokens.length) return [];
  const targets = new Set();
  tokens.forEach((t) => (SYNONYMS[t] || [t]).forEach((x) => targets.add(x)));
  const results = [];
  for (const r of REQUESTS) {
    if (r.type === 'teach') continue; // someone describing a need wants people who can help them
    const tags = r.tags.map((t) => t.toLowerCase());
    const text = `${r.title} ${r.course}`.toLowerCase();
    const hitTags = r.tags.filter((t, i) => targets.has(tags[i]));
    const hitWords = tokens.filter((t) => text.includes(t));
    let score = hitTags.length * 3 + hitWords.length;
    if (!score) continue;
    const reasons = [];
    if (hitTags.length) reasons.push(`Covers ${hitTags.join(' and ')}`);
    else reasons.push(`Mentions “${hitWords[0]}”`);
    if (overlaps(r, free) && r.type !== 'event') { score += 1; reasons.push(r.day === TODAY ? 'free in your gap today' : `free when you are on ${DAY_NAMES[r.day]}`); }
    results.push({ r, score, reason: reasons.join(', ') });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Estimated number of students usually free across a gap (illustrative heat data)
export function audienceFor(g) {
  if (!g) return 0;
  let best = 0;
  for (let h = g.s; h < g.e; h++) best = Math.max(best, HEAT[g.d][h - 9] || 0);
  return best;
}

function joinList(a) {
  if (a.length < 2) return a.join('');
  return `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
}

export function cvText(passport, connections) {
  const taught = passport.filter((p) => p.kind === 'taught').map((p) => p.skill);
  const learned = passport.filter((p) => p.kind === 'learned' || p.kind === 'swapped').map((p) => p.skill);
  const projects = passport.filter((p) => p.kind === 'project').map((p) => p.skill);
  const parts = [];
  if (taught.length) parts.push(`Taught ${joinList(taught)} to students from other courses in ${taught.length} peer-verified ${taught.length === 1 ? 'session' : 'sessions'}`);
  if (learned.length) parts.push(`learned ${joinList(learned)} through peer skill exchange`);
  if (projects.length) parts.push(`joined a cross-faculty team (${joinList(projects)})`);
  const score = myRating(passport);
  if (score) parts.push(`rated ${score.avg.toFixed(1)}/5 by the students I helped`);
  parts.push(`built ${connections} connections across UCD`);
  return `Peer learning at UCD, Free Period (2026): ${parts.join('; ')}.`;
}

// A helper's average including the rating you gave them (mine), e.g. { avg: 4.9, count: 15 }
export function ratingOf(r, mine) {
  if (!r.rating) return null;
  if (!mine) return { avg: r.rating, count: r.reviews };
  return { avg: Math.round(((r.rating * r.reviews + mine) / (r.reviews + 1)) * 10) / 10, count: r.reviews + 1 };
}

// Average of the ratings learners gave you on sessions you taught
export function myRating(passport) {
  const rated = passport.filter((p) => p.kind === 'taught' && p.stars);
  if (!rated.length) return null;
  return { avg: Math.round((rated.reduce((a, p) => a + p.stars, 0) / rated.length) * 10) / 10, count: rated.length };
}

// Orders requests for the Sort control. Unrated requests (people you'd help, teams, groups) go after rated ones.
export function sortRequests(list, sort, { have, want, ratings }) {
  const time = (a, b) => a.day - b.day || a.start - b.start;
  const stars = (r) => ratingOf(r, ratings[r.id]?.stars);
  const cmp = {
    fit: (a, b) => fitScore(b, have, want) - fitScore(a, have, want) || time(a, b),
    rating: (a, b) => (stars(b)?.avg ?? -1) - (stars(a)?.avg ?? -1) || (stars(b)?.count ?? 0) - (stars(a)?.count ?? 0) || time(a, b),
    time,
  }[sort] || time;
  return [...list].sort(cmp);
}

const FIRST_REPLY = {
  learn: (r) => `Hi! Yes, still on for ${fmt(r.start)}. Bring your laptop and whatever you’re stuck on, and we’ll start from there.`,
  teach: (r) => `Thanks for offering! It’s mostly ${r.tags[0]}. I’ll have my notes open so we can get straight into it.`,
  swap: () => 'Hey! Happy to split the time half and half. You can pick which skill we do first.',
  team: (r) => `Hi! We’d love a chat. ${when(r)} is just to talk through the idea, no commitment yet.`,
  event: (r) => `Hey! The more the merrier. We’re meeting at ${r.place}.`,
};

// Demo stand-in for the other student typing back. n = how many replies they've already sent.
export function chatReply(r, n, status) {
  if (status === 'pending') return 'Just saw your request. Accepting it now!';
  if (status) return `Perfect, see you at ${r.place}.`;
  if (n === 0) return FIRST_REPLY[r.type](r);
  return 'Sounds good. Send the request when you’re ready and I’ll accept it.';
}
