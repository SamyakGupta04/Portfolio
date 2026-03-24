import AtmosphericBg from './components/AtmosphericBg';
import Navbar from './components/Navbar';
import HeroV2 from './components/HeroV2';
import CredibilityMarquee from './components/CredibilityMarquee';
import ProjectShowcase from './components/ProjectShowcase';
import ExperienceEditorial from './components/ExperienceEditorial';
import ExpertiseMatrix from './components/ExpertiseMatrix';
import AboutEditorial from './components/AboutEditorial';
import ContactMinimal from './components/ContactMinimal';
import FooterMinimal from './components/FooterMinimal';
import './App.css';

function App() {
  return (
    <>
      <AtmosphericBg />
      <Navbar />
      <main>
        <HeroV2 />
        <CredibilityMarquee />
        <ProjectShowcase />
        <ExperienceEditorial />
        <ExpertiseMatrix />
        <AboutEditorial />
        <ContactMinimal />
      </main>
      <FooterMinimal />
    </>
  );
}

export default App;
