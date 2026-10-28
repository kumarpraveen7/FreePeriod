import { useState } from 'react';
import { TYPES, PLACES } from '../data.js';
import { gaps, gapLabel, audienceFor } from '../utils.js';
import { Clock, Pin, Spark, Users } from '../icons.jsx';

const needsPledge = (type) => ['learn', 'teach', 'swap'].includes(type);

export default function Post({ state, actions }) {
  const [draft, setDraft] = useState(() => ({ type: 'learn', title: state.prefill || '', skill: '', when: 0, where: 0, pledge: false }));
  const [errors, setErrors] = useState({});
  const g = gaps(state.free);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  if (!g.length) {
    return (
      <div className="page">
        <div className="empty-state">
          <h1 className="page-title">Post a request</h1>
          <p className="page-sub">Mark at least one free hour first, so we know when to show your request.</p>
          <button type="button" className="btn btn-primary" onClick={() => actions.go('week')}>Mark free hours</button>
        </div>
      </div>
    );
  }

  const gap = g[draft.when] || g[0];
  const audience = audienceFor(gap);

  const submit = () => {
    const e = {};
    if (!draft.title.trim()) e.title = 'Describe your request in a few words.';
    if (needsPledge(draft.type) && !draft.pledge) e.pledge = 'Tick the pledge to post a learning request.';
    if (draft.type === 'learn' && state.credits < 1) e.credit = 'You need 1 credit to post this. Offer help to earn one.';
    setErrors(e);
    if (Object.keys(e).length) { document.getElementById(e.title ? 'f-title' : 'f-pledge')?.focus(); return; }
    actions.post({ type: draft.type, title: draft.title.trim(), skill: draft.skill.trim(), when: gapLabel(gap), place: PLACES[draft.where] });
  };

  const titleLabel = draft.type === 'teach' ? 'What can you help with?'
    : draft.type === 'team' ? 'What are you building, and who do you need?'
    : draft.type === 'event' ? 'Where are you going?'
    : draft.type === 'swap' ? 'What will you trade?'
    : 'What do you want to learn?';

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Post a request</h1>
        <p className="page-sub">Students free at the time you pick see it first, ranked by whether they have the skill.</p>
      </header>
      <div className="layout-2 post-layout">
        <div className="col-main form-card">
          <p id="lbl-type" className="f">What kind of request?</p>
          <div className="type-picker" role="group" aria-labelledby="lbl-type">
            {Object.entries(TYPES).map(([k, t]) => (
              <button key={k} type="button" className="type-opt" aria-pressed={draft.type === k} onClick={() => { set({ type: k }); setErrors({}); }}>
                <span className={`badge b-${k}`}>{t.label}</span>
                <b>{t.post}</b>
                <span>{t.credit}</span>
              </button>
            ))}
          </div>

          <label className="f" htmlFor="f-title">{titleLabel}</label>
          <input id="f-title" className="input" value={draft.title}
            placeholder={draft.type === 'team' ? 'e.g. Need a designer for a campus app idea' : 'e.g. 20 minutes on Python list comprehensions'}
            aria-invalid={!!errors.title} aria-describedby="err-title"
            onChange={(e) => { set({ title: e.target.value }); if (errors.title) setErrors((x) => ({ ...x, title: '' })); }} />
          <p className="err" id="err-title">{errors.title}</p>

          <div className="two-col">
            <div>
              <label className="f" htmlFor="f-skill">Skill involved <span className="muted">(optional)</span></label>
              <input id="f-skill" className="input" value={draft.skill} placeholder="e.g. Python" onChange={(e) => set({ skill: e.target.value })} />
            </div>
            <div>
              <label className="f" htmlFor="f-when">When</label>
              <select id="f-when" className="input" value={draft.when} onChange={(e) => set({ when: Number(e.target.value) })}>
                {g.map((x, i) => <option key={i} value={i}>{gapLabel(x)}</option>)}
              </select>
            </div>
          </div>

          <label className="f" htmlFor="f-where">Where</label>
          <select id="f-where" className="input" value={draft.where} onChange={(e) => set({ where: Number(e.target.value) })}>
            {PLACES.map((p, i) => <option key={p} value={i}>{p}</option>)}
          </select>

          {needsPledge(draft.type) && (
            <>
              <label className="check">
                <input id="f-pledge" type="checkbox" checked={draft.pledge} aria-describedby="err-pledge"
                  onChange={(e) => { set({ pledge: e.target.checked }); if (errors.pledge) setErrors((x) => ({ ...x, pledge: '' })); }} />
                <span>Explain, don’t solve. I won’t share or ask for graded work.</span>
              </label>
              <p className="err" id="err-pledge">{errors.pledge}</p>
            </>
          )}
          <p className="err" role="alert">{errors.credit}</p>
          <div className="actions row-actions">
            <button type="button" className="btn btn-primary" onClick={submit}>Post request</button>
            <span className="muted">{draft.type === 'learn' ? `Costs 1 credit when the session happens. You have ${state.credits}.` : draft.type === 'teach' ? 'Earns you 1 credit per session.' : 'No credits change hands.'}</span>
          </div>
        </div>

        <aside className="col-side sticky-side">
          <p className="kicker">Preview</p>
          <div className="card preview">
            <span className="row"><span className={`badge b-${draft.type}`}>{TYPES[draft.type].label}</span><span className="credit">{TYPES[draft.type].credit}</span></span>
            <span className="title">{draft.title.trim() || 'Your request title'}</span>
            <span className="meta"><Clock /><span>{gapLabel(gap)}</span></span>
            <span className="meta"><Pin /><span>{PLACES[draft.where]}</span></span>
            <span className="why"><Spark /><span>Shown first to students free then{draft.skill.trim() ? ` who know ${draft.skill.trim()}` : ''}.</span></span>
          </div>
          <div className="side-card audience">
            <Users size={20} />
            <p><b>About {audience} students</b> are usually free on campus during this gap. <span className="muted">(estimate from illustrative data)</span></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
