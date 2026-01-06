// Navigation Links
export const NAV_LINKS = [
  { id: 'about', title: 'About', href: '#about' },
  { id: 'experience', title: 'Experience', href: '#experience' },
  { id: 'skills', title: 'Skills', href: '#skills' },
  { id: 'projects', title: 'Projects', href: '#projects' },
  { id: 'contact', title: 'Contact', href: '#contact' },
];

// Experience Data
export const EXPERIENCES = [
  {
    id: 1,
    title: 'Team Lead',
    company: 'Green & Grey Inc.',
    companyUrl: 'https://greenngrey.co.kr/',
    period: 'Jan 2024 ~ Nov 2025 (1 year 11 months)',
    description: 'Led development and operations of .NET 6 e-commerce APIs, managed team of 4 engineers, and coordinated client requirements.',
    technologies: ['.NET 6', 'REST API', 'MySQL', 'Git', 'AWS', 'Docker', 'Linux', 'Redis', 'Elasticsearch', 'MSA']
  },
  {
    id: 2,
    title: 'Senior .NET Developer',
    company: 'LunaSoft Inc.',
    companyUrl: 'https://lunasoft.co.kr/',
    period: 'Oct 2021 ~ Dec 2023 (2 years 3 months)',
    description: 'Built architecture templates, managed Git Flow collaboration, and led .NET Core to .NET 6 migration while supporting high-traffic production services.',
    technologies: ['.NET 6', '.NET Core', 'REST API', 'MySQL', 'Git', 'AWS', 'Docker', 'Linux', 'Redis', 'Elasticsearch', 'MSA']
  },
  {
    id: 3,
    title: '.NET Developer',
    company: 'Travelport Korea',
    companyUrl: 'http://travelport.co.kr/',
    period: 'Feb 2016 ~ Sep 2021 (5 years 8 months)',
    description: 'Developed travel reservation systems and back-office platforms using ASP.NET MVC, managed Windows server infrastructure.',
    technologies: ['.NET Framework', 'MSSQL', 'ASP.NET MVC', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Windows Server']
  },
  {
    id: 4,
    title: '.NET Developer',
    company: 'ASEL C&I Inc.',
    period: 'Jul 2014 ~ Sep 2015 (1 year 3 months)',
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

// Project Data
export const PROJECTS = [
  {
    id: 1,
    title: 'Screen Timer',
    description: 'Chrome extension to track focus time manually or automatically by website. Simple and powerful tool for mindful screen time management.',
    image: '/projects/screen-timer.png',
    technologies: ['Chrome Extension', 'JavaScript', 'HTML', 'CSS'],
    demoLink: 'https://chromewebstore.google.com/detail/icgeccdeonblfglohopdmlfjebidglem',
    githubLink: null,
    featured: true
  }
];

// Contact Information
export const CONTACT_INFO = {
  email: 'sudongcu@gmail.com',
  github: 'https://github.com/sudongcu',
  linkedin: 'https://linkedin.com/in/sudongcu'
};

// Hero Section Text
export const HERO_TEXT = {
  greeting: 'Hello, I\'m',
  name: 'DONGGU SEO',
  title: 'Full Stack Developer',
  description: 'I create beautiful and functional web experiences with modern technologies.',
  cta: 'View My Work'
};
