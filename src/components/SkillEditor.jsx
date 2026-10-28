import { useState } from 'react';
import { Close, Plus } from '../icons.jsx';

export default function SkillEditor({ id, label, hint, skills, onChange }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const add = () => {
    const v = value.trim();
    if (!v) { setError('Type a skill first.'); return; }
    if (skills.some((s) => s.toLowerCase() === v.toLowerCase())) { setError(`${v} is already on your list.`); return; }
    onChange([...skills, v]);
    setValue('');
    setError('');
  };

  return (
    <div className="skill-editor">
      <label className="f" htmlFor={id}>{label}</label>
      {hint && <p className="hint top">{hint}</p>}
      <div className="chips">
        {skills.map((s) => (
          <span key={s} className="chip removable">
            {s}
            <button type="button" aria-label={`Remove ${s}`} onClick={() => onChange(skills.filter((x) => x !== s))}><Close size={14} /></button>
          </span>
        ))}
      </div>
      <div className="add-row">
        <input id={id} className="input" value={value} placeholder="Add a skill, e.g. Tableau"
          aria-invalid={!!error} aria-describedby={`${id}-err`}
          onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <button type="button" className="btn btn-secondary" onClick={add}><Plus />Add</button>
      </div>
      <p className="err" id={`${id}-err`}>{error}</p>
    </div>
  );
}
