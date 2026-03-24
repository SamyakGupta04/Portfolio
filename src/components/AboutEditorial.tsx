import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const beliefs = [
  'Data quality over model complexity',
  'Robustness against adversarial inputs',
  'Scalable, secure model deployment',
];

export default function AboutEditorial() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="container">
        <div className="about__layout">
          <motion.div
            className="about__left"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <p className="section-eyebrow">About</p>
            <h2 className="about__heading">
              What I<br />Build
            </h2>

            <div className="about__beliefs">
              {beliefs.map((b) => (
                <p key={b} className="about__belief">— {b}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="about__right"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <p className="about__text">
              I'm an AI/ML Engineer at IIT Patna, pursuing Electrical & Electronics Engineering.
              My work revolves around the deployment, security, and optimization of machine learning
              models in production environments. I specialize in bridging the gap between
              theoretical research and robust, scalable AI systems.
            </p>
            <p className="about__text">
              At Windflow.ai, I architect prompt injection defense models that safeguard enterprise LLMs
              deployments. At REC, I constructed end-to-end geospatial ML pipelines to process extensive UAV imagery,
              extracting actionable intelligence from raw unstructured data. Ultimately, I build the architectures
              that allow models to function safely in the wild.
            </p>
            <p className="about__text">
              I am particularly focused on MLOps, inference optimization (quantization, ONNX), and adversarial AI.
              Whether detecting anomalies across millions of network logs or preventing foundation model
              hallucinations, I am driven by creating machine learning systems that are secure, highly performant,
              and rigorously tested.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
