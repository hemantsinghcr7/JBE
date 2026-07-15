import { tickerItems } from "@/data/content";

export function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
