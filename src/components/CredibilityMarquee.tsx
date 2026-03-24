import { motion } from 'motion/react';

const items = [
  'JEE Advanced AIR 6785',
  'Walmart Sparkathon — Top 11 / 7200',
  'BYD Innovate-a-thon Finalist',
  'IIT Patna — B.Tech EEE',
  'AI Engineer @ Windflow.ai',
  'ML Engineer @ REC',
];

// Repeat 4x for seamless scroll
const repeated = [...items, ...items, ...items, ...items];

export default function CredibilityMarquee() {
  return (
    <section className="marquee-strip" aria-label="Credentials">
      <div className="marquee-strip__track">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-strip__item">
            {item}
            <span className="marquee-strip__dot">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
