export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  highlights: string[];
  impact: string;
  type: 'work' | 'education';
}

export const experiences: Experience[] = [
  {
    id: 'windflow',
    company: 'Windflow.ai',
    role: 'AI Engineer',
    duration: 'Jan 2026 – Present',
    location: 'Gurugram, India',
    highlights: [
      'Built a heuristic-based Prompt Injection detection engine using linguistic-shift modeling and ICD; leveraged cosine similarity and SpaCy parsing to identify adversarial directives and jailbreak payloads.',
      'Performed red-herring testing for jailbreak and prompt-injection attacks, classifying high-risk prompt chunks; integrated factual-consistency, numerical and contradiction checks to suppress hallucinations.',
      'Reduced latency by 40% using ONNX Runtime in RAG outputs.',
    ],
    impact: '40% latency reduction · Production AI safety pipeline',
    type: 'work',
  },
  {
    id: 'rec',
    company: 'REC',
    role: 'ML Engineer Intern',
    duration: 'May 2025 – Jul 2025',
    location: 'Gurugram, India',
    highlights: [
      'Built a Geospatial AI system for forest-impact and preliminary compliance-cost assessment of transmission corridors, focused on tree crown detection, canopy segmentation, and corridor-level impact scoring.',
      'Processed UAV orthomosaics and geospatial layers using AlphaEarth, OpenCV, GDAL, and Google Earth Engine; trained YOLOv8 to estimate tree count, crown cover, and canopy density.',
    ],
    impact: '97% F-measure on crown segmentation',
    type: 'work',
  },
];
