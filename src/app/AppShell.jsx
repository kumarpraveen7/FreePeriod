import { Logo, Now, Week, Post, Pass, Bars, Home } from '../icons.jsx';

const NAV = [
  { view: 'now', label: 'Free now', Icon: Now },
  { view: 'week', label: 'My week', Icon: Week },
  { view: 'post', label: 'Post a request', short: 'Post', Icon: Post },
  { view: 'passport', label: 'Skills Passport', short: 'Passport', Icon: Pass },
  { view: 'insights', label: 'Careers insights', short: 'Insights', Icon: Bars },
];

export default function AppShell({ route, state, go, children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <button type="button" className="wordmark" onClick={() => go('home')} aria-label="Free Period website">
          <Logo />Free Period
        </button>
        <nav className="side-nav" aria-label="App">
          {NAV.map(({ view, label, Icon }) => (
            <button key={view} type="button" aria-current={route === view ? 'page' : undefined} onClick={() => go(view)}>
              <Icon />{label}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="credit-card">
            <p className="cc-label">Your credits</p>
            <p className="cc-num">{state.credits}</p>
            <p className="cc-sub">{state.held ? `${state.held} held until a session is confirmed. ` : ''}Teach for 20 minutes to earn one.</p>
          </div>
          <button type="button" className="side-link" onClick={() => go('home')}><Home size={18} />Back to the website</button>
        </div>
      </aside>

      <header className="mobile-top">
        <button type="button" className="wordmark" onClick={() => go('home')} aria-label="Free Period website"><Logo />Free Period</button>
        <span className="credits-pill" aria-live="polite">{state.credits} {state.credits === 1 ? 'credit' : 'credits'}</span>
      </header>

      <main className="main" id="main">{children}</main>

      <nav className="tabbar" aria-label="App">
        {NAV.map(({ view, label, short, Icon }) => (
          <button key={view} type="button" aria-current={route === view ? 'page' : undefined} onClick={() => go(view)}>
            <Icon size={22} /><span>{short || label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
