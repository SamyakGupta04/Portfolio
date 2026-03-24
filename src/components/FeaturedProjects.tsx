import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

export default function FeaturedProjects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="section projects" id="work" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Selected Work</div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="projects__intro">
            Systems built across AI guardrails, geospatial pipelines, anomaly detection, and intelligent product systems.
          </p>
        </motion.div>

        <div className="projects__grid">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.12 * index,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              <div className="project-card__header" style={{ background: project.gradient }}>
                <span className="project-card__category">{project.category}</span>
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-card__image"
                  loading="lazy"
                />
                <div className="project-card__header-overlay" />
              </div>

              <div className="project-card__body">
                <h3 className="project-card__title">
                  {project.title}
                  <ArrowUpRight size={18} className="project-card__arrow" />
                </h3>

                <p className="project-card__summary">{project.summary}</p>

                <div className="project-card__role">
                  <span className="project-card__role-label">Role:</span>
                  <span>{project.role}</span>
                </div>

                <div className="project-card__meta">
                  <div className="project-card__result">
                    <span className="project-card__result-label">Impact</span>
                    <span className="project-card__result-value">{project.result}</span>
                  </div>
                </div>

                <div className="project-card__stack">
                  {project.stack.map((tech) => (
                    <span key={tech} className="project-card__tech">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
