// Navigation Links
export const NAV_LINKS = [
  { id: 'about', title: 'About', href: '#about' },
  { id: 'experience', title: 'Experience', href: '#experience' },
  { id: 'skills', title: 'Skills', href: '#skills' },
  { id: 'blog', title: 'Blog', href: '#blog' },
  { id: 'contact', title: 'Contact', href: '#contact' },
];

export const EXTERNAL_NAV_LINKS = [
  { id: 'lab', title: 'Lab', href: '/lab' },
];

// Experience Data — `start`/`end` are 'YYYY-MM'; `end: null` means current. Durations are computed.
export const EXPERIENCES = [
  {
    id: 5,
    title: 'Co-founder & Lead Research Engineer',
    company: 'SportsDaddy',
    symbol: 'bowling',
    start: '2026-03',
    end: null,
    description: 'Driving the entire product end-to-end as co-founder. With AI as my daily partner, I single-handedly take care of planning, design, development, QA, and infrastructure.',
    technologies: ['.NET', 'React', 'Flutter', 'Claude Code', 'AWS', 'MySQL', 'Docker', 'Git', 'Valkey']
  },
  {
    id: 1,
    title: 'Team Lead',
    company: 'Green & Grey Inc.',
    symbol: 'cart',
    companyUrl: 'https://greenngrey.co.kr/',
    start: '2024-01',
    end: '2025-11',
    description: 'Led development and operations of .NET 6 e-commerce APIs, managed team of 4 engineers, and coordinated client requirements.',
    technologies: ['.NET 6', 'REST API', 'MySQL', 'Git', 'AWS', 'Docker', 'Linux', 'Redis', 'Elasticsearch', 'MSA']
  },
  {
    id: 2,
    title: 'Senior .NET Developer',
    company: 'LunaSoft Inc.',
    symbol: 'server',
    companyUrl: 'https://lunasoft.co.kr/',
    start: '2021-10',
    end: '2023-12',
    description: 'Built architecture templates, managed Git Flow collaboration, and led .NET Core to .NET 6 migration while supporting high-traffic production services.',
    technologies: ['.NET 6', '.NET Core', 'REST API', 'MySQL', 'Git', 'AWS', 'Docker', 'Linux', 'Redis', 'Elasticsearch', 'MSA']
  },
  {
    id: 3,
    title: '.NET Developer',
    company: 'Travelport Korea',
    symbol: 'plane',
    companyUrl: 'http://travelport.co.kr/',
    start: '2016-02',
    end: '2021-09',
    description: 'Developed travel reservation systems and back-office platforms using ASP.NET MVC, managed Windows server infrastructure.',
    technologies: ['.NET Framework', 'MSSQL', 'ASP.NET MVC', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Windows Server']
  },
  {
    id: 4,
    title: '.NET Developer',
    company: 'ASEL C&I Inc.',
    symbol: 'factory',
    start: '2014-07',
    end: '2015-09',
    description: 'Developed ERP/MES systems for manufacturing industry with procurement, production, sales, and quality modules.',
    technologies: ['.NET Framework', 'WinForm', 'MSSQL', 'Crystal Report']
  }
];

// Tech Stack Categories
export const TECH_STACK = {
  frontend: {
    title: 'Frontend',
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'React / Vue', level: 85 },
      { name: 'jQuery', level: 80 },
      { name: 'HTML / CSS', level: 80 }
    ]
  },
  backend: {
    title: 'Backend',
    skills: [
      { name: 'C# / .NET', level: 98 },
      { name: 'MySQL / MSSQL', level: 90 },
      { name: 'Redis', level: 80 },
      { name: 'Elasticsearch', level: 70 }
    ]
  },
  tools: {
    title: 'Tools & Others',
    skills: [
      { name: 'Git', level: 95 },
      { name: 'Jira', level: 90 },
      { name: 'AWS', level: 80 },
      { name: 'Docker', level: 80 }
    ]
  }
};

// Contact Information
export const CONTACT_INFO = {
  email: 'sudongcu.work@gmail.com',
  github: 'https://github.com/sudongcu',
  linkedin: 'https://www.linkedin.com/in/dongguseo/'
};

// Hero Section Text
export const HERO_TEXT = {
  eyebrow: 'Co-founder · Full-stack · Seoul',
  status: 'Available for new things',
  name: ['DONGGU', 'SEO'],
  description:
    'Twelve years of .NET and team leadership — now shipping planning, design, code and infra solo, with AI as my daily co-founder.',
  ctaPrimary: 'Get in touch',
  ctaSecondary: 'Enter the Lab',
};

// Scrolling ticker under the hero
export const HERO_TICKER = [
  '.NET', 'C#', 'React', 'Flutter', 'AWS', 'Docker', 'MySQL', 'Redis',
  'Elasticsearch', 'Claude Code', 'Three.js', 'MSA', 'Linux', 'Git',
];

// About Section
export const ABOUT_TEXT =
  "Hi, I'm Donggu Seo — developer and startup co-founder. After 12 years of development and team leadership, I now build every part of the product solo, with Claude as my daily partner. I make things, ship them, and learn fast.";

export const ABOUT_STATS = [
  { value: 12, suffix: '+', label: 'years shipping software' },
  { value: 5, suffix: '', label: 'companies — ERP, travel, e-commerce' },
  { value: 1, suffix: '', label: 'startup, built end-to-end with AI' },
];
