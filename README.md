# 3D Portfolio Website

인터랙티브한 3D 요소가 포함된 개인 포트폴리오 웹사이트입니다. React, Three.js, Tailwind CSS를 사용하여 구축되었습니다.

## ✨ 주요 기능

- **인터랙티브 3D Hero 섹션** - Three.js와 React Three Fiber를 활용한 드래그 가능한 3D 구체
- **부드러운 애니메이션** - Framer Motion을 통한 섹션 전환 효과
- **완전 반응형 디자인** - 모바일, 태블릿, 데스크톱 모든 기기 지원
- **다크 모드 UI** - 깔끔하고 전문적인 다크 테마 디자인
- **성능 최적화** - 빠른 로딩과 부드러운 인터랙션

## 🛠️ 기술 스택

- **프레임워크**: React 19 + Vite
- **3D 그래픽스**: Three.js, @react-three/fiber, @react-three/drei
- **애니메이션**: Framer Motion
- **스타일링**: Tailwind CSS 3.x
- **아이콘**: Lucide React
- **배포**: GitHub Pages

## 📦 설치 방법

```bash
# 리포지토리 클론
git clone https://github.com/sudongcu/sudongcu.github.io.git

# 프로젝트 디렉토리로 이동
cd sudongcu.github.io

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

## 🔧 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# GitHub Pages에 배포
npm run deploy
```

## 📝 커스터마이징 가이드

### 개인 정보 수정

`src/constants/index.js` 파일을 수정하여 다음 정보를 변경할 수 있습니다:

- **NAV_LINKS**: 네비게이션 메뉴 항목
- **EXPERIENCES**: 경력 사항 (회사명, 직책, 기간, 업무 내용, 기술 스택)
- **TECH_STACK**: 보유 기술 및 숙련도
- **PROJECTS**: 프로젝트 정보 (제목, 설명, 이미지, 기술 스택, 링크)
- **CONTACT_INFO**: 연락처 정보 (이메일, 소셜 링크)
- **HERO_TEXT**: 메인 페이지 텍스트

### 스타일 변경

- **색상 팔레트**: `tailwind.config.cjs`에서 primary, dark 색상 수정
- **폰트**: `index.html`에서 Google Fonts 링크 변경
- **컴포넌트 스타일**: `src/components/` 내의 각 컴포넌트 파일에서 Tailwind 클래스 수정

### 3D 오브젝트 커스터마이징

`src/components/canvas/AnimatedSphere.jsx`에서:
- `scale`: 구체 크기 조절
- `color`: 구체 색상 변경
- `distort`: 왜곡 효과 강도 조절
- `speed`: 애니메이션 속도 조절

## 📂 프로젝트 구조

```
sudongcu.github.io/
├── public/                    # 정적 파일
├── src/
│   ├── components/
│   │   ├── canvas/           # 3D 관련 컴포넌트
│   │   │   ├── AnimatedSphere.jsx    # 3D 구체 객체
│   │   │   └── HeroCanvas.jsx        # Three.js 캔버스
│   │   ├── sections/         # 페이지 섹션
│   │   │   ├── Hero.jsx              # 메인 히어로 섹션
│   │   │   ├── About.jsx             # 자기소개
│   │   │   ├── Experience.jsx        # 경력 사항
│   │   │   ├── TechStack.jsx         # 기술 스택
│   │   │   ├── ProjectList.jsx       # 프로젝트 목록
│   │   │   └── Contact.jsx           # 연락처
│   │   ├── Navbar.jsx        # 네비게이션 바
│   │   └── index.js          # 컴포넌트 export
│   ├── constants/
│   │   └── index.js          # 사이트 데이터 및 상수
│   ├── App.jsx               # 메인 앱 컴포넌트
│   ├── main.jsx              # 앱 진입점
│   ├── index.css             # 글로벌 스타일
│   └── App.css
├── doc/
│   └── plan.md               # 프로젝트 기획서
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
└── README.md
```

## 🎨 디자인 컨셉

### 색상 체계
- **다크 배경**: #0a0a0a ~ #282828
- **프라이머리**: 블루 그라디언트 (#0ea5e9)
- **텍스트**: 화이트 및 그레이 톤

### 타이포그래피
- **폰트**: Inter (Google Fonts)
- **가독성**: 명확한 계층 구조와 적절한 간격

### 레이아웃
- **섹션 기반**: 각 콘텐츠가 독립적인 섹션으로 구성
- **타임라인 형태**: 경력 사항은 시각적 타임라인으로 표현
- **카드 UI**: 프로젝트 및 기술 스택은 카드 형태로 구성

## 🌐 배포 방법

### GitHub Pages 배포

1. `package.json`에 homepage 설정 확인:
   ```json
   "homepage": "https://sudongcu.github.io"
   ```

2. 배포 스크립트 실행:
   ```bash
   npm run deploy
   ```

3. GitHub 리포지토리 설정에서 Pages 확인:
   - Settings > Pages
   - Source: gh-pages 브랜치

### 빌드 최적화

프로덕션 빌드 시 자동으로 적용됩니다:
- 코드 압축 (minification)
- Tree shaking
- 이미지 최적화
- CSS purging

## 🔍 주요 기능 설명

### 3D 인터랙션
- **OrbitControls**: 마우스 드래그로 3D 구체 회전 가능
- **자동 애니메이션**: 구체의 지속적인 회전과 왜곡 효과
- **반응형 렌더링**: 디바이스 성능에 맞춘 자동 최적화

### 스크롤 애니메이션
- **진입 효과**: 각 섹션이 뷰포트에 들어올 때 애니메이션
- **스태거 효과**: 요소들이 순차적으로 나타남
- **스크롤 인디케이터**: Hero 섹션 하단의 부드러운 애니메이션

### 네비게이션
- **고정 헤더**: 스크롤 시 투명도 변화
- **섹션 하이라이트**: 현재 스크롤 위치에 따른 메뉴 강조
- **부드러운 스크롤**: 메뉴 클릭 시 해당 섹션으로 스무스 이동
- **모바일 메뉴**: 햄버거 메뉴로 반응형 지원

## 📊 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다. 문제 발견 시 Issue를 등록해주세요.

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능합니다.

## 🤝 기여하기

버그 리포트, 기능 제안, Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

프로젝트 관련 문의사항이 있으시면 Issue를 등록해주세요.

---

**Built with** ⚡ React + 🎨 Three.js + 💎 Tailwind CSS

**Total Development Time**: 11년 1개월의 경력을 담은 포트폴리오
