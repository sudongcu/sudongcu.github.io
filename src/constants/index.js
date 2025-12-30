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
    title: '팀장',
    company: '(주)그린앤그레이',
    period: '2024.01 ~ 2025.11 (2년)',
    description: [
      '식품 쇼핑 서비스 감별마켓 개발 총괄 및 운영 관리',
      '.NET 6 기반 API 개발 및 DB 설계',
      '스마트스토어에서 카페24로 마이그레이션하여 월 매출 4억원 증대'
    ],
    technologies: ['.NET 6', 'MySQL', 'AWS', 'Docker', 'Redis', 'ElasticSearch', 'Vue', 'MSA']
  },
  {
    id: 2,
    title: '백엔드 개발자',
    company: '(주)루나소프트',
    period: '2021.10 ~ 2023.12 (2년 3개월)',
    description: [
      '쇼핑 플랫폼 Cellook 및 감별마켓 신규 개발',
      '프로젝트 아키텍처 템플릿 구축 및 Git Flow 전략 도입',
      '.NET Core 3.1에서 .NET 6 마이그레이션 수행'
    ],
    technologies: ['.NET 6', '.NET Core', 'MySQL', 'AWS', 'Docker', 'Redis', 'Git']
  },
  {
    id: 3,
    title: '풀스택 개발자',
    company: '(주)씨알에스코리아',
    period: '2016.02 ~ 2021.09 (5년 8개월)',
    description: [
      '항공 예약 시스템 개발 및 유지보수',
      '티몬, 신라면세점 등 다수 프로젝트 수행',
      '예약/마이페이지 개발 및 BackOffice 시스템 구축',
      'Windows Server 관리 및 인프라 운영'
    ],
    technologies: ['.NET MVC', 'MSSQL', 'JavaScript', 'jQuery', 'Windows Server']
  },
  {
    id: 4,
    title: 'ERP/MES 개발자',
    company: '(주)아셀씨엔아이',
    period: '2014.07 ~ 2015.09 (1년 3개월)',
    description: [
      '제조업 ERP/MES 시스템 개발',
      '구매/생산/영업/품질 모듈 개발 및 Crystal Report 작업',
      '국내외 프로젝트 수행 및 기술 문서화'
    ],
    technologies: ['.NET Framework', 'WinForm', 'MSSQL', 'Crystal Report']
  }
];

// Tech Stack Categories
export const TECH_STACK = {
  frontend: {
    title: 'Frontend',
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Three.js', level: 75 }
    ]
  },
  backend: {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'GraphQL', level: 65 }
    ]
  },
  tools: {
    title: 'Tools & Others',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'AWS', level: 65 },
      { name: 'Figma', level: 75 },
      { name: 'CI/CD', level: 70 }
    ]
  }
};

// Project Data
export const PROJECTS = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
    image: '/project1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    demoLink: 'https://demo.example.com',
    githubLink: 'https://github.com/example/project1',
    featured: true
  },
  {
    id: 2,
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management with real-time data visualization and reporting.',
    image: '/project2.jpg',
    technologies: ['Next.js', 'TypeScript', 'Chart.js', 'PostgreSQL'],
    demoLink: 'https://demo.example.com',
    githubLink: 'https://github.com/example/project2',
    featured: true
  },
  {
    id: 3,
    title: '3D Portfolio Website',
    description: 'Interactive portfolio website with 3D elements and smooth animations.',
    image: '/project3.jpg',
    technologies: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    demoLink: 'https://demo.example.com',
    githubLink: 'https://github.com/example/project3',
    featured: false
  },
  {
    id: 4,
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates and team features.',
    image: '/project4.jpg',
    technologies: ['React', 'Firebase', 'Material-UI', 'Redux'],
    demoLink: 'https://demo.example.com',
    githubLink: 'https://github.com/example/project4',
    featured: false
  }
];

// Contact Information
export const CONTACT_INFO = {
  email: 'contact@example.com',
  github: 'https://github.com/sudongcu',
  linkedin: 'https://linkedin.com/in/sudongcu',
  twitter: 'https://twitter.com/sudongcu'
};

// Hero Section Text
export const HERO_TEXT = {
  greeting: 'Hello, I\'m',
  name: 'Your Name',
  title: 'Full Stack Developer',
  description: 'I create beautiful and functional web experiences with modern technologies.',
  cta: 'View My Work'
};
