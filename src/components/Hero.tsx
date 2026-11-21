import { person } from '../data/content';
import Arrow from './Arrow';

export default function Hero() {
  const [first, last] = person.name.split(' ');

  return (
    <section className="hero" id="top">
      <div className="hero__text">
        <h1 className="hero__name">
          <span className="hero__line">
            <span>{first}</span>
          </span>
          <span className="hero__line">
            <span>{last}</span>
          </span>
        </h1>
        <p className="hero__role">
          <span>{person.role}</span>
          <span>{person.school}</span>
        </p>
        <p className="hero__statement">{person.statement}</p>
        <div className="hero__actions">
          <a className="button button--solid" href={person.github} target="_blank" rel="noreferrer">
            GitHub <Arrow to="out" />
          </a>
          <a className="button glass" href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Arrow to="out" />
          </a>
        </div>
      </div>
    </section>
  );
}
