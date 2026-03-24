import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { projects } from '../data/projects';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ProjectShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="section projects" id="work" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <p className="section-eyebrow">Selected Work</p>
          <h2 className="section-title">Featured Projects</h2>
        </motion.div>
      </div>

      <div className="projects__list">
        {projects.map((project, index) => {
          const isReversed = index % 2 === 1;
          return (
            <ProjectStory
              key={project.id}
              project={project}
              index={index}
              reversed={isReversed}
            />
          );
        })}
      </div>
    </section>
  );
}

function ProjectStory({
  project,
  index,
  reversed,
}: {
  project: typeof projects[0];
  index: number;
  reversed: boolean;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.article
      ref={ref}
      className={`project-story ${reversed ? 'project-story--reversed' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease }}
    >
      <div className="project-story__visual">
        <div className="project-story__img-wrap">
          <img
            src={project.image}
            alt={project.title}
            className="project-story__img"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <div className="project-story__img-overlay" />
        </div>
      </div>

      <div className="project-story__content">
        <span className="project-story__category">{project.category}</span>
        <h3 className="project-story__title">{project.title}</h3>
        <p className="project-story__desc">{project.summary}</p>

        <div className="project-story__impact">
          <span className="project-story__impact-label">Impact</span>
          <span className="project-story__impact-value">{project.result}</span>
        </div>

        <div className="project-story__meta">
          <span className="project-story__role">{project.role}</span>
        </div>

        <div className="project-story__stack">
          {project.stack.slice(0, 5).map((tech) => (
            <span key={tech} className="project-story__tech">{tech}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
