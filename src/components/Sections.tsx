import { useEffect, useRef, useState, type ReactNode } from 'react';
import { jobs, person, profile, projects, record, skills, type FigureId } from '../data/content';
import Arrow from './Arrow';
import Figure from './Figures';

/** A section with its title on the left. `aside` stays under the title while the body scrolls. */
function Section({
  id,
  title,
  aside,
  children,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section__inner">
        <div className="section__side">
          <h2 className="section__title" id={`${id}-title`}>
            {title}
          </h2>
          {aside}
        </div>
        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}

/** One line of the page: a short lead on the left, its title and text on the right. */
function Row({ lead, title, text }: { lead: string; title: string; text: string }) {
  return (
    <li className="row">
      <p className="row__lead">{lead}</p>
      <div>
        <h4 className="row__title">{title}</h4>
        <p className="row__text">{text}</p>
      </div>
    </li>
  );
}

export function Work() {
  // The selected row shows its diagram on the left.
  const [active, setActive] = useState<FigureId>(jobs[0].items[0].figure);
  const body = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);

  // While the page scrolls, the row that crosses a line 40% down the viewport is selected.
  // A row under the pointer has priority.
  useEffect(() => {
    const rows = body.current?.querySelectorAll<HTMLElement>('[data-figure]') ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (hovering.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).dataset.figure as FigureId);
        }
      },
      { rootMargin: '-40% 0px -59% 0px' },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="work"
      title="Work"
      aside={
        <div className="section__figure">
          <Figure key={active} id={active} />
        </div>
      }
    >
      <div
        ref={body}
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
      >
        {jobs.map((job) => (
          <article className="job" key={job.company}>
            <header className="job__head">
              <h3 className="job__company">{job.company}</h3>
              <p className="meta">
                {job.role}, {job.dates}, {job.place}
              </p>
            </header>
            <ul className="rows rows--pick">
              {job.items.map((item) => (
                <li
                  key={item.figure}
                  className="row"
                  data-figure={item.figure}
                  data-active={active === item.figure || undefined}
                  onPointerEnter={() => setActive(item.figure)}
                >
                  <p className="row__topic">{item.topic}</p>
                  <div>
                    <h4 className="row__headline">{item.headline}</h4>
                    <p className="row__text">{item.text}</p>
                    {/* On narrow screens there is no side column, so the diagram sits in the row. */}
                    <div className="row__figure">
                      <Figure id={item.figure} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      {projects.map((project) => (
        <article className="project" key={project.name}>
          <header className="project__head">
            <h3 className="project__name">{project.name}</h3>
            {project.source && (
              <a className="link" href={project.source} target="_blank" rel="noreferrer">
                Source <Arrow to="out" />
              </a>
            )}
          </header>
          <p className="project__what">{project.what}</p>
          <ul className="points">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {project.figure && (
            <div className="project__figure">
              <Figure id={project.figure} />
            </div>
          )}
          <p className="meta">{project.stack.join(' · ')}</p>
        </article>
      ))}
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="rows rows--flush">
        {skills.map((skill) => (
          <div className="row" key={skill.group}>
            <dt className="row__lead">{skill.group}</dt>
            <dd className="row__list">{skill.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function About() {
  return (
    <Section id="about" title="About">
      <ul className="rows rows--flush">
        {profile.map((item) => (
          <Row key={item.lead} {...item} />
        ))}
      </ul>
      <ul className="rows rows--flush rows--next">
        {record.map((item) => (
          <Row key={item.lead} {...item} />
        ))}
      </ul>
    </Section>
  );
}

/** The last screen. A pane of glass that turns the page behind it negative. */
export function Closing() {
  return (
    <section className="closing" id="contact" aria-labelledby="closing-title">
      <div className="closing__inner">
        <h2 className="section__title" id="closing-title">
          Thank you
          <br />
          for reading.
        </h2>
        <p className="closing__lead">The full detail is in my résumé and on these profiles.</p>
        <ul className="closing__links">
          <li>
            <a className="link" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <Arrow to="out" />
            </a>
          </li>
          <li>
            <a className="link" href={person.github} target="_blank" rel="noreferrer">
              GitHub <Arrow to="out" />
            </a>
          </li>
          <li>
            <a className="link" href={person.resume} target="_blank" rel="noreferrer">
              Résumé <Arrow to="down" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
