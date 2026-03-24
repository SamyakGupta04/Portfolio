export interface Achievement {
  id: string;
  title: string;
  metric: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: 'jee-advanced',
    title: 'JEE Advanced',
    metric: 'AIR 6785',
    description: 'Out of 0.17M+ candidates — top percentile national selection',
  },
  {
    id: 'walmart-sparkathon',
    title: 'Walmart Sparkathon',
    metric: 'Top 11 / 7200',
    description: 'Developed SecureAI to monitor network health — national hackathon',
  },
  {
    id: 'byd-innovate',
    title: 'BYD EV Innovate-a-thon',
    metric: 'Finalist',
    description: 'EV innovation challenge — finalist among 3100 teams',
  },
];
