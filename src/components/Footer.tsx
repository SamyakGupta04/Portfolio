import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__left">
            <span className="footer__logo">
              <span className="footer__logo-icon">◆</span>
              Samyak Gupta
            </span>
            <p className="footer__tagline">
              AI / ML Engineer building secure, intelligent systems.
            </p>
          </div>

          <div className="footer__links">
            <a href="mailto:samyakgupta@rediffmail.com" className="footer__social" aria-label="Email">
              <Mail size={18} />
            </a>
            <a href="https://github.com/SamyakGupta04" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/samyak-gupta-55064a250/" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Samyak Gupta. Built with precision.</span>
        </div>
      </div>
    </footer>
  );
}
