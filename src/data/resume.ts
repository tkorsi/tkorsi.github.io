export type PersonalInfo = {
  name: string
  role: string
  email: string
  phone: string
  location: string
  telegram: string
  whatsapp: string
  summary: string
}

export type SkillGroup = {
  category: string
  items: string[]
}

export type ExperienceItem = {
  company: string
  role: string
  period: string
  description: string
  achievements?: string[]
}

export type EducationItem = {
  degree: string
  school: string
  year: string
}

export type LanguageItem = {
  language: string
  proficiency: string
}

export type HighlightItem = {
  value: string
  label: string
  borderColorClassName: string
}

export const personalInfo = {
  name: 'Yehor Shapanov',
  role: 'Tech Lead & Senior Software Engineer',
  email: 'hiiegor@gmail.com',
  phone: '+380975610959',
  location: 'Kyiv, Ukraine',
  telegram: 'yehorshapanov',
  whatsapp: '380991380940',
  summary: "I build modern, high-load solutions that solve critical business challenges. With 10+ years of engineering experience, I leverage Go, Kubernetes, and AWS to architect systems managing massive scale (200+ microservices). Expert in guiding distributed teams through the full software development lifecycle.",
} satisfies PersonalInfo

export const highlights = [
  { value: '10+', label: 'Years Exp.', borderColorClassName: 'border-blue-500' },
  { value: '200+', label: 'Microservices', borderColorClassName: 'border-emerald-500' },
  { value: 'Tech', label: 'Leadership', borderColorClassName: 'border-purple-500' },
  { value: 'AWS', label: 'Cloud Arch', borderColorClassName: 'border-orange-500' },
] satisfies HighlightItem[]

export const skills = [
  {
    category: 'Languages',
    items: ['Go (Golang)', 'C++', 'Swift', 'Objective-C', 'JavaScript', 'Python', 'C'],
  },
  {
    category: 'Infrastructure & DevOps',
    items: ['Kubernetes', 'Docker', 'Terraform', 'Ansible', 'AWS', 'Helm', 'Prometheus', 'Grafana'],
  },
  {
    category: 'Web & Mobile',
    items: ['React', 'Node.js', 'Angular', 'iOS (Cocoa Touch)', 'React Native'],
  },
  {
    category: 'Databases',
    items: [
      'PostgreSQL',
      'MongoDB',
      'DynamoDB',
      'Clickhouse',
      'ElasticSearch',
      'CockroachDB',
      'Redis',
    ],
  },
  {
    category: 'Architecture',
    items: [
      'Microservices',
      'High-load Systems',
      'System Design',
      'OOP/OOD',
      'Design Patterns',
      'Cryptography',
    ],
  },
] satisfies SkillGroup[]

export const experience = [
  {
    company: 'EvoPlay',
    role: 'Golang Team Lead',
    period: 'February 2020 - Present',
    description:
      'Spearheaded the development and integration of high-load, performance-optimized solutions focusing on blockchain technology (TON).',
    achievements: [
      'Led integration of TON blockchain technology and smart contract development.',
      'Managed a large GCE cluster with over 200 microservices.',
      'Implemented robust, scalable systems using C++ and Go.',
      'Developed TCP/IP-based networking solutions.',
      'Stack: Golang, Kubernetes, Helm, Prometheus, RabbitMQ, Jaeger, C++.',
    ],
  },
  {
    company: 'Firebolt.io',
    role: 'Senior DevOps Engineer',
    period: 'August 2020 - January 2022',
    description:
      'Responsible for Cloud Architecture and delivery process for a huge Data Warehouse startup (Snowflake competitor).',
    achievements: [
      'Managed high-scale cloud infrastructure.',
      'Stack: Kubernetes, Helm, Prometheus, Grafana, Loki, Clickhouse, CockroachDB, AWS.',
    ],
  },
  {
    company: 'Private Projects / Startups',
    role: 'Senior Backend / AI Engineer',
    period: 'May 2020 - August 2020',
    description: "Worked on 'Dialog System' (AI chatbot) and 'Biltrade' (HFT startup).",
    achievements: [
      'Built SoA seq2seq model training on AWS GPUs (Tensorflow, LSTM, CUDA).',
      'Built high-performance backend for HFT startup in Go.',
      'Extended Kubernetes to service HPC workloads.',
    ],
  },
  {
    company: 'Amazon Ring',
    role: 'Senior iOS Developer',
    period: 'February 2020 - May 2020',
    description: 'Worked on Rings Core App using Swift, RxSwift, and Reactive Cocoa.',
  },
  {
    company: 'Syngenta (Intellias)',
    role: 'Team Lead',
    period: 'December 2018 - February 2020',
    description:
      'Led a newly created Lab for a global genetics leader. Built teams from scratch, managed architectural discussions, and delivery pipelines.',
    achievements: [
      'Migrated projects from Fargate to EKS.',
      'Set up Kubernetes for automation and scaling.',
      'Tech lead for numerous projects (React, Node, Go, Python).',
      'Mentored team and prepared presales.',
    ],
  },
  {
    company: 'Epam Systems',
    role: 'Mobile Solutions Lead / Senior Dev',
    period: 'December 2017 - December 2018',
    description:
      'Led mobile teams (React-Native, iOS/Android). Relocated to LA for Ticketmaster project.',
    achievements: [
      'Led mobile experience for incoming projects.',
      'Created Product Delivery pipelines.',
    ],
  },
  {
    company: 'Previous Experience',
    role: 'Senior iOS Developer',
    period: '2010 - 2017',
    description:
      'Various senior roles at companies like Class.me, Swisscom (Evoja), BetBull, Yandex, Ciklum, and Luxoft. Focused on high-quality mobile application development, architecture planning, and working directly with international customers.',
  },
  {
    company: 'Ministry of Defence (Design Bureau)',
    role: 'Electrical Engineer',
    period: 'May 2008 - May 2010',
    description:
      'Designed electronics and firmware for military-sector design bureau. Worked with C, C++, Crypto, and electrical schemes.',
  },
] satisfies ExperienceItem[]

export const education = [
  {
    degree: 'Master of Physics (Nanoelectronics)',
    school: 'National University of Ukraine',
    year: '2011',
  },
  {
    degree: 'Yandex Data School',
    school: 'Computer Science',
    year: '2014 (1 Semester)',
  },
] satisfies EducationItem[]

export const languages = [
  { language: 'Ukrainian', proficiency: 'Native' },
  { language: 'Russian', proficiency: 'Native' },
  { language: 'English', proficiency: 'Advanced' },
] satisfies LanguageItem[]
