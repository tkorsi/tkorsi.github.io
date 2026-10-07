export type PersonalInfo = {
  name: string
  role: string
  email: string
  phone: string
  location: string
  telegram: string
  whatsapp: string
  github: string
  linkedin: string
  summary: string
  specialties: string
}

export type SkillGroup = {
  category: string
  items: string[]
}

export type ExperienceItem = {
  company: string
  role: string
  period: string
  employment?: string
  location?: string
  description: string
  achievements?: string[]
}

export type EducationItem = {
  degree: string
  school: string
  year: string
  details?: string
}

export type LanguageItem = {
  language: string
  proficiency?: string
}

export type CertificateItem = {
  name: string
  issuer: string
  issued: string
  details?: string
}

export type ProjectItem = {
  name: string
  description: string
  company: string
}

export const personalInfo = {
  name: 'Yehor Shapanov',
  role: 'AI Infrastructure & Performance Engineer at Echomind AI',
  email: 'hiiegor@gmail.com',
  phone: '+380975610959',
  location: 'Kyiv Metropolitan Area',
  telegram: 'yehorshapanov',
  whatsapp: '380991380940',
  github: 'tkorsi',
  linkedin: 'https://www.linkedin.com/in/shapanov/',
  summary:
    'Everything I want to do in life was perfectly expressed by Scott McNealy when he was actually eulogizing Sun: "Kick butt, have fun, don\'t cheat, love my customers and change computing forever!"',
  specialties:
    'Golang, high-load high-performance services, kernel programming, application architecture',
} satisfies PersonalInfo

export const highlights = []

export const skills = [
  {
    category: 'AI Infrastructure & Performance',
    items: [
      'High Performance Computing (HPC)',
      'Performance Engineering',
      'Observational',
      'Machine Learning Infrastructure',
      'Scalability',
      'Model Serving',
      'Distributed Systems',
      'LLM Inference',
      'MLOps',
      'Site Reliability Engineering',
      'Load Testing',
      'Large Language Models (LLM)',
    ],
  },
  {
    category: 'GPU & Machine Learning',
    items: [
      'FlashAttention',
      'SGLang',
      'GPGPU',
      'CUDA',
      'CUDA Kernels',
      'kernel fusion',
      'Probability Theory',
      'Probability',
      'GaN',
      'Variational Autoencoders (VAEs)',
      'Normalization',
      'Deep Convolutional Generative Adversarial Networks (DCGAN)',
      'Generative Neural Networks',
      'Autoencoders',
      'Machine Learning',
    ],
  },
  {
    category: 'Cloud, Data & Delivery',
    items: [
      'Amazon ECS',
      'Amazon Web Services (AWS)',
      'PostgreSQL',
      'Redis',
      'Kubernetes',
      'Helm (Software)',
      'Prometheus.io',
      'GraphQL',
      'gRPC',
      'Grafana',
      'loki',
      'thanos',
      'ClickHouse',
      'CockroachDB',
      'Data Pipelines',
      'Software Deployment',
      'Project Scope Development',
      'Baselines',
    ],
  },
  {
    category: 'Software Development',
    items: [
      'React.js',
      'Node.js',
      'Swift (Programming Language)',
      'React Native',
      'Go (Programming Language)',
      'Objective-C',
      'Python',
      'iOS',
      'Unix',
      'C',
      'C++',
      'OS X',
      'iOS development',
      'Kernel Programming',
      'iPhone',
      'OOP',
      'iOS Development',
      'Cocoa',
    ],
  },
] satisfies SkillGroup[]

export const experience = [
  {
    company: 'Echomind AI',
    role: 'AI Infrastructure & Performance Engineer',
    period: 'May 2026 - Present',
    employment: 'Full-time · Remote',
    description:
      'I optimize the performance, reliability, and cost efficiency of production LLM and multimodal inference systems running on NVIDIA GPUs.',
    achievements: [
      'Profile inference across request queueing, prefill, decoding, and streaming to identify GPU, memory, and scheduling bottlenecks.',
      'Optimize KV-cache utilization, context-window limits, continuous batching, concurrency, and workload admission to improve throughput while protecting customer-facing tail latency.',
      'Evaluate FP8 model serving, multi-GPU execution strategies, and data/tensor-parallel configurations using production-shaped workloads.',
      'Build performance benchmarks around TTFT, TPOT, token throughput, p95/p99 latency, GPU saturation, and long-context behavior.',
      'Design workload prioritization and isolation between interactive customer traffic and background AI workloads.',
      'Lead capacity planning, canary rollouts, observability, and incident analysis for GPU-backed LLM and VLM services across AWS and Runpod.',
    ],
  },
  {
    company: 'Undisclosed Startup (due to Brave1 incubator regulations)',
    role: 'Founder & Lead Researcher',
    period: 'Apr 2023 - Feb 2026',
    employment: 'Full-time',
    description:
      'Leading research and development in generative AI with an emphasis on creating realistic synthetic imagery and robust representation learning for autonomous driving and computer vision applications.',
    achievements: [
      'Implemented generative modeling techniques for realistic synthetic imagery and robust feature representations to augment autonomous-driving data.',
      'Directed experiments and model optimization for natural-language processing and image generation.',
      'Collaborated with mathematicians and data scientists on mathematical methods for AI models.',
      'Developed data pipelines for collection, preprocessing, augmentation, and validation.',
      'Used AWS and Google Vertex AI for model deployment, scaling, and real-time inference.',
      'Established practices for integrating generative models into conversational AI applications.',
    ],
  },
  {
    company: 'EvoPlay',
    role: 'Technical Lead',
    period: 'Feb 2022 - Apr 2023',
    employment: 'Full-time · On-site',
    location: 'Kyiv, Kyiv City, Ukraine',
    description:
      'Led backend (PHP, Go) and infrastructure (DevOps) teams and collaborated with machine-learning engineers to integrate backend and infrastructure systems with ML work.',
    achievements: [
      'Led development of scalable PHP and Go backend systems and directed cloud deployments, CI/CD pipelines, and system architecture.',
      'Collaborated on machine-learning models using Python, TensorFlow, PyTorch, and Scikit-learn; data preparation; NLP and computer-vision projects; and predictive analytics.',
      'Worked with AWS and Google Cloud, SQL and NoSQL databases, and Kafka-based data streaming.',
      'Integrated machine-learning models into existing company systems with backend and DevOps teams.',
    ],
  },
  {
    company: 'Firebolt',
    role: 'Senior Devops engineer',
    period: 'Aug 2020 - Jan 2022',
    employment: 'Contract',
    location: 'Kyiv, Kyiv City, Ukraine',
    description:
      'Responsible for Cloud Architecture and delivery process for a large data warehouse startup.',
    achievements: [
      'Technology stack: Kubernetes, Helm, Prometheus, gRPC, GraphQL, Grafana, Loki, Thanos, ClickHouse, CockroachDB, FoundationDB, PackDB, AWS.',
    ],
  },
  {
    company: 'na',
    role: 'Working on my own Conversational Model',
    period: 'May 2020 - Aug 2020',
    employment: 'Self-employed',
    location: 'Kyiv, Kyiv City, Ukraine',
    description:
      'Building a state-of-the-art seq2seq model with an encoder-decoder attention architecture, trained on AWS GPUs and tuned hyperparameters.',
    achievements: [
      'Worked with TensorFlow, N-grams, LSTM, CUDA, NLTK, RNN, DSSM, statistical machine learning, and NumPy.',
    ],
  },
  {
    company: 'Intellias',
    role: 'Delivery Manager',
    period: 'Dec 2018 - Feb 2020',
    location: 'Kyiv, Kyiv City, Ukraine',
    description:
      'Worked with executive, product, and marketing stakeholders to define strategy and requirements; coordinated remote and multisite teams delivering services in sync with launch plans; communicated status, risks, and change control.',
  },
  {
    company: 'EPAM Systems',
    role: 'Technical Team Lead',
    period: 'Mar 2017 - Jan 2019',
    employment: 'Full-time',
    location: 'Kyiv, Ukraine',
    description:
      'Moved to Los Angeles and worked on-site. Led mobile experience delivery, created pipelines, unified processes and tools, supported presales and workshops, and mentored and taught colleagues.',
  },
  {
    company: 'NGT International',
    role: 'Senior iOS Developer',
    period: 'Oct 2015 - Feb 2017',
    location: 'The Randstad, Netherlands',
    description:
      'Developed banking applications for managers and administration pages across iOS and frontend, using Swift, Objective-C, AngularJS, ExpressJS, Node.js, and Python.',
  },
  {
    company: 'Yandex',
    role: 'iOS developer',
    period: 'Jul 2014 - Dec 2014',
    location: 'Ukraine',
    description:
      'Built an application from scratch, selected technologies and processes, and designed the REST backend API for integration.',
  },
  {
    company: 'Ciklum',
    role: 'Senior iOS developer',
    period: 'Oct 2012 - Jul 2014',
    location: 'Ukraine',
    description:
      'Worked on Dacadoo; built from scratch, planned architecture, contributed to business decisions and UI feedback, followed Apple Human Interface Guidelines, and worked in a team of 10–12 using Objective-C and Xcode.',
  },
] satisfies ExperienceItem[]

export const education = [
  {
    degree: '2009 - 2013',
    school: 'coursera',
    year: '',
  },
  {
    degree: 'master, Physics, Microelectronics',
    school: "National Technical University of Ukraine 'Kyiv Polytechnic Institute'",
    year: '2005 - 2011',
    details: 'Debate Team; Microelectronis, Nanotech, Physics',
  },
  {
    degree: 'High school diploma',
    school: 'Pushkin Gymnasium №153, Kyiv',
    year: '1994 - 2005',
    details: 'Chess club',
  },
] satisfies EducationItem[]

export const languages = [{ language: 'English', proficiency: '' }] satisfies LanguageItem[]

export const certifications = [
  {
    name: 'Probability theory',
    issuer: 'Computer Science Center',
    issued: 'Mar 2024',
    details: 'Skills: Probability Theory, Probability. “It was an insanely hard course on Probability Theory!”',
  },
  {
    name: 'UC San Diego "Combinatorics and Probability"',
    issuer: 'Coursera',
    issued: 'Mar 2019',
  },
  {
    name: 'Математический анализ',
    issuer: 'Stepik',
    issued: 'Feb 2019',
  },
  {
    name: 'real-time-web-with-node-js',
    issuer: 'Code School',
    issued: 'Mar 2015',
  },
] satisfies CertificateItem[]

export const projects = [
  {
    name: 'Conneyes',
    company: 'Ciklum',
    description:
      'My first project. Was a junior developer, so solely stood on a shoulders of senior colleagues. Learned a lot, get desired to learn about even more.',
  },
  {
    name: 'Dacadoo',
    company: 'Ciklum',
    description:
      'Joined amazing team of passionate guys, sure do hope to be the next big thing in sport apps after Nike +',
  },
  {
    name: 'NewspaperDirec',
    company: 'Luxoft',
    description:
      'Got a lot of legacy code. Continued to maintain and improve the project that was already going for over 3 years. A lot of refactoring and architectural redesign.',
  },
] satisfies ProjectItem[]

export const featured = {
  name: 'Functional programming',
  description: 'Statement of accomplishment of Functional programming course on Coursera. With distinction.',
}
