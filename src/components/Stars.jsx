import { Star } from '../icons.jsx';

export default function Stars({ value, size = 15 }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={size} filled={n <= Math.round(value)} />)}
    </span>
  );
}
