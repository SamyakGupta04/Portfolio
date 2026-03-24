import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

export default function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="container">
        <motion.div
          className="about__content"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">Philosophy</div>
          <h2 className="section-title">About Me</h2>

          <div className="about__text">
            <p>
              I'm interested in building intelligent systems that are technically rigorous,
              useful in real environments, and resilient under constraints. My work spans
              the intersection of AI safety, applied computer vision, systems engineering,
              and full-stack product development.
            </p>
            <p>
              I think in terms of outcomes and architecture — not just code. Whether it's
              designing prompt-injection defense workflows, building geospatial analysis
              pipelines from satellite imagery, or engineering embedded tracking devices,
              I approach every problem as a systems-level challenge.
            </p>
            <p>
              Currently pursuing my B.Tech in Electrical &amp; Electronics Engineering at
              IIT Patna (JEE Advanced AIR 6785), I'm actively seeking opportunities where I
              can contribute to building secure, scalable, and intelligent systems that solve
              meaningful problems.
            </p>
          </div>

          <div className="about__values">
            <div className="about__value">
              <span className="about__value-number">01</span>
              <span className="about__value-text">Systems thinking over isolated code</span>
            </div>
            <div className="about__value">
              <span className="about__value-number">02</span>
              <span className="about__value-text">Outcomes-driven engineering</span>
            </div>
            <div className="about__value">
              <span className="about__value-number">03</span>
              <span className="about__value-text">Technical rigor with practical impact</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
