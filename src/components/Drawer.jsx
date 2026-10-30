import { useEffect, useRef, useState } from 'react';
import { TYPES } from '../data.js';
import { when, fmt, initials, ratingOf } from '../utils.js';
import { Close, Clock, Pin, Users, Book, Shield, Spark, Star } from '../icons.jsx';
import Stars from './Stars.jsx';

// Learn and swap: you received help, so you rate. Teach: the student you helped rates you.
const YOU_RATE = ['learn', 'swap'];
const STAR_WORDS = ['', 'Not helpful', 'Could be better', 'Good', 'Really helpful', 'Brilliant'];

function RateForm({ r, onRate }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const shown = hover || stars;

  const submit = () => {
    if (!stars) { setError('Pick from 1 to 5 stars first.'); return; }
    onRate(r, stars, comment.trim());
  };

  return (
    <div className="panel rate">
      <h3>How was your session with {r.who}?</h3>
      <p>Only the person who received help rates the session. It helps other students choose who to learn from.</p>
      <div className="star-pick" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} ${n === 1 ? 'star' : 'stars'}, ${STAR_WORDS[n]}`}
            className={n <= shown ? 'on' : ''} onMouseEnter={() => setHover(n)} onClick={() => { setStars(n); setError(''); }}>
            <Star size={30} filled={n <= shown} />
          </button>
        ))}
        <span className="star-word">{STAR_WORDS[shown]}</span>
      </div>
      <label className="sr" htmlFor="rate-comment">Comment (optional)</label>
      <input id="rate-comment" className="input" value={comment} maxLength={140} placeholder={`Optional: what did ${r.who} explain well?`}
        onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} />
      <p className="err" role="alert">{error}</p>
      <button type="button" className="btn btn-primary btn-block" onClick={submit}>Submit rating</button>
    </div>
  );
}

function confirmMessage(r) {
  switch (r.type) {
    case 'learn': return `You’re in. Meet ${r.who} at ${r.place} at ${fmt(r.start)}. Your credit is held until you both confirm the session happened.`;
    case 'teach': return `${r.who} accepted your offer. Meet at ${r.place} at ${fmt(r.start)}. You’ll earn 1 credit once you both confirm.`;
    case 'swap': return `Swap agreed. Meet ${r.who} at ${r.place} at ${fmt(r.start)}. Half the time each way.`;
    case 'team': return `${r.who} accepted you onto the team. First chat: ${when(r)} at ${r.place}.`;
    default: return `You’re in the group. ${r.place}. The organiser’s name is visible to everyone in the group.`;
  }
}

export default function Drawer({ r, status, rating, credits, actions, onClose }) {
  const [error, setError] = useState('');
  const panel = useRef(null);
  const t = TYPES[r.type];
  const score = ratingOf(r, rating?.stars);

  useEffect(() => {
    const prev = document.activeElement;
    panel.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (prev && prev.focus) prev.focus();
    };
  }, [onClose]);

  const join = () => {
    const res = actions.join(r);
    setError(res.ok ? '' : res.error);
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1} ref={panel}>
        <div className="drawer-top">
          <span className={`badge b-${r.type}`}>{t.label}</span>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><Close /></button>
        </div>
        <h2 id="drawer-title" className="drawer-title">{r.title}</h2>

        <div className="person">
          <span className="avatar" aria-hidden="true">{initials(r.who)}</span>
          <div>
            <div className="person-name">{r.who}</div>
            <div className="muted">{r.course}</div>
            {score && <div className="score"><Star size={14} /><b>{score.avg.toFixed(1)}</b><span className="muted">from {score.count} sessions</span></div>}
          </div>
          <span className="verified"><Shield size={14} />Verified UCD</span>
        </div>

        <div className="facts">
          <div className="meta"><Clock /><span>{when(r)}</span></div>
          <div className="meta"><Pin /><span>{r.place}</span></div>
          {r.spots && <div className="meta"><Users /><span>{r.spots}</span></div>}
        </div>

        <div className="panel">
          <h3><Spark size={15} /> Why you’re matched</h3>
          <p>{r.why}</p>
          <div className="chips">{r.tags.map((x) => <span key={x} className="chip static">{x}</span>)}</div>
        </div>

        {!status && (
          <div className="actions">
            <button type="button" className="btn btn-primary btn-block" onClick={join}>{t.join}</button>
            <p className="err" role="alert">{error}</p>
            <p className="hint center">
              {r.type === 'learn' ? `Costs 1 credit, held until you both confirm. You have ${credits}.` : r.type === 'teach' ? 'You’ll earn 1 credit once you both confirm.' : 'No credits change hands.'}
            </p>
          </div>
        )}

        {status === 'joined' && (
          <>
            <div className="panel ok"><h3>Confirmed</h3><p>{confirmMessage(r)}</p></div>
            <div className="actions">
              <button type="button" className="btn btn-primary btn-block" onClick={() => actions.done(r)}>
                {r.type === 'team' ? 'Add project to my passport' : r.type === 'event' ? 'Confirm I went' : 'Confirm the session happened'}
              </button>
              <button type="button" className="btn btn-secondary btn-block" onClick={() => actions.cancel(r)}>Cancel</button>
            </div>
          </>
        )}

        {status === 'done' && (
          <>
            <div className="panel ok"><h3>Added to your Skills Passport</h3><p>Confirmed by both of you. You and {r.who} are now connected.</p></div>
            {YOU_RATE.includes(r.type) && !rating && <RateForm r={r} onRate={actions.rate} />}
            {YOU_RATE.includes(r.type) && rating && (
              <div className="panel"><h3>You rated {r.who} <Stars value={rating.stars} /></h3>{rating.comment && <p>“{rating.comment}”</p>}</div>
            )}
            {r.type === 'teach' && r.stars && (
              <div className="panel"><h3>{r.who} rated you <Stars value={r.stars} /></h3>{r.note && <p>{r.note}</p>}</div>
            )}
            <div className="actions">
              <button type="button" className="btn btn-primary btn-block" onClick={() => { onClose(); actions.go('passport'); }}>View my passport</button>
            </div>
          </>
        )}

        <ul className="rules">
          {['learn', 'teach', 'swap'].includes(r.type) && <li><Book /><span>Explain, don’t solve. Graded work is never shared or written for anyone.</span></li>}
          {r.type === 'event' && <li><Users /><span>Group plans need at least 3 people, and the organiser is visible to all.</span></li>}
          <li><Shield /><span>Meets in a public spot on campus. Every member is a verified UCD student.</span></li>
        </ul>
      </aside>
    </>
  );
}
