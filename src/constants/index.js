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
    title: 'Founding Engineer & Dev Lead',
    company: 'SportsDaddy',
    symbol: 'bowling',
    start: '2026-03',
    end: null,
    description: 'Driving the entire product end-to-end as founding engineer. With Claude Code as my daily partner — extended with subagents and skills I write for my own workflow — I single-handedly take care of planning, design, development, QA, and infrastructure.',
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
    technologies: ['.NET 6', 'REST API', 'Vue', 'MySQL', 'Git', 'Jira', 'AWS', 'Docker', 'Linux', 'Redis', 'Elasticsearch', 'MSA']
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
    technologies: ['.NET 6', '.NET Core', 'REST API', 'MySQL', 'Git', 'Jira', 'AWS', 'Docker', 'Linux', 'Redis', 'Elasticsearch', 'MSA']
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
    technologies: ['.NET Framework', 'MSSQL', 'ASP.NET MVC', 'ASP.NET WebForms', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Windows Server']
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

// Tech Stack — each skill's `match` lists the technology names exactly as they
// appear in EXPERIENCES; the Skills section adds up the time in production
// from those entries and ranks by it (see utils/tenure.js). A skill without
// `match` (or whose names never appear) still lists, after the dated ones,
// without a bar.
export const TECH_STACK = {
  backend: {
    title: 'Backend',
    skills: [
      { name: 'C# / .NET', match: ['.NET', '.NET 6', '.NET Core', '.NET Framework'] },
      { name: 'MySQL / MSSQL', match: ['MySQL', 'MSSQL'] },
      { name: 'ASP.NET MVC / WebForms', match: ['ASP.NET MVC', 'ASP.NET WebForms'] },
      { name: 'REST API / MSA', match: ['REST API', 'MSA'] },
      { name: 'Redis / Valkey', match: ['Redis', 'Valkey'] },
      { name: 'Elasticsearch', match: ['Elasticsearch'] },
      { name: 'WinForm', match: ['WinForm'] },
    ],
  },
  frontend: {
    title: 'Frontend',
    skills: [
      { name: 'JavaScript', match: ['JavaScript'] },
      { name: 'HTML / CSS', match: ['HTML', 'CSS'] },
      { name: 'jQuery', match: ['jQuery'] },
      { name: 'React', match: ['React'] },
      { name: 'Flutter', match: ['Flutter'] },
      { name: 'Vue', match: ['Vue'] },
    ],
  },
  tools: {
    title: 'Infra & tools',
    skills: [
      { name: 'Windows Server', match: ['Windows Server'] },
      { name: 'Git', match: ['Git'] },
      { name: 'AWS', match: ['AWS'] },
      { name: 'Docker', match: ['Docker'] },
      { name: 'Linux', match: ['Linux'] },
      { name: 'Claude Code', match: ['Claude Code'] },
      { name: 'Jira', match: ['Jira'] },
    ],
  },
};

// Contact Information
export const CONTACT_INFO = {
  email: 'sudongcu@gmail.com',
  github: 'https://github.com/sudongcu',
  linkedin: 'https://www.linkedin.com/in/dongguseo/'
};

// Hero Section Text
export const HERO_TEXT = {
  eyebrow: 'Founding engineer · Dev lead · Full-stack · Seoul',
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
  "Hi, I'm Donggu Seo — developer and founding engineer at a startup. After 12 years of development and team leadership, I now build every part of the product solo, with Claude as my daily partner and a set of subagents and skills I built to make it work my way. I make things, ship them, and learn fast.";

export const ABOUT_STATS = [
  { value: 12, suffix: '+', label: 'years shipping software' },
  { value: 5, suffix: '', label: 'companies — ERP, travel, e-commerce' },
  { value: 1, suffix: '', label: 'startup, built end-to-end with AI' },
];
