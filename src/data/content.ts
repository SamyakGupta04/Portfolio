// All the words on the page. Edit this file to change the content.

export const person = {
  name: 'Samyak Gupta',
  role: 'AI Engineer',
  school: 'IIT Patna, B.Tech ’26',
  statement:
    'I build guardrails, agents and evaluation loops for LLM products, and the backend that keeps them fast under load.',
  github: 'https://github.com/SamyakGupta04',
  linkedin: 'https://www.linkedin.com/in/samyak-gupta-55064a250/',
  resume: `${import.meta.env.BASE_URL}resume.pdf`,
};

/** The diagrams in src/components/Figures.tsx. */
export type FigureId =
  | 'funnel'
  | 'guardrails'
  | 'agent'
  | 'optimizer'
  | 'evals'
  | 'serving'
  | 'geospatial'
  | 'restoration';

export interface WorkItem {
  /** What the work is, in two or three words. */
  topic: string;
  /** The result in one sentence. This is the line people read. */
  headline: string;
  /** How it works. */
  text: string;
  figure: FigureId;
}

export interface Job {
  company: string;
  role: string;
  dates: string;
  place: string;
  items: WorkItem[];
}

export const jobs: Job[] = [
  {
    company: 'Windflow.ai',
    role: 'AI Engineer',
    dates: 'Jan 2026 – Present',
    place: 'Gurugram',
    items: [
      {
        topic: 'Prompt-injection scanning',
        headline: 'Cut scans of 100K+ token documents from about an hour to milliseconds.',
        text: 'A 3-stage funnel. Regex picks the top 200 hotspots, semantic search narrows them to 20, and a locally served LLM checks only those.',
        figure: 'funnel',
      },
      {
        topic: 'AI guardrails',
        headline: 'Shipped guardrails in 6+ products and cut inference latency by 40%.',
        text: 'PII detection and masking, output governance, and canary tokens that expose prompt injection across multi-node agents. ONNX Runtime gave the latency gain.',
        figure: 'guardrails',
      },
      {
        topic: 'Airline diagnostic agent',
        headline: 'Contributed to a 3% revenue increase for a national airline.',
        text: 'The agent finds weak flights, explains the root cause and ranks fixes with Thompson sampling on analyst feedback. Rules make each diagnosis and the LLM only narrates, with every generated number checked against source data.',
        figure: 'agent',
      },
      {
        topic: 'LLM optimization',
        headline: 'Lowered estimated inference cost by about 20% and raised dev-set accuracy by 25 points.',
        text: 'An adaptive system: GEPA rewrites the prompts, each task gets the model that fits it, and execution traces show where a run went wrong.',
        figure: 'optimizer',
      },
      {
        topic: 'Evaluation loop',
        headline: 'Turned live production traffic into test cases, so every model and prompt change is checked against real use.',
        text: 'After human review, production cases join the golden dataset. Each configuration is re-validated against real-world drift, not a static benchmark.',
        figure: 'evals',
      },
      {
        topic: 'Serving under load',
        headline: 'Removed 12-minute query waits that blocked a worker for each request.',
        text: 'A rate-limited prefetch worker stores pre-processed Databricks results in a 3-layer cache. A bounded semaphore and single-flight locks hold the system at 8 concurrent model calls.',
        figure: 'serving',
      },
    ],
  },
  {
    company: 'REC Limited',
    role: 'ML Engineer Intern',
    dates: 'May – Jul 2025',
    place: 'Gurugram',
    items: [
      {
        topic: 'Geospatial AI',
        headline: 'Reached an F1-score of 0.94 on tree crown segmentation for transmission corridors.',
        text: 'A system for forest-impact and compliance-cost assessment: crown detection, canopy segmentation and corridor-level impact scoring from UAV orthomosaics. YOLOv8 with OpenCV, GDAL and Google Earth Engine.',
        figure: 'geospatial',
      },
    ],
  },
];

export interface Project {
  name: string;
  what: string;
  points: string[];
  stack: string[];
  source?: string;
  /** A diagram from src/components/Figures.tsx that shows the idea. */
  figure?: FigureId;
}

export const projects: Project[] = [
  {
    name: 'Capashio',
    what: 'On-device semantic photo search',
    points: [
      'CLIP and ArcFace run fully in the browser over WebGPU, so photos never leave the device.',
      'Search in plain language, or find every photo of one person. Results arrive in under a second.',
      'Mixed-precision quantization cut the weights to 88 MB with no loss in retrieval accuracy.',
    ],
    stack: ['MERN', 'ONNX Runtime', 'WebGPU', 'Transformers.js'],
    source: 'https://github.com/SamyakGupta04/Capashio',
  },
  {
    name: 'Admire',
    what: 'Structure-guided image restoration with diffusion models',
    points: [
      'Restores missing regions in photos of faces and heritage monuments. Stable Diffusion inpainting, fine-tuned with LoRA on 15K faces and 3.4K monument images.',
      'A Canny-edge ControlNet keeps arches, pillars and outlines aligned through the hole.',
      '33.26 dB PSNR and 0.955 SSIM on faces at 5% masking. Evaluated from 5% to 50% on fixed, seeded masks.',
    ],
    stack: ['PyTorch', 'Diffusers', 'LoRA', 'ControlNet', 'OpenCV'],
    figure: 'restoration',
    source: 'https://github.com/SamyakGupta04/Admire',
  },
  {
    name: 'Anomaly Detection in Networks',
    what: 'Intrusion detection from traffic metadata',
    points: [
      'Identifies 14 attack types, including encrypted and zero-day threats, with a 97% F-measure.',
      'Pre-processing pipeline for 3.1M records and 80+ features, with Random Forest feature selection.',
    ],
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    source: 'https://github.com/SamyakGupta04/Anomaly-Detection',
  },
  {
    name: 'LoRaWAN Tracker',
    what: 'Low-power tracking device for field operations',
    points: [
      'Arduino UNO R4 with high-sensitivity GPS, motion sensors and Bluetooth LE for real-time location and tamper detection.',
      'LoRaWAN parameters tuned for secure, lossless transmission over 10–15 km in RF-challenged terrain.',
    ],
    stack: ['LoRaWAN', 'UART / I2C / SPI', 'AT Commands', 'BLE GATT'],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'C/C++', 'JavaScript', 'SQL'] },
  {
    group: 'AI / ML',
    items: [
      'LLMs',
      'RAG',
      'Prompt optimization',
      'LLM evaluation',
      'AI guardrails',
      'PyTorch',
      'ONNX Runtime',
      'LangChain',
      'Hugging Face',
    ],
  },
  {
    group: 'Backend and data',
    items: ['FastAPI', 'Node.js', 'Express', 'React', 'PostgreSQL', 'MongoDB', 'Databricks', 'PySpark'],
  },
  {
    group: 'Cloud and tooling',
    items: ['AWS (EC2, RDS, Bedrock)', 'GCP', 'Docker', 'Git', 'pytest', 'Playwright', 'Langfuse'],
  },
];

/** About, part one: how I work and what I want. First person. */
export const profile: { lead: string; title: string; text: string }[] = [
  {
    lead: 'I optimize',
    title: 'I like to make slow, large or expensive things smaller.',
    text: 'An hour-long scan became milliseconds. A 12-minute query became a cache hit. A model too large for a browser became 88 MB. Each time, one stage did work that it did not need to do. I look for that stage first.',
  },
  {
    lead: 'I measure',
    title: 'I trust numbers more than demos.',
    text: 'So I build the evaluation loop next to the feature. If I cannot measure a change, I do not call it an improvement.',
  },
  {
    lead: 'I want',
    title: 'Next, I want to build AI products that people can depend on.',
    text: 'Products where reliability, latency and cost are engineering problems from the first day, not items for later.',
  },
];

/** About, part two: education and results. */
export const record: { lead: string; title: string; text: string }[] = [
  {
    lead: 'IIT Patna',
    title: 'B.Tech, class of 2026',
    text: 'Electrical and Electronics Engineering.',
  },
  {
    lead: 'AIR 6785',
    title: 'JEE Advanced 2022',
    text: 'All India Rank among 170,000+ candidates.',
  },
  {
    lead: 'Top 11',
    title: 'Walmart Sparkathon ’25',
    text: 'Of 7,200 teams, with SecureAI, a tool that monitors network health.',
  },
  {
    lead: 'Finalist',
    title: 'BYD EV Innovate-a-thon',
    text: 'Among 3,100 teams.',
  },
];
