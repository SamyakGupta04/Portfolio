import { motion } from 'motion/react';
import { Shield, Satellite, Code2, Cpu, ArrowDown, FileText, Mail } from 'lucide-react';

const domainPills = [
  { label: 'AI Security', icon: Shield },
  { label: 'Computer Vision', icon: Satellite },
  { label: 'Full Stack', icon: Code2 },
  { label: 'Embedded Systems', icon: Cpu },
];

const proofChips = [
  'AI Engineer Intern @ Windflow.ai',
  'ML Engineer Intern @ REC',
  'Top 11/7200 Sparkathon',
  'IIT Patna',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__content container">
        <motion.div
          className="hero__left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero__greeting" variants={itemVariants}>
            <span className="hero__status-dot" />
            Available for opportunities
          </motion.div>

          <motion.h1 className="hero__name" variants={itemVariants}>
            Samyak Gupta
          </motion.h1>

          <motion.p className="hero__title" variants={itemVariants}>
            AI / ML Engineer building secure,{' '}
            <span className="hero__title-accent">intelligent systems</span>
          </motion.p>

          <motion.p className="hero__subtitle" variants={itemVariants}>
            Focused on AI safety, geospatial computer vision, full-stack systems, and embedded intelligence.
          </motion.p>

          <motion.div className="hero__pills" variants={itemVariants}>
            {domainPills.map((pill) => (
              <span key={pill.label} className="hero__pill">
                <pill.icon size={14} />
                {pill.label}
              </span>
            ))}
          </motion.div>

          <motion.div className="hero__cta-group" variants={itemVariants}>
            <a href="#work" className="btn btn--primary">
              <span>View Work</span>
              <ArrowDown size={16} />
            </a>
            <a href="#contact" className="btn btn--secondary">
              <Mail size={16} />
              <span>Contact Me</span>
            </a>
            <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              <FileText size={16} />
              <span>Resume</span>
            </a>
          </motion.div>

          <motion.div className="hero__proof" variants={itemVariants}>
            {proofChips.map((chip) => (
              <span key={chip} className="hero__proof-chip">
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__visual">
            <div className="hero__visual-ring hero__visual-ring--1" />
            <div className="hero__visual-ring hero__visual-ring--2" />
            <div className="hero__visual-ring hero__visual-ring--3" />
            <div className="hero__visual-core">
              <img
                src={`${import.meta.env.BASE_URL}hero-avatar.png`}
                alt="Samyak Gupta - AI/ML Engineer"
                className="hero__avatar-img"
              />
            </div>

            <div className="hero__visual-node hero__visual-node--1">
              <Satellite size={20} />
            </div>
            <div className="hero__visual-node hero__visual-node--2">
              <Code2 size={20} />
            </div>
            <div className="hero__visual-node hero__visual-node--3">
              <Cpu size={20} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
