import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experiences } from '../data/experience';

export default function ExperienceTimeline() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section experience" id="experience" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Career Path</div>
          <h2 className="section-title">Experience</h2>
        </motion.div>

        <div className="timeline">
          <div className="timeline__line" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="timeline__item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * index, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="timeline__marker">
                <div className="timeline__marker-dot">
                  {exp.type === 'work' ? (
                    <Briefcase size={14} />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>
              </div>

              <div className="timeline__card">
                <div className="timeline__card-header">
                  <div>
                    <h3 className="timeline__company">{exp.company}</h3>
                    <p className="timeline__role">{exp.role}</p>
                    {exp.location && <p className="timeline__location">{exp.location}</p>}
                  </div>
                  <span className="timeline__duration">{exp.duration}</span>
                </div>

                <ul className="timeline__highlights">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="timeline__highlight">
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="timeline__impact">
                  <span className="timeline__impact-label">Key Impact:</span>
                  <span className="timeline__impact-value">{exp.impact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
