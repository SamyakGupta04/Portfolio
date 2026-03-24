import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { experiences } from '../data/experience';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ExperienceEditorial() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section experience" id="experience" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <p className="section-eyebrow">Career</p>
          <h2 className="section-title">Experience</h2>
        </motion.div>

        <div className="exp-list">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="exp-entry"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 * index, ease }}
            >
              <div className="exp-entry__rail">
                <span className="exp-entry__date">{exp.period}</span>
                {exp.location && (
                  <span className="exp-entry__location">{exp.location}</span>
                )}
              </div>

              <div className="exp-entry__body">
                <h3 className="exp-entry__company">{exp.company}</h3>
                <p className="exp-entry__role">{exp.role}</p>

                <ul className="exp-entry__highlights">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="exp-entry__highlight">{h}</li>
                  ))}
                </ul>

                {exp.impact && (
                  <div className="exp-entry__impact">
                    <span className="exp-entry__impact-value">{exp.impact}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
