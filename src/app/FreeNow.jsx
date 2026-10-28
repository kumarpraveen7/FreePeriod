import { useState } from 'react';
import { REQUESTS, TYPES, TODAY } from '../data.js';
import { nextGap, inGap, overlaps, gapLabel, fmt, fitScore, smartMatch, audienceFor, when } from '../utils.js';
import RequestCard from '../components/RequestCard.jsx';
import WeekGrid from '../components/WeekGrid.jsx';
import { Search, Spark, Clock, Pin, Arrow } from '../icons.jsx';

const FILTERS = [['all', 'All'], ['learn', 'Learn'], ['teach', 'Teach'], ['swap', 'Swap'], ['team', 'Team'], ['event', 'Group plans']];
const EXAMPLES = ['stuck on a pandas merge', 'need a designer for my hackathon team', 'practise for an interview', 'learn AI tools'];

export default function FreeNow({ state, actions }) {
  const [query, setQuery] = useState('');
  const [asked, setAsked] = useState('');
  const { free, filter, joined, myPosts, have, want } = state;
  const g = nextGap(free);
  const rank = (a, b) => fitScore(b, have, want) - fitScore(a, have, want);

  const run = (text) => { const t = (text ?? query).trim(); setQuery(t); setAsked(t); };
  const results = asked ? smartMatch(asked, free) : [];

  if (!g) {
    return (
      <div className="page">
        <div className="empty-state">
          <h1 className="page-title">No free hours marked yet</h1>
          <p className="page-sub">Mark the hours you’re on campus between classes and your matches will appear here.</p>
          <button type="button" className="btn btn-primary" onClick={() => actions.go('week')}>Mark free hours</button>
        </div>
      </div>
    );
  }

  const gapReqs = inGap(g, free);
  const pass = (r) => filter === 'all' || r.type === filter;
  const hours = [];
  for (let h = g.s; h < g.e; h++) hours.push(h);
  const rest = REQUESTS.filter((r) => overlaps(r, free) && !gapReqs.includes(r) && pass(r)).sort((a, b) => a.day - b.day || a.start - b.start);
  const later = rest.filter((r) => r.day >= TODAY);
  const next = rest.filter((r) => r.day < TODAY);
  const mySessions = REQUESTS.filter((r) => joined[r.id] === 'joined');
  const audience = audienceFor(g);

  return (
    <div className="page layout-2">
      <div className="col-main">
        <header className="page-head">
          <p className="kicker">Your next gap</p>
          <h1 className="page-title"><span className="mark">{gapLabel(g)}</span></h1>
          <p className="page-sub">
            {gapReqs.length} {gapReqs.length === 1 ? 'student has' : 'students have'} posted for this gap, and about {audience} students are usually free on campus then.
          </p>
        </header>

        <section className="smart" aria-labelledby="smart-label">
          <label id="smart-label" htmlFor="smart-input" className="smart-label"><Spark size={16} />Smart match: describe what you need</label>
          <div className="search">
            <Search />
            <input id="smart-input" value={query} placeholder="e.g. my pandas merge keeps giving duplicate rows"
              onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(); }} />
            {asked && <button type="button" className="btn-quiet" onClick={() => { setQuery(''); setAsked(''); }}>Clear</button>}
            <button type="button" className="btn btn-primary" onClick={() => run()}>Match me</button>
          </div>
          <div className="chips examples">
            {EXAMPLES.map((x) => <button key={x} type="button" className="chip" onClick={() => run(x)}>{x}</button>)}
          </div>
          {asked && (
            <div className="smart-results" aria-live="polite">
              {results.length ? (
                <>
                  <p className="group">Best matches for “{asked}”</p>
                  <div className="cards">
                    {results.map(({ r, reason }) => <RequestCard key={r.id} r={r} status={joined[r.id]} onOpen={actions.open} reason={reason} />)}
                  </div>
                </>
              ) : (
                <div className="panel">
                  <h3>No match yet</h3>
                  <p>Post it as a request, and students free in your gaps who know it will see it first.</p>
                  <div><button type="button" className="btn btn-secondary" onClick={() => actions.startPost(asked)}>Post “{asked}” <Arrow size={16} /></button></div>
                </div>
              )}
              <p className="hint">In the full version an AI model ranks matches from your words; this demo matches on keywords.</p>
            </div>
          )}
        </section>

        {myPosts.length > 0 && (
          <section>
            <h2 className="h-sub">Your requests</h2>
            <div className="cards">
              {myPosts.map((p) => (
                <div key={p.id} className="card mine">
                  <span className="row"><span className={`badge b-${p.type}`}>{TYPES[p.type].label}</span><span className="credit">Waiting for a match</span></span>
                  <span className="title">{p.title}</span>
                  <span className="meta"><Clock /><span>{p.when}</span></span>
                  <span className="meta"><Pin /><span>{p.place}</span></span>
                  <span className="why"><Spark /><span>Shown first to students free then{p.skill ? ` who know ${p.skill}` : ''}.</span></span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="section-row">
            <h2 className="h-sub">Inside your gap</h2>
            <span className="muted">Ranked by your skills</span>
          </div>
          <div className="timeline" style={{ '--cols': hours.length }}>
            {hours.map((h) => {
              const list = gapReqs.filter((r) => r.start === h && pass(r)).sort(rank);
              return (
                <div key={h} className="tl-col">
                  <div className="tl-head"><b>{fmt(h)}</b><span>{list.length ? `${list.length} ${list.length === 1 ? 'match' : 'matches'}` : 'Open slot'}</span></div>
                  {list.map((r) => <RequestCard key={r.id} r={r} status={joined[r.id]} onOpen={actions.open} compact />)}
                  {!list.length && <button type="button" className="tl-empty" onClick={() => actions.go('post')}>Post something for {fmt(h)}</button>}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="section-row">
            <h2 className="h-sub">More matches this week</h2>
          </div>
          <div className="chips filters" role="group" aria-label="Filter by type">
            {FILTERS.map(([f, label]) => (
              <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => actions.setFilter(f)}>{label}</button>
            ))}
          </div>
          {later.length > 0 && <div className="cards">{later.map((r) => <RequestCard key={r.id} r={r} status={joined[r.id]} onOpen={actions.open} />)}</div>}
          {next.length > 0 && (<><p className="group">Next week</p><div className="cards">{next.map((r) => <RequestCard key={r.id} r={r} status={joined[r.id]} onOpen={actions.open} />)}</div></>)}
          {!later.length && !next.length && <p className="muted pad">No matches of this type in your free hours. Try another filter, or mark more free hours. Monday is still empty.</p>}
        </section>
      </div>

      <aside className="col-side">
        <div className="side-card">
          <h3>Your sessions</h3>
          {mySessions.length ? (
            <ul className="agenda">
              {mySessions.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => actions.open(r.id)}>
                    <span className="agenda-time">{when(r)}</span>
                    <b>{r.title}</b>
                    <span className="muted">with {r.who}, {r.place}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="muted">Nothing booked yet. Join a session and it shows here.</p>}
        </div>
        <div className="side-card">
          <div className="section-row tight"><h3>This week</h3><button type="button" className="btn-quiet" onClick={() => actions.go('week')}>Edit</button></div>
          <WeekGrid free={free} variant="mini" />
        </div>
        <div className="side-card">
          <h3>How credits work</h3>
          <p className="muted">Teach for 20 minutes to earn 1 credit, then spend it to learn. Credits for learning are held until both of you confirm, so no-shows don’t pay off.</p>
        </div>
      </aside>
    </div>
  );
}
