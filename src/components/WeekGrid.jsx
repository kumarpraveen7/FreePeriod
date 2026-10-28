import { DAYS, DAY_NAMES, HOURS, TODAY, CLASSES } from '../data.js';
import { fmt, key } from '../utils.js';

// variant: 'mini' (sidebar), 'hero' (landing poster, animated), 'full' (interactive editor)
export default function WeekGrid({ free, variant = 'full', onToggle }) {
  const interactive = variant === 'full' && onToggle;
  const cells = [<div key="corner" style={{ gridColumn: 1, gridRow: 1 }} />];
  let freeIndex = 0;

  DAYS.forEach((d, i) => cells.push(
    <div key={`day-${i}`} className={`gh${i === TODAY ? ' today' : ''}`} style={{ gridColumn: i + 2, gridRow: 1 }}>{d}</div>
  ));
  HOURS.forEach((hr, ri) => cells.push(
    <div key={`hour-${hr}`} className="hr" style={{ gridColumn: 1, gridRow: ri + 2 }}>{variant === 'mini' ? hr : `${hr}:00`}</div>
  ));

  for (let d = 0; d < 5; d++) {
    HOURS.forEach((hr, j) => {
      const row = j + 2;
      const col = d + 2;
      const cls = CLASSES.find((c) => c.d === d && c.s === hr);
      if (cls) {
        cells.push(
          <div key={`c-${d}-${hr}`} className="cell cls" style={{ gridColumn: col, gridRow: `${row} / span ${cls.e - cls.s}` }}>
            <span>{cls.short}</span>
          </div>
        );
        return;
      }
      if (CLASSES.some((c) => c.d === d && hr > c.s && hr < c.e)) return;
      const k = key(d, hr);
      const isFree = free.includes(k);
      const style = { gridColumn: col, gridRow: row, '--i': isFree ? freeIndex++ : 0 };
      if (interactive) {
        cells.push(
          <button key={k} type="button" className={`cell ${isFree ? 'free' : 'empty'}`} style={style}
            aria-pressed={isFree} aria-label={`${DAY_NAMES[d]} ${fmt(hr)}, ${isFree ? 'free on campus' : 'not marked'}`}
            onClick={() => onToggle(k)}>
            {isFree ? 'Free' : ''}
          </button>
        );
      } else {
        cells.push(<div key={k} className={`cell ${isFree ? 'free' : 'empty'}`} style={style}>{variant === 'hero' && isFree ? <span>Free</span> : null}</div>);
      }
    });
  }

  return (
    <div className={`grid grid-${variant}`} role={interactive ? 'group' : 'img'}
      aria-label={interactive ? 'Weekly timetable. Select an empty hour to mark it free.' : 'A week of classes with free hours on campus highlighted in yellow'}>
      {cells}
    </div>
  );
}
