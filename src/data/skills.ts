export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai-ml',
    name: 'AI / ML',
    icon: 'brain',
    skills: ['Python', 'Scikit-learn', 'TensorFlow', 'LangChain', 'Hugging Face', 'XGBoost', 'ONNX Runtime'],
  },
  {
    id: 'cv-geospatial',
    name: 'Computer Vision / Geospatial',
    icon: 'eye',
    skills: ['OpenCV', 'GDAL', 'Google Earth Engine', 'YOLOv8', 'Image Segmentation', 'AlphaEarth'],
  },
  {
    id: 'ai-backend',
    name: 'AI Backend / Data Eng',
    icon: 'code',
    skills: ['Python', 'Node.js', 'REST APIs', 'SQL', 'MongoDB', 'Data Pipelines'],
  },
  {
    id: 'languages-frameworks',
    name: 'Languages & Core',
    icon: 'terminal',
    skills: ['Python', 'C/C++', 'JavaScript', 'MATLAB', 'OOP Patterns'],
  },
  {
    id: 'embedded-systems',
    name: 'Embedded / Systems',
    icon: 'cpu',
    skills: ['LoRaWAN', 'UART / I2C / SPI', 'BLE GATT', 'Arduino', 'C++', 'Firmware'],
  },
  {
    id: 'tools',
    name: 'MLOps / Tools',
    icon: 'wrench',
    skills: ['Docker', 'Linux', 'Git', 'Jupyter', 'n8n', 'Pandas', 'NumPy', 'Model Deployment'],
  },
];
