import { REQUESTS, TYPES, INSIGHTS } from '../data.js';
import WeekGrid from '../components/WeekGrid.jsx';
import Reveal from '../components/Reveal.jsx';
import { Logo, Arrow, Shield, Book, Users, Lock, Pin, Spark, Check } from '../icons.jsx';

const WEF = 'https://cn.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

function Ticker() {
  const items = REQUESTS.filter((r) => r.type !== 'event').slice(0, 9);
  const row = (hidden) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {items.map((r) => (
        <li key={r.id}><span className={`badge b-${r.type}`}>{TYPES[r.type].label}</span><b>{r.who}</b><span>{r.title}</span></li>
      ))}
    </ul>
  );
  return (
    <section className="ticker" aria-label="Requests on campus right now">
      <div className="ticker-label"><span className="pulse" aria-hidden="true" />On campus now</div>
      <div className="ticker-window"><div className="ticker-track">{row(false)}{row(true)}</div></div>
    </section>
  );
}

export default function Landing({ state, go }) {
  const topGaps = [...INSIGHTS].sort((a, b) => (b.want - b.offer) - (a.want - a.offer)).slice(0, 4);
  const max = Math.max(...topGaps.map((x) => x.want));

  return (
    <div className="site">
      <header className="site-nav">
        <div className="container nav-inner">
          <button type="button" className="wordmark" onClick={() => window.scrollTo(0, 0)} aria-label="Free Period, back to top">
            <Logo />Free Period
          </button>
          <nav className="nav-links" aria-label="Sections">
            <button type="button" onClick={() => scrollTo('how')}>How it works</button>
            <button type="button" onClick={() => scrollTo('types')}>What you can do</button>
            <button type="button" onClick={() => scrollTo('passport')}>Skills Passport</button>
            <button type="button" onClick={() => scrollTo('careers')}>For UCD Careers</button>
            <button type="button" onClick={() => scrollTo('trust')}>Trust</button>
          </nav>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => go('now')}>Open the app</button>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="pill"><span className="pill-dot" aria-hidden="true" />UCD Student Hackathon: preparing graduates for the jobs of the future</p>
            <h1 className="hero-title">Turn <span className="mark">free periods</span> into future skills.</h1>
            <p className="hero-lede">
              UCD students spend hours on campus between classes. Free Period matches you with students who are free at the
              same time, so you can learn from other disciplines, swap skills, build projects and leave with proof.
            </p>
            <div className="hero-ctas">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => go('now')}>See today’s matches <Arrow /></button>
              <button type="button" className="btn btn-ghost btn-lg" onClick={() => go('week')}>Set up my week</button>
            </div>
            <p className="hero-fine"><Shield size={15} />Verified @ucdconnect.ie students only</p>
          </div>

          <div className="poster-wrap">
            <div className="poster">
              <div className="poster-head">
                <div>
                  <p className="poster-kicker">My real Autumn timetable</p>
                  <p className="poster-title">8 hours of class. {state.free.length} free hours on campus.</p>
                </div>
              </div>
              <WeekGrid free={state.free} variant="hero" />
            </div>
            <div className="note note-a">
              <span className="note-time">Today, 11:00</span>
              <b>Aoife can teach you pandas</b>
              <span className="note-sub">MSc Computer Science</span>
            </div>
            <div className="note note-b">
              <span className="note-time">Today, 13:00</span>
              <b>Cian needs help with SQL</b>
              <span className="note-sub plus">Earns you 1 credit</span>
            </div>
            <div className="note note-c">
              <span className="note-time">Thursday, 11:00</span>
              <b>Sarah’s team needs a business analyst</b>
              <span className="note-sub">Engineering and IS, one team</span>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="section challenge">
        <div className="container challenge-grid">
          <Reveal className="challenge-stat">
            <h2 className="h-section">Jobs are changing faster than courses can.</h2>
            <p className="big-stat">39%</p>
            <p className="stat-caption">
              of workers’ core skills are expected to change by 2030, according to employers surveyed for the{' '}
              <a href={WEF} target="_blank" rel="noreferrer">World Economic Forum’s Future of Jobs Report 2025</a>. The fastest-growing
              include AI and big data, networks and cybersecurity, and technological literacy.
            </p>
          </Reveal>
          <div className="challenge-copy">
            <Reveal as="p" className="lead-p">
              No university can rewrite its modules every semester. But nearly 40,000 UCD students already hold most of those skills
              between them. They just sit in different buildings, and they rarely meet.
            </Reveal>
            <ol className="outcomes">
              {[
                ['Skills from outside your course', 'Learn Python from Computer Science, design from Product Design, pitching from Commerce.'],
                ['Proof employers can see', 'Every session is confirmed by both students and lands in your Skills Passport.'],
                ['A network across UCD', 'Each session and team adds a connection in a faculty you’d never have met.'],
              ].map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 90}>
                  <span className="outcome-num">0{i + 1}</span>
                  <div><h3>{t}</h3><p>{d}</p></div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section how" id="how">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h-section">Three steps, inside the hours you already have.</h2>
          </Reveal>
          <div className="steps">
            <Reveal className="step" delay={0}>
              <div className="step-visual"><WeekGrid free={state.free} variant="mini" /></div>
              <span className="step-num">1</span>
              <h3>Mark your free hours</h3>
              <p>Your classes come from your timetable. Tap the gaps when you’re on campus with nothing on.</p>
            </Reveal>
            <Reveal className="step" delay={100}>
              <div className="step-visual stack-visual">
                <div className="mini-card"><span className="badge b-learn">Learn</span><b>Pandas with Aoife</b><span>11:00, Library</span></div>
                <div className="mini-card"><span className="badge b-swap">Swap</span><b>Figma for SQL with Mei</b><span>12:00, Newman</span></div>
              </div>
              <span className="step-num">2</span>
              <h3>Get matched by time and skill</h3>
              <p>See only students free when you are, ranked by what you want to learn and what you can teach.</p>
            </Reveal>
            <Reveal className="step" delay={200}>
              <div className="step-visual passport-visual">
                <div className="stub"><Check /><div><b>Taught SQL joins</b><span>Confirmed by Cian, BComm</span></div></div>
                <div className="stub"><Check /><div><b>Learned pandas</b><span>Confirmed by Aoife, MSc CS</span></div></div>
              </div>
              <span className="step-num">3</span>
              <h3>Meet, then log it</h3>
              <p>Twenty minutes in a public spot on campus. Both of you confirm, and it goes on your Passport.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section types" id="types">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h-section">Five ways to use a free period.</h2>
            <p className="section-sub">Every request is built for one purpose, so nobody has to walk up to a stranger and “make friends.”</p>
          </Reveal>
          <div className="bento">
            {Object.entries(TYPES).map(([k, t], i) => (
              <Reveal key={k} className={`bento-card bento-${k}`} delay={i * 70}>
                <div className="row"><span className={`badge b-${k}`}>{t.label}</span><span className={`credit${k === 'teach' ? ' plus' : ''}`}>{t.credit}</span></div>
                <h3>{t.blurb}</h3>
                <p className="bento-example">“{t.example}”</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="credit-flow">
            <div className="flow-step"><b>Teach for 20 minutes</b><span>Help someone stuck on what you know</span></div>
            <Arrow size={22} />
            <div className="flow-step hl-step"><b>Earn 1 credit</b><span>Released when you both confirm</span></div>
            <Arrow size={22} />
            <div className="flow-step"><b>Spend it to learn</b><span>Anything, from anyone, in your gaps</span></div>
          </Reveal>
        </div>
      </section>

      <section className="section passport-sec" id="passport">
        <div className="container split">
          <Reveal className="split-copy">
            <h2 className="h-section">Grades show what you studied. Your Passport shows what you can do.</h2>
            <ul className="ticks">
              <li><Check />Every session is confirmed by both students, with endorsements from people in other fields.</li>
              <li><Check />Teaching counts too, as evidence of communication and leadership.</li>
              <li><Check />One tap turns it into a CV line or LinkedIn summary for interviews.</li>
            </ul>
            <button type="button" className="btn btn-secondary" onClick={() => go('passport')}>Open my Passport <Arrow /></button>
          </Reveal>
          <Reveal className="passport-mock" delay={120}>
            <div className="id-card">
              <div className="id-top"><Logo size={20} /><span>Skills Passport</span><span className="verified on-dark"><Shield size={13} />Verified</span></div>
              <p className="id-name">MSc Information Systems</p>
              <div className="id-stats"><div><b>6</b><span>Sessions</span></div><div><b>5</b><span>Faculties</span></div><div><b>9</b><span>Connections</span></div></div>
            </div>
            <ul className="record">
              <li><span className="badge b-teach">Taught</span><b>SQL joins</b><span>Cian, BComm. “Finally understand LEFT JOIN.”</span></li>
              <li><span className="badge b-learn">Learned</span><b>Python (pandas)</b><span>Aoife, MSc Computer Science</span></li>
              <li><span className="badge b-team">Project</span><b>Climate-tech venture team</b><span>Sarah, BE Engineering</span></li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section careers" id="careers">
        <div className="container split">
          <Reveal className="split-copy">
            <h2 className="h-section">For UCD Careers: see the skills gap as it forms.</h2>
            <p className="section-sub on-dark">
              Free Period shows, anonymously, which skills students want and who can teach them, so Careers knows which workshop
              to run next, who could co-lead it, and when most students are free to attend.
            </p>
            <button type="button" className="btn btn-hl" onClick={() => go('insights')}>Open the Careers view <Arrow /></button>
          </Reveal>
          <Reveal className="careers-card" delay={120}>
            <p className="careers-card-title">Want to learn vs can teach <span>(illustrative data)</span></p>
            {topGaps.map((x) => (
              <div key={x.skill} className="mini-bar">
                <div className="mini-bar-label"><span>{x.skill}</span><span>{x.want} want, {x.offer} teach</span></div>
                <div className="mini-bar-track"><span className="mb-want" style={{ width: `${(x.want / max) * 100}%` }} /><span className="mb-offer" style={{ width: `${(x.offer / max) * 100}%` }} /></div>
              </div>
            ))}
            <p className="careers-callout"><Spark size={15} /><span>Biggest gap: <b>{topGaps[0].skill}</b>. Suggested: a peer-led workshop on Tuesday at 12:00, when most students are free.</span></p>
          </Reveal>
        </div>
      </section>

      <section className="section trust" id="trust">
        <div className="container">
          <Reveal className="section-head"><h2 className="h-section">Built for trust from day one.</h2></Reveal>
          <div className="trust-grid">
            {[
              [Shield, 'Verified UCD students only', 'Sign-up needs an @ucdconnect.ie address. No outsiders, no anonymous accounts.'],
              [Pin, 'Public spots on campus', 'Sessions default to libraries, cafés and atriums. Online calls are optional.'],
              [Book, 'Explain, don’t solve', 'Every learning request carries a pledge. Graded work is never shared or written for anyone.'],
              [Users, 'Groups of three or more', 'Group plans need at least three people, and the organiser is visible to everyone.'],
              [Lock, 'Free or busy, nothing more', 'Others see when you’re free, never your modules. Careers sees only anonymous totals.'],
            ].map(([Icon, t, d], i) => (
              <Reveal key={t} className="trust-item" delay={i * 60}>
                <span className="trust-icon"><Icon size={20} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <Reveal>
            <h2 className="final-title">Your next free period starts at <span className="mark">11:00</span>.</h2>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => go('now')}>See who’s free then <Arrow /></button>
          </Reveal>
        </div>
      </section>

      <footer className="site-foot">
        <div className="container foot-inner">
          <span className="wordmark small"><Logo size={18} />Free Period</span>
          <span>Built for the UCD Student Hackathon, 27 October 2026. Names and numbers in this demo are illustrative.</span>
        </div>
      </footer>
    </div>
  );
}
