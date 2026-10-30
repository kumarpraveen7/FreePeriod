import { gaps, gapLabel, classHours } from '../utils.js';
import WeekGrid from '../components/WeekGrid.jsx';
import SkillEditor from '../components/SkillEditor.jsx';
import TimetableUpload from '../components/TimetableUpload.jsx';

export default function Week({ state, actions }) {
  const g = gaps(state.free);

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">My week</h1>
        <p className="page-sub">Upload your timetable and the gaps between classes are marked free. Select any other hours you’re on campus with nothing on, and matches follow.</p>
      </header>
      <div className="layout-2">
        <div className="col-main">
          <div className="grid-card">
            <WeekGrid classes={state.classes} free={state.free} variant="full" onToggle={actions.toggleFree} />
            <div className="legend">
              <span><span className="sw sw-free" />Free on campus</span>
              <span><span className="sw sw-cls" />Class</span>
              <span><span className="sw sw-empty" />Select to mark free</span>
            </div>
          </div>
        </div>
        <aside className="col-side">
          <TimetableUpload classes={state.classes} onImport={actions.setTimetable} />
          <div className="side-card stats-card">
            <div><b>{classHours(state.classes)}</b><span>hours of class</span></div>
            <div><b>{state.free.length}</b><span>free hours on campus</span></div>
          </div>
          <div className="side-card">
            <h3>Your gaps</h3>
            {g.length ? <ul className="gap-list">{g.map((x) => <li key={`${x.d}-${x.s}`}><span className="sw sw-free" />{gapLabel(x)}</li>)}</ul> : <p className="muted">No free hours marked yet.</p>}
          </div>
          <div className="side-card">
            <SkillEditor id="have" label="I can help with" hint="Used to match you with people who need help." skills={state.have} onChange={(v) => actions.setSkills('have', v)} />
            <SkillEditor id="want" label="I want to learn" hint="Used to rank who can teach you." skills={state.want} onChange={(v) => actions.setSkills('want', v)} />
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={() => actions.go('now')}>Show my matches</button>
        </aside>
      </div>
    </div>
  );
}
