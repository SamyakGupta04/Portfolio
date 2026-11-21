import { useEffect, useState } from 'react';
import { person } from '../data/content';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);

  // The active link is the section that crosses a line one third down the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-33% 0px -66% 0px' },
    );
    for (const id of ['top', ...links.map((l) => l.id)]) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // Over the contact section the page is black, so the glass turns dark.
  useEffect(() => {
    const contact = document.getElementById('contact');
    if (!contact) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setOnDark(contact.getBoundingClientRect().top < 42);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return (
    <header className={`nav glass${open ? ' nav--open' : ''}${onDark ? ' nav--dark' : ''}`}>
      <a className="nav__name" href="#top" onClick={() => setOpen(false)}>
        {person.name}
      </a>

      <nav id="nav-links" className="nav__links" aria-label="Sections">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="nav__link"
            aria-current={active === link.id ? 'true' : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a className="nav__resume" href={person.resume} target="_blank" rel="noreferrer">
        Résumé
      </a>

      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
    </header>
  );
}
