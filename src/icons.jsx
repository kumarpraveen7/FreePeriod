function Svg({ size = 16, children, sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const Clock = ({ size }) => <Svg size={size}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>;
export const Pin = ({ size }) => <Svg size={size}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></Svg>;
export const Spark = ({ size }) => <Svg size={size}><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" /></Svg>;
export const Back = ({ size = 18 }) => <Svg size={size}><path d="M15 5l-7 7 7 7" /></Svg>;
export const Arrow = ({ size = 18 }) => <Svg size={size}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const Close = ({ size = 20 }) => <Svg size={size}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const Shield = ({ size }) => <Svg size={size}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></Svg>;
export const Book = ({ size }) => <Svg size={size}><path d="M5 4.5h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h9.5" /></Svg>;
export const Users = ({ size }) => <Svg size={size}><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /><path d="M16 6.5a3 3 0 0 1 0 5.5M18 14.8c1.3.7 2.1 2 2.5 4.2" /></Svg>;
export const Lock = ({ size }) => <Svg size={size}><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Svg>;
export const Search = ({ size = 20 }) => <Svg size={size}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Svg>;
export const Check = ({ size = 16 }) => <Svg size={size} sw={2.2}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const Plus = ({ size = 16 }) => <Svg size={size}><path d="M12 5v14M5 12h14" /></Svg>;
export const Now = ({ size = 20 }) => <Svg size={size}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>;
export const Week = ({ size = 20 }) => <Svg size={size}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Svg>;
export const Post = ({ size = 20 }) => <Svg size={size}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M12 8v8M8 12h8" /></Svg>;
export const Pass = ({ size = 20 }) => <Svg size={size}><rect x="3.5" y="5" width="17" height="14" rx="2" /><circle cx="9" cy="11" r="2.2" /><path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14.5 10h3.5M14.5 13.5h3.5" /></Svg>;
export const Bars = ({ size = 20 }) => <Svg size={size}><path d="M5 20V11M12 20V5M19 20v-6" /></Svg>;
export const Home = ({ size = 20 }) => <Svg size={size}><path d="M4 11l8-6.5 8 6.5V20H4z" /><path d="M10 20v-5h4v5" /></Svg>;

export function Logo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" rx="2" style={{ fill: 'var(--class)' }} />
      <rect x="12" y="1" width="9" height="9" rx="3" style={{ fill: 'var(--hl)' }} />
      <rect x="1" y="12" width="9" height="9" rx="2" style={{ fill: 'var(--class)' }} />
      <rect x="12" y="12" width="9" height="9" rx="2" style={{ fill: 'var(--class)' }} />
    </svg>
  );
}

export function Star({ size = 16, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export const Upload = ({ size }) => <Svg size={size}><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M4.5 15v3.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15" /></Svg>;
