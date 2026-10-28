import { TYPES } from '../data.js';
import { when, fmt, initials } from '../utils.js';
import { Clock, Pin, Spark } from '../icons.jsx';

export function CreditTag({ type }) {
  if (type === 'learn') return <span className="credit">Costs 1 credit</span>;
  if (type === 'teach') return <span className="credit plus">Earns 1 credit</span>;
  return <span className="credit">No credits</span>;
}

export function StatusTag({ status, type }) {
  if (status === 'done') return <span className="status">Done</span>;
  if (status) return <span className="status">Joined</span>;
  return <CreditTag type={type} />;
}

// compact = used inside the gap timeline, where the hour is already shown by the column
export default function RequestCard({ r, status, onOpen, compact = false, reason }) {
  return (
    <button type="button" className={`card${compact ? ' compact' : ''}`} onClick={() => onOpen(r.id)}>
      <span className="row">
        <span className={`badge b-${r.type}`}>{TYPES[r.type].label}</span>
        <StatusTag status={status} type={r.type} />
      </span>
      <span className="title">{r.title}</span>
      <span className="person-line">
        <span className="avatar sm" aria-hidden="true">{initials(r.who)}</span>
        <span>{r.who}, {r.course}{r.spots ? `. ${r.spots}` : ''}</span>
      </span>
      {compact
        ? <span className="meta"><Pin /><span>{fmt(r.start)}, {r.place}</span></span>
        : <>
            <span className="meta"><Clock /><span>{when(r)}</span></span>
            <span className="meta"><Pin /><span>{r.place}</span></span>
          </>}
      <span className="why"><Spark /><span>{reason || r.why}</span></span>
    </button>
  );
}
