import AsciiPortrait from './components/AsciiPortrait';
import Hero from './components/Hero';
import Nav from './components/Nav';
import { About, Closing, Projects, Skills, Work } from './components/Sections';

export default function App() {
  return (
    <>
      <a className="skip" href="#work">
        Skip to the work
      </a>
      <AsciiPortrait />
      <Nav />
      <main>
        <Hero />
        <div className="sheet">
          <Work />
          <Projects />
          <Skills />
          <About />
        </div>
        <Closing />
      </main>
    </>
  );
}
