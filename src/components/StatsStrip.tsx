import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Award, Zap, Target, BarChart3 } from 'lucide-react';
import { achievements } from '../data/achievements';

const icons = [TrendingUp, Award, Zap, Target, BarChart3];

export default function StatsStrip() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="stats-strip" ref={ref}>
      <div className="container">
        <div className="stats-strip__grid">
          {achievements.map((achievement, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={achievement.id}
                className="stats-strip__card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="stats-strip__icon">
                  <Icon size={18} />
                </div>
                <div className="stats-strip__metric">{achievement.metric}</div>
                <div className="stats-strip__label">{achievement.title}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
