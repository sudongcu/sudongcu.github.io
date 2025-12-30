프로젝트 기획서: 3D 포트폴리오 사이트 (React)
본 프로젝트는 Vite와 React, Three.js(R3F)를 사용하여 sudongcu.github.io에 배포하는 개인 포트폴리오 구축을 목적으로 함.

1. 기술 스택
프레임워크: React (Vite)

스타일링: Tailwind CSS

3D: Three.js, @react-three/fiber, @react-three/drei

애니메이션: Framer Motion

아이콘: Lucide React

배포: gh-pages

2. 개발 단계별 체크리스트
Step 1: 환경 설정 및 초기화
[v] Vite 프로젝트 생성: npm create vite@latest . -- --template react

[v] 라이브러리 설치: npm install three @types/three @react-three/fiber @react-three/drei framer-motion lucide-react clsx tailwind-merge

[v] 개발 도구 설치: npm install -D tailwindcss postcss autoprefixer gh-pages

[v] Tailwind CSS 초기화: npx tailwindcss init -p 및 index.css 설정

[v] GitHub 리포지토리 연결 (sudongcu.github.io)

Step 2: 데이터 및 구조 설계
[v] 폴더 구조: src/components(canvas, sections), src/constants, src/hooks

[v] 데이터 분리: src/constants/index.js 파일에 이력 및 프로젝트 데이터 작성

[v] 메인 레이아웃: 스크롤 영역 및 배경 레이아웃 구성

Step 3: Hero 섹션 (3D) 구현
[v] Canvas 설정: R3F Canvas 배치 및 기본 조명 설정

[v] 3D 오브젝트: 기하학적 형태의 메쉬(Mesh) 생성 및 재질 적용

[v] 인터랙션: 마우스 좌표에 따른 오브젝트 회전 및 움직임 로직 구현

[v] 반응형: 화면 크기에 따른 카메라 시야각(FOV) 조정

Step 4: UI 섹션 개발
[v] About/Experience: 타임라인 형태의 경력 사항 나열

[v] Skills: 카테고리별 기술 스택 아이콘 및 텍스트 배치

[v] Projects: 이미지, 설명, 기술 스택, 링크가 포함된 카드 UI 구현

[v] 애니메이션: Framer Motion을 활용한 섹션 진입 효과 적용

Step 5: 최적화 및 디테일
[ ] 로딩 화면: 3D 자산 로드 중 표시할 Loading 컴포넌트 제작

[v] 스크롤 성능: 불필요한 리렌더링 방지 및 3D 캔버스 성능 최적화

[v] 모바일 대응: 모바일 환경 레이아웃 및 터치 인터랙션 확인

Step 6: 빌드 및 배포
[v] package.json: homepage 설정 및 deploy 스크립트 등록

[ ] 정적 빌드: npm run build 실행 및 dist 폴더 확인

[ ] 최종 배포: npm run deploy 실행 및 웹 접속 확인

3. 주요 구성 요소 (Components)
Navbar: 상단 내비게이션

Hero: 3D 캔버스 및 메인 카피

Experience: 경력 사항 섹션

TechStack: 보유 기술 섹션

ProjectList: 프로젝트 포트폴리오 섹션

Contact: 연락처 및 링크