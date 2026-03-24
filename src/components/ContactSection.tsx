import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export default function ContactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="contact__content"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">Get In Touch</div>
          <h2 className="contact__title">
            Let's Build Something<br />
            <span className="contact__title-accent">Together</span>
          </h2>

          <p className="contact__desc">
            Interested in AI engineering, ML systems, full-stack builds, or
            research-driven product work? Let's connect.
          </p>

          <div className="contact__links">
            <a href="mailto:samyakgupta@rediffmail.com" className="contact__link">
              <div className="contact__link-icon">
                <Mail size={22} />
              </div>
              <div className="contact__link-info">
                <span className="contact__link-label">Email</span>
                <span className="contact__link-value">samyakgupta@rediffmail.com</span>
              </div>
              <ArrowUpRight size={16} className="contact__link-arrow" />
            </a>

            <a href="https://github.com/SamyakGupta04" target="_blank" rel="noopener noreferrer" className="contact__link">
              <div className="contact__link-icon">
                <Github size={22} />
              </div>
              <div className="contact__link-info">
                <span className="contact__link-label">GitHub</span>
                <span className="contact__link-value">github.com/SamyakGupta04</span>
              </div>
              <ArrowUpRight size={16} className="contact__link-arrow" />
            </a>

            <a href="https://www.linkedin.com/in/samyak-gupta-55064a250/" target="_blank" rel="noopener noreferrer" className="contact__link">
              <div className="contact__link-icon">
                <Linkedin size={22} />
              </div>
              <div className="contact__link-info">
                <span className="contact__link-label">LinkedIn</span>
                <span className="contact__link-value">linkedin.com/in/samyak-gupta</span>
              </div>
              <ArrowUpRight size={16} className="contact__link-arrow" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
