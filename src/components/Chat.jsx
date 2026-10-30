import { useEffect, useRef, useState } from 'react';
import { initials } from '../utils.js';
import { Chat as ChatIcon } from '../icons.jsx';

const QUICK = ['Is this still on?', 'What should I prepare?', 'Can we start 10 minutes later?'];

// Message the other student to clarify anything before sending (or while waiting on) a request
export default function Chat({ r, messages, onSend }) {
  const [open, setOpen] = useState(messages.length > 0);
  const [text, setText] = useState('');
  const end = useRef(null);
  const typing = messages.length > 0 && messages[messages.length - 1].from === 'me';

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [messages.length, open]);

  const send = (value) => {
    const t = (value ?? text).trim();
    if (!t) return;
    onSend(r, t);
    setText('');
  };

  if (!open) {
    return (
      <button type="button" className="btn btn-secondary btn-block chat-open" onClick={() => setOpen(true)}>
        <ChatIcon size={18} />Message {r.who} first
      </button>
    );
  }

  return (
    <div className="panel chat">
      <h3><ChatIcon size={15} /> Chat with {r.who}</h3>
      <div className="chat-log" aria-live="polite">
        {!messages.length && <p className="muted">Ask anything before you commit. {r.who} sees it straight away.</p>}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>
            {m.from === 'them' && <span className="avatar sm" aria-hidden="true">{initials(r.who)}</span>}
            <span className="sr">{m.from === 'me' ? 'You:' : `${r.who}:`}</span>
            <p>{m.text}</p>
          </div>
        ))}
        {typing && <p className="typing">{r.who} is typing…</p>}
        <span ref={end} />
      </div>
      {!messages.length && (
        <div className="chips">{QUICK.map((q) => <button key={q} type="button" className="chip" onClick={() => send(q)}>{q}</button>)}</div>
      )}
      <div className="chat-row">
        <label className="sr" htmlFor="chat-input">Message {r.who}</label>
        <input id="chat-input" className="input" value={text} maxLength={300} placeholder={`Message ${r.who}`} autoComplete="off"
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
        <button type="button" className="btn btn-primary" onClick={() => send()} disabled={!text.trim()}>Send</button>
      </div>
    </div>
  );
}
