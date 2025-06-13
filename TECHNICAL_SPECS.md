# 기술 사양서 (Technical Specifications)

## 🏗️ 시스템 아키텍처

### 전체 구조
```
Main Website
├── Frontend (React + TypeScript)
│   ├── 부팅 시스템
│   ├── 데스크톱 환경
│   ├── 창 관리 시스템
│   └── 애플리케이션들
├── Backend (정적 파일 서빙)
└── 배포 (Nginx)
```

## 🛠️ 기술 스택

### Frontend
- **프레임워크**: React 18.x
- **언어**: TypeScript 5.x
- **빌드 도구**: Vite 6.x
- **스타일링**: CSS3 (CSS-in-CSS)
- **상태 관리**: React useState/useEffect

### Backend
- **웹서버**: Nginx
- **배포 방식**: 정적 파일 서빙
- **파일 구조**: SPA (Single Page Application)

### 개발 도구
- **패키지 매니저**: npm
- **버전 관리**: Git
- **저장소**: GitHub
- **에디터**: VS Code (권장)

## 📁 프로젝트 구조

```
main-website/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── boot/
│   │   │   │   └── BootScreen.tsx
│   │   │   ├── desktop/
│   │   │   │   ├── Desktop.tsx
│   │   │   │   ├── Taskbar.tsx
│   │   │   │   ├── StartMenu.tsx
│   │   │   │   ├── DesktopIcons.tsx
│   │   │   │   └── ContextMenu.tsx
│   │   │   ├── windows/
│   │   │   │   ├── WindowManager.tsx
│   │   │   │   ├── CalculatorWindow.tsx
│   │   │   │   ├── MinesweeperWindow.tsx
│   │   │   │   ├── PaintWindow.tsx
│   │   │   │   └── [기타 윈도우들]
│   │   │   └── ui/
│   │   │       └── Window.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── dist/ (빌드 결과물)
├── backend/
│   └── minesweeper.db (SQLite)
├── PROJECT_STATUS.md
├── DEVELOPMENT_LOG.md
├── TECHNICAL_SPECS.md
└── README.md
```

## 🔧 핵심 컴포넌트 사양

### 1. App.tsx (루트 컴포넌트)
```typescript
interface AppState {
  bootState: BootState
  windows: WindowState[]
  isBootComplete: boolean
}

// 부팅 → 데스크톱 전환 관리
// 전역 상태 관리
```

### 2. BootScreen.tsx (부팅 시스템)
```typescript
interface BootScreenProps {
  bootState: BootState
  updateBootState: (state: Partial<BootState>) => void
  onBootComplete: () => void
}

// POST 화면 (BIOS 메시지)
// Boot 화면 (Windows 로딩)
// 자동 진행 시스템
```

### 3. Desktop.tsx (데스크톱 환경)
```typescript
interface DesktopProps {
  windows: WindowState[]
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>
  isBootComplete?: boolean
}

// 데스크톱 아이콘 관리
// 컨텍스트 메뉴 제어
// 창 생성/관리
```

### 4. WindowManager.tsx (창 관리)
```typescript
interface WindowManagerProps {
  windows: WindowState[]
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>
  onWindowMove: (id: string, position: Position) => void
  onWindowResize: (id: string, size: Size) => void
}

// 멀티 윈도우 렌더링
// Z-Index 관리
// 드래그 앤 드롭
// 리사이즈 처리
```

### 5. Taskbar.tsx (태스크바)
```typescript
interface TaskbarProps {
  time: Date
  windows: WindowState[]
  onWindowClick: (windowId: string) => void
  onStartClick: () => void
  onOpenWindow?: (windowId: string, title: string) => void
  onMinimizeAll?: () => void
}

// 시작 버튼
// 빠른 실행 영역
// 시계 + 볼륨 아이콘
// 창 목록 (미구현)
```

## 📊 데이터 타입 정의

### 핵심 타입들
```typescript
// 부팅 상태
interface BootState {
  currentPhase: 'post' | 'boot'
  progress: number
  messages: string[]
}

// 창 상태
interface WindowState {
  id: string
  title: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

// 데스크톱 아이콘
interface DesktopIcon {
  id: string
  label: string
  image: string
  windowId: string
}

// 컨텍스트 메뉴 아이템
interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  separator?: boolean
  disabled?: boolean
}
```

## 🎨 스타일링 시스템

### CSS 구조
```css
/* 전역 스타일 */
* { /* 리셋 */ }
html, body { /* 기본 설정 */ }

/* 부팅 화면 */
#post-screen { /* POST 화면 */ }
#boot-screen { /* Boot 화면 */ }

/* 데스크톱 */
.desktop { /* 바탕화면 */ }
.desktop-icon { /* 아이콘들 */ }

/* 창 시스템 */
.window { /* 기본 창 */ }
.window-header { /* 제목 표시줄 */ }
.window-body { /* 내용 영역 */ }

/* 태스크바 */
.taskbar { /* 태스크바 */ }
.taskbar-right { /* 우측 영역 */ }
.quick-launch { /* 빠른 실행 */ }

/* 애플리케이션별 */
.calculator-body { /* 계산기 */ }
.minesweeper-body { /* 지뢰찾기 */ }
/* ... */
```

### 디자인 시스템
- **색상 팔레트**: Windows 95/98 기본 색상
  - 배경: `#c0c0c0`
  - 테두리: `#ffffff`, `#808080`
  - 강조: `#0058a8`
- **폰트**: 'MS Sans Serif', sans-serif
- **간격**: 8px 기본 단위
- **그림자**: `2px 2px 5px rgba(0,0,0,0.3)`

## ⚡ 성능 최적화

### 현재 적용된 최적화
1. **React.memo**: 불필요한 리렌더링 방지 (부분적)
2. **useCallback**: 함수 메모이제이션 (부분적)
3. **CSS 최적화**: 효율적인 선택자 사용
4. **이미지 최적화**: 적절한 크기와 포맷

### 향후 최적화 계획
1. **코드 스플리팅**: 애플리케이션별 지연 로딩
2. **가상화**: 대량 데이터 처리 시
3. **메모리 관리**: 창 닫기 시 정리
4. **번들 최적화**: Tree shaking 강화

## 🔒 보안 고려사항

### 현재 보안 조치
1. **XSS 방지**: React의 기본 보호
2. **CSRF 방지**: 정적 사이트로 해당 없음
3. **Content Security Policy**: 기본 설정

### 추가 보안 계획
1. **입력 검증**: 사용자 입력 검증 강화
2. **HTTPS**: SSL 인증서 적용
3. **헤더 보안**: 보안 헤더 추가

## 🧪 테스트 전략

### 현재 테스트 상태
- **수동 테스트**: 기능별 수동 검증
- **브라우저 테스트**: Chrome, Firefox, Safari

### 향후 테스트 계획
1. **단위 테스트**: Jest + React Testing Library
2. **통합 테스트**: 컴포넌트 간 상호작용
3. **E2E 테스트**: Playwright 또는 Cypress
4. **성능 테스트**: Lighthouse 점수 개선

## 📱 반응형 디자인

### 현재 상태
- **데스크톱 중심**: 1024px 이상 최적화
- **부분적 반응형**: 일부 컴포넌트만 적용

### 개선 계획
1. **모바일 UI**: 터치 친화적 인터페이스
2. **태블릿 지원**: 중간 크기 화면 최적화
3. **적응형 레이아웃**: 화면 크기별 다른 UI



### 배포 프로세스
1. **빌드**: `npm run build`
2. **파일 복사**: `dist/` → 웹서버 디렉토리
3. **Nginx 설정**: SPA 라우팅 지원
4. **캐시 설정**: 정적 파일 캐싱

### 환경 설정
```nginx
# Nginx 설정 예시
server {
    listen 80;
    server_name example.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

**문서 버전**: v1.2.0  
**마지막 업데이트**: 2025-06-14  
**작성자**: AI Assistant  
**검토 필요**: 프로덕션 배포 전 