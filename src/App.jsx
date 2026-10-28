import { useCallback, useEffect, useRef, useState } from 'react';
import { initialState } from './data.js';
import { findRequest } from './utils.js';
import Landing from './landing/Landing.jsx';
import AppShell from './app/AppShell.jsx';
import FreeNow from './app/FreeNow.jsx';
import Week from './app/Week.jsx';
import Post from './app/Post.jsx';
import Passport from './app/Passport.jsx';
import Insights from './app/Insights.jsx';
import Drawer from './components/Drawer.jsx';
import Toast from './components/Toast.jsx';

const ROUTES = ['home', 'now', 'week', 'post', 'passport', 'insights'];
const PASSPORT_KIND = { learn: 'learned', teach: 'taught', swap: 'swapped', team: 'project', event: 'event' };
const PASSPORT_VERB = { learn: 'Learned from', teach: 'Taught', swap: 'Swapped with', team: 'Team with', event: 'Group led by' };

// Open a screen directly with a hash: #now, #week, #post, #passport, #insights
function startRoute() {
  const h = window.location.hash.replace('#', '');
  return ROUTES.includes(h) ? h : 'home';
}

export default function App() {
  const [route, setRoute] = useState(startRoute);
  const [state, setState] = useState(initialState);
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const update = (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

  const showToast = (message) => {
    setToast({ message, visible: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const closeDrawer = useCallback(() => setOpenId(null), []);

  const actions = {
    toast: showToast,
    go(next) {
      setOpenId(null);
      setRoute(next);
      window.scrollTo(0, 0);
    },
    open: (id) => setOpenId(id),
    setFilter: (filter) => update({ filter }),
    setSkills: (which, list) => update({ [which]: list }),
    toggleFree: (k) => update((s) => ({ free: s.free.includes(k) ? s.free.filter((x) => x !== k) : [...s.free, k] })),
    startPost(text) {
      update({ prefill: text });
      actions.go('post');
    },

    // Learning costs 1 credit, held until both students confirm the session happened.
    join(r) {
      if (r.type === 'learn' && state.credits < 1) {
        return { ok: false, error: 'You need 1 credit to join. Offer help to someone to earn one.' };
      }
      update((s) => ({
        credits: r.type === 'learn' ? s.credits - 1 : s.credits,
        held: r.type === 'learn' ? s.held + 1 : s.held,
        joined: { ...s.joined, [r.id]: 'joined' },
      }));
      showToast(r.type === 'learn' ? 'Joined. 1 credit held until you both confirm.' : 'Request sent and accepted.');
      return { ok: true };
    },
    cancel(r) {
      update((s) => {
        const joined = { ...s.joined };
        delete joined[r.id];
        return { joined, credits: r.type === 'learn' ? s.credits + 1 : s.credits, held: r.type === 'learn' ? s.held - 1 : s.held };
      });
      showToast(r.type === 'learn' ? 'Cancelled. Your credit is back.' : 'Cancelled.');
    },
    done(r) {
      update((s) => ({
        held: r.type === 'learn' ? s.held - 1 : s.held,
        credits: r.type === 'teach' ? s.credits + 1 : s.credits,
        connections: s.connections + 1,
        joined: { ...s.joined, [r.id]: 'done' },
        passport: [...s.passport, { kind: PASSPORT_KIND[r.type], skill: r.out, with: `${PASSPORT_VERB[r.type]} ${r.who}, ${r.course}`, date: '27 Oct', note: r.note || '' }],
      }));
      showToast(r.type === 'teach' ? '+1 credit. Added to your Skills Passport.' : 'Added to your Skills Passport.');
    },
    post(p) {
      update((s) => ({ myPosts: [{ id: `p${Date.now()}`, ...p }, ...s.myPosts], filter: 'all', prefill: '' }));
      actions.go('now');
      showToast('Posted. Students free then can see it now.');
    },
    reset() {
      setState(initialState());
      setOpenId(null);
      window.scrollTo(0, 0);
      showToast('Demo reset.');
    },
  };

  const openReq = openId ? findRequest(openId) : null;

  let page;
  if (route === 'now') page = <FreeNow state={state} actions={actions} />;
  else if (route === 'week') page = <Week state={state} actions={actions} />;
  else if (route === 'post') page = <Post key={state.prefill || 'post'} state={state} actions={actions} />;
  else if (route === 'passport') page = <Passport state={state} actions={actions} />;
  else if (route === 'insights') page = <Insights />;

  return (
    <>
      {route === 'home'
        ? <Landing state={state} go={actions.go} />
        : <AppShell route={route} state={state} go={actions.go}>{page}</AppShell>}
      {openReq && <Drawer key={openReq.id} r={openReq} status={state.joined[openReq.id]} credits={state.credits} actions={actions} onClose={closeDrawer} />}
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
