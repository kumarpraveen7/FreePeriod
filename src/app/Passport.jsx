import { useState } from 'react';
import { PROFILE } from '../data.js';
import { cvText, initials } from '../utils.js';
import { Logo, Shield, Check } from '../icons.jsx';

const LABELS = { taught: 'Taught', learned: 'Learned', swapped: 'Swapped', project: 'Project', event: 'Went as a group' };
const BADGE = { taught: 'teach', learned: 'learn', swapped: 'swap', project: 'team', event: 'event' };

function loadName() { try { return localStorage.getItem('fp-name') || ''; } catch { return ''; } }
function saveName(v) { try { localStorage.setItem('fp-name', v); } catch { /* storage unavailable */ } }

export default function Passport({ state, actions }) {
  const [name, setName] = useState(loadName);
  const [showCv, setShowCv] = useState(false);
  const sessions = state.passport.filter((p) => p.kind !== 'event' && p.kind !== 'project').length;
  const faculties = new Set(state.passport.map((p) => p.with.split(', ').slice(1).join(', '))).size;
  const summary = cvText(state.passport, state.connections);

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); actions.toast('CV summary copied.'); }
    catch { actions.toast('Copy is blocked here. Select the text and copy it manually.'); }
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Skills Passport</h1>
        <p className="page-sub">Every session and project, confirmed by both students. Grades show what you studied; this shows what you can do.</p>
      </header>
      <div className="layout-2 passport-layout">
        <div className="col-main">
          <h2 className="h-sub">Verified record</h2>
          <ol className="record-list">
            {[...state.passport].reverse().map((p, i) => (
              <li key={i}>
                <span className="dot" aria-hidden="true"><Check size={12} /></span>
                <div className="entry">
                  <span className="row"><span className={`badge b-${BADGE[p.kind]}`}>{LABELS[p.kind]}</span><span className="credit">{p.date}</span></span>
                  <b className="entry-skill">{p.skill}</b>
                  <span className="muted">{p.with}</span>
                  {p.note && <span className="entry-note">{p.note}</span>}
                  <span className="ver">Confirmed by both students</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="side-card cv-card">
            <div className="section-row tight">
              <h3>CV and LinkedIn summary</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCv((v) => !v)}>{showCv ? 'Hide' : 'Create summary'}</button>
            </div>
            {showCv ? (
              <>
                <p className="cv">{summary}</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={copy}>Copy text</button>
              </>
            ) : <p className="muted">Turns your verified record into one line you can paste into a CV or LinkedIn profile.</p>}
          </div>
        </div>

        <aside className="col-side">
          <div className="id-card">
            <div className="id-top"><Logo size={20} /><span>Skills Passport</span><span className="verified on-dark"><Shield size={13} />Verified</span></div>
            <div className="id-person">
              <span className="avatar lg" aria-hidden="true">{name ? initials(name) : 'You'}</span>
              <div>
                <label htmlFor="f-name" className="sr">Your name</label>
                <input id="f-name" className="id-name-input" value={name} placeholder="Add your name" autoComplete="name"
                  onChange={(e) => { setName(e.target.value); saveName(e.target.value); }} />
                <p className="id-course">{PROFILE.course}</p>
              </div>
            </div>
            <div className="id-stats">
              <div><b>{sessions}</b><span>Sessions</span></div>
              <div><b>{faculties}</b><span>Courses met</span></div>
              <div><b>{state.connections}</b><span>Connections</span></div>
            </div>
            <p className="id-credits">{state.credits} credits{state.held ? `, ${state.held} held` : ''}</p>
          </div>
          <div className="side-card">
            <h3>Skills I offer</h3>
            <div className="chips">{state.have.map((x) => <span key={x} className="chip static">{x}</span>)}</div>
            <h3 className="mt">Skills I’m building</h3>
            <div className="chips">{state.want.map((x) => <span key={x} className="chip static">{x}</span>)}</div>
          </div>
          <button type="button" className="btn-quiet center-block" onClick={() => { saveName(''); setName(''); actions.reset(); }}>Reset demo</button>
        </aside>
      </div>
    </div>
  );
}
