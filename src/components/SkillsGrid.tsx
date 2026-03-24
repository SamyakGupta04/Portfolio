import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Brain, Eye, Code2, Cpu, Wrench, Terminal } from 'lucide-react';
import { skillCategories } from '../data/skills';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  brain: Brain,
  eye: Eye,
  code: Code2,
  cpu: Cpu,
  wrench: Wrench,
  terminal: Terminal,
};

export default function SkillsGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section skills" id="skills" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Technical Expertise</div>
          <h2 className="section-title">Skills & Stack</h2>
        </motion.div>

        <div className="skills__grid">
          {skillCategories.map((category, index) => {
            const Icon = iconMap[category.icon] || Brain;
            return (
              <motion.div
                key={category.id}
                className="skill-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="skill-card__header">
                  <div className="skill-card__icon">
                    <Icon size={20} />
                  </div>
                  <h3 className="skill-card__name">{category.name}</h3>
                </div>

                <div className="skill-card__pills">
                  {category.skills.map((skill) => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
