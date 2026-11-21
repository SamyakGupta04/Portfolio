/** An arrow drawn to match the weight of the text around it. Fonts give arrows that are too thin. */
export default function Arrow({ to = 'right' }: { to?: 'right' | 'out' | 'down' }) {
  const turn = { right: 0, out: -45, down: 90 }[to];
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${turn}deg)` }}>
      <path d="M3 12h17M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
