import { useRef, useState } from 'react';
import { CLASSES } from '../data.js';
import { parseTimetable, CSV_TEMPLATE } from '../timetable.js';
import { Upload } from '../icons.jsx';

export default function TimetableUpload({ classes, onImport }) {
  const input = useRef(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const isDemo = classes === CLASSES;

  const read = async (file) => {
    if (!file) return;
    if (file.size > 2_000_000) { setError('That file is too big for a timetable. Export just this term.'); return; }
    try {
      onImport(parseTimetable(await file.text(), file.name));
      setError('');
    } catch (e) {
      setError(e.message);
    }
    if (input.current) input.current.value = '';
  };

  return (
    <div className="side-card">
      <h3>Upload your timetable</h3>
      <p className="hint top">Export your UCD timetable, Google or Outlook calendar as an .ics file, or use a CSV with day, start, end and module.</p>
      <label htmlFor="tt-file" className={`drop${dragging ? ' over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); read(e.dataTransfer.files[0]); }}>
        <Upload size={22} />
        <span><b>Choose a file</b> or drop it here</span>
        <span className="muted">.ics or .csv</span>
      </label>
      <input id="tt-file" ref={input} type="file" accept=".ics,.csv,text/calendar,text/csv" className="sr"
        aria-describedby="tt-err" onChange={(e) => read(e.target.files[0])} />
      <p className="err" id="tt-err" role="alert">{error}</p>
      <div className="upload-links">
        <a className="btn-quiet" href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE)}`} download="timetable-template.csv">CSV template</a>
        {!isDemo && <button type="button" className="btn-quiet" onClick={() => onImport(CLASSES)}>Use demo timetable</button>}
      </div>
    </div>
  );
}
