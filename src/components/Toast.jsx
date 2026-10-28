export default function Toast({ message, visible }) {
  return <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">{message}</div>;
}
