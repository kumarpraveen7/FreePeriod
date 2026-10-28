import { INSIGHTS, HEAT, DAYS, DAY_NAMES, HOURS } from '../data.js';
import { fmt } from '../utils.js';
import { Spark } from '../icons.jsx';

export default function Insights() {
  const max = Math.max(...INSIGHTS.map((x) => Math.max(x.want, x.offer)));
  const sorted = [...INSIGHTS].sort((a, b) => (b.want - b.offer) - (a.want - a.offer));
  const top = sorted[0];
  const heatMax = Math.max(...HEAT.flat());
  let best = { d: 0, h: 9, v: 0 };
  HEAT.forEach((row, d) => row.forEach((v, i) => { if (v > best.v) best = { d, h: HOURS[i], v }; }));

  return (
    <div className="page">
      <header className="page-head">
        <p className="kicker">The UCD Careers view</p>
        <h1 className="page-title">What students want to learn, and when they’re free</h1>
        <p className="page-sub">Anonymous totals only: no names, modules or timetables. Illustrative data for a 1,000-student pilot.</p>
      </header>

      <div className="insight-callouts">
        <div className="callout">
          <p className="callout-k">Biggest skills gap</p>
          <p className="callout-v">{top.skill}</p>
          <p>{top.want} students want to learn it and {top.offer} can teach it. Recruit those {top.offer} as peer leads for a workshop.</p>
        </div>
        <div className="side-card">
          <p className="callout-k">Best time for a workshop</p>
          <p className="callout-v">{DAY_NAMES[best.d]}, {fmt(best.h)}</p>
          <p className="muted">About {best.v} students are free on campus then.</p>
        </div>
        <div className="side-card">
          <p className="callout-k">Over-supplied skill</p>
          <p className="callout-v">{sorted[sorted.length - 1].skill}</p>
          <p className="muted">More students can teach it than want it. Point them at the gaps instead.</p>
        </div>
      </div>

      <div className="layout-even">
        <section className="chart-card" aria-labelledby="bars-title">
          <h2 id="bars-title" className="h-sub">Want to learn vs can teach</h2>
          <div className="legend">
            <span><span className="sw" style={{ background: 'var(--action)' }} />Want to learn</span>
            <span><span className="sw sw-offer" />Can teach</span>
          </div>
          <div className="bars">
            {sorted.map((x) => (
              <div key={x.skill} className="bar-row">
                <div className="bar-name"><b>{x.skill}</b><span>{x.want} want, {x.offer} teach</span></div>
                <div className="bar want" style={{ width: `${(x.want / max) * 100}%` }} />
                <div className="bar offer" style={{ width: `${(x.offer / max) * 100}%` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="chart-card" aria-labelledby="heat-title">
          <h2 id="heat-title" className="h-sub">Students free on campus</h2>
          <p className="muted small">Darker means more students free. Hover a cell for the count.</p>
          <div className="heat" role="img" aria-label={`Heatmap of free students by day and hour. Busiest free time is ${DAY_NAMES[best.d]} at ${fmt(best.h)} with about ${best.v} students.`}>
            <span />
            {HOURS.map((h) => <span key={h} className="heat-h">{h}</span>)}
            {HEAT.map((row, d) => [
              <span key={`d${d}`} className="heat-d">{DAYS[d]}</span>,
              ...row.map((v, i) => (
                <span key={`${d}-${i}`} className={`heat-cell${best.d === d && best.h === HOURS[i] ? ' best' : ''}`}
                  style={{ '--v': (v / heatMax).toFixed(2) }} title={`${DAY_NAMES[d]} ${fmt(HOURS[i])}: about ${v} students free`} />
              )),
            ])}
          </div>
          <p className="callout-inline"><Spark size={15} /><span>Tuesdays and Thursdays around midday have the most students free, so workshops there reach the most people.</span></p>
        </section>
      </div>
    </div>
  );
}
