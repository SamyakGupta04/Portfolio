import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ContactMinimal() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="contact__inner"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <p className="section-eyebrow">Contact</p>
          <h2 className="contact__heading">
            Let's build something<br />together.
          </h2>

          <a
            href="mailto:samyakgupta004@gmail.com"
            className="contact__email"
          >
            samyakgupta004@gmail.com
          </a>

          <div className="contact__links">
            <a
              href="https://github.com/SamyakGupta04"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              GitHub
            </a>
            <span className="contact__separator">·</span>
            <a
              href="https://linkedin.com/in/iamsamyakgupta"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
