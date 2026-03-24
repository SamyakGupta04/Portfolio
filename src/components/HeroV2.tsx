import { motion } from 'motion/react';
import SignalCore from './SignalCore';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const proofChips = [
  'IIT Patna',
  'JEE Advanced AIR 6785',
  'Sparkathon Top 11/7200',
  'BYD Finalist',
];

export default function HeroV2() {
  return (
    <section className="hero" id="hero">
      {/* Signal Core visual — sits behind text */}
      <div className="hero__core-wrap">
        <SignalCore />
      </div>

      <div className="hero__content">
        {/* Overline */}
        <motion.p
          className="hero__overline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          AI / ML Engineer — Building Secure Intelligent Systems
        </motion.p>

        {/* Name */}
        <motion.h1
          className="hero__name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
        >
          Samyak<br />Gupta
        </motion.h1>

        {/* Statement */}
        <motion.p
          className="hero__statement"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
        >
          Architecting secure foundation models, optimizing inference pipelines, 
          and deploying robust MLOps solutions for mission-critical intelligence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease }}
        >
          <a href="#work" className="btn btn--primary">View Selected Work</a>
          <a href="#contact" className="btn btn--ghost">Get in Touch</a>
        </motion.div>

        {/* Proof chips */}
        <motion.div
          className="hero__proof"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          {proofChips.map((chip) => (
            <span key={chip} className="hero__chip">{chip}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
