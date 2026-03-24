export interface Project {
  id: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  problem: string;
  solution: string;
  result: string;
  category: string;
  gradient: string;
  image: string;
  sourceCode?: string;
}

export const projects: Project[] = [
  {
    id: 'prompt-injection-defense',
    title: 'Prompt Injection & Hallucination Defense',
    summary: 'Heuristic-based detection engine using linguistic-shift modeling, cosine similarity, and SpaCy parsing to classify adversarial directives and suppress hallucinations in production LLM systems.',
    role: 'AI Security Engineer',
    stack: ['Python', 'LangChain', 'SpaCy', 'ONNX Runtime', 'Hugging Face'],
    problem: 'LLM-based systems are vulnerable to prompt injection attacks, jailbreak payloads, and hallucination, leading to unsafe outputs in production.',
    solution: 'Designed a multi-layered prompt-injection detection workflow using linguistic-shift features, ICD, semantic similarity, and parser-based checks. Integrated factual-consistency, numerical and contradiction checks.',
    result: '40% latency reduction via ONNX Runtime; robust multi-stage adversarial detection.',
    category: 'AI Safety',
    gradient: 'linear-gradient(135deg, #ff6b6b22, #ffa50022)',
    image: '/card-ai-safety.png',
  },
  {
    id: 'geospatial-ai-forest',
    title: 'Geospatial AI for Forest Impact Analysis',
    summary: 'End-to-end pipeline for forest-impact and compliance-cost assessment of transmission corridors using UAV orthomosaics, YOLOv8-based crown detection, and canopy segmentation.',
    role: 'ML Engineer',
    stack: ['Python', 'OpenCV', 'GDAL', 'Google Earth Engine', 'YOLOv8', 'AlphaEarth'],
    problem: 'Manual forest impact assessment is slow, subjective, and cannot scale across large geospatial transmission corridors.',
    solution: 'Built an automated pipeline processing UAV orthomosaics and geospatial layers for tree crown detection, canopy segmentation, canopy-stage classification, and corridor-level impact scoring.',
    result: '97% F-measure on crown segmentation with real-time geospatial data processing.',
    category: 'Computer Vision',
    gradient: 'linear-gradient(135deg, #34d39922, #06b6d422)',
    image: '/card-geospatial.png',
  },
  {
    id: 'multimedia-sharing-app',
    title: 'Semantic Media Architecture',
    summary: 'Distributed microservices architecture utilizing Hugging Face embeddings for intelligent semantic photo retrieval and automated dynamic metadata clustering.',
    role: 'Backend/AI Integration Engineer',
    stack: ['Node.js', 'Hugging Face APIs', 'MongoDB', 'Semantic Search', 'REST Architecture'],
    problem: 'Traditional media platforms rely on manual tagging, making discovery inefficient and unscalable.',
    solution: 'Engineered a highly scalable microservice backend wrapping Hugging Face embedding endpoints for deep semantic understanding. Structured a MongoDB pipeline to efficiently retrieve media based on conceptual similarity rather than exact keywords.',
    result: 'Intelligent semantic retrieval engine powering automated photo clustering and context-aware filtering.',
    category: 'AI backend / Integration',
    gradient: 'linear-gradient(135deg, #06b6d422, #8b5cf622)',
    image: '/card-fullstack.png',
  },
  {
    id: 'network-anomaly-detection',
    title: 'Network Anomaly Detection System',
    summary: 'Machine learning intrusion detection framework analyzing 3.1M network records to predict 14 unique cyber threat vectors and zero-day anomalies.',
    role: 'ML Engineer',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Random Forest', 'Feature Engineering'],
    problem: 'Heuristic-based network intrusion detection cannot adapt to evolving, complex attack patterns including zero-day threats.',
    solution: 'Designed an extensive ML pre-processing pipeline for a 3.1M record dataset, performing robust feature engineering across 80+ attributes to build high-accuracy Random Forest detection models.',
    result: 'Achieved a 97% F-measure across 14 distinct attack types via optimized feature selection.',
    category: 'Machine Learning',
    gradient: 'linear-gradient(135deg, #a78bfa22, #818cf822)',
    image: '/card-network.png',
  },
  {
    id: 'lorawan-tactical-tracker',
    title: 'Edge Sensor Data Telemetry',
    summary: 'Rugged, low-power IoT tracking node for real-time edge data collection: combining high-sensitivity GPS, motion sensors, and secure LoRaWAN transmission.',
    role: 'Edge Processing / Data Engineer',
    stack: ['LoRaWAN', 'Sensor Fusion', 'Telemetry Pipelines', 'C++', 'Edge Device'],
    problem: 'Actionable data collection in tactical environments requires persistent edge nodes capable of long-range, low-power telemetry without cellular APIs.',
    solution: 'Constructed the edge node hardware and firmware processing pipeline, fusing high-sensitivity GPS and motion sensor streams. Integrated AT command wrappers for robust, lossless data packaging over LoRaWAN protocols to central servers.',
    result: 'Reliable 10–15 km edge telemetry transmission for real-time data ingestion.',
    category: 'Edge Computing / Telemetry',
    gradient: 'linear-gradient(135deg, #fbbf2422, #f5920022)',
    image: '/card-embedded.png',
  },
];
