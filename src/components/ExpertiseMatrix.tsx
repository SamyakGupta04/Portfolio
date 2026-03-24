import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { skillCategories } from '../data/skills';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ExpertiseMatrix() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section expertise" id="expertise" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <p className="section-eyebrow">Technical Stack</p>
          <h2 className="section-title">Expertise</h2>
        </motion.div>

        <div className="expertise__grid">
          {skillCategories.map((cat, index) => (
            <motion.div
              key={cat.name}
              className="expertise__panel"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index, ease }}
            >
              <h3 className="expertise__category">{cat.name}</h3>
              <ul className="expertise__skills">
                {cat.skills.map((skill) => (
                  <li key={skill} className="expertise__skill">{skill}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
