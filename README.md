# 🖥️ Windows 스타일 웹 데스크톱 - AI 서비스 허브

## 📋 프로젝트 개요

**itsmyzone.iptime.org**의 메인 웹사이트는 **Windows 9x 스타일의 웹 데스크톱 환경**을 제공하는 독특한 AI 서비스 허브입니다.
실제 Windows 컴퓨터의 부팅 과정부터 바탕화면, 시작 메뉴, 창 관리까지 완벽하게 재현하여 사용자에게 친숙하면서도 새로운 웹 경험을 제공합니다.

## ✨ 핵심 특징

### 💻 완전한 Windows 에뮬레이션
- **POST/BIOS 화면**: 실제 컴퓨터 부팅 과정 시뮬레이션
- **Windows 부트 화면**: 로고 애니메이션과 진행률 표시
- **클래식 데스크톱**: Windows 9x 스타일의 바탕화면과 작업 표시줄
- **창 관리 시스템**: 실시간 드래그, 크기 조정, 최소화/닫기
- **시작 메뉴**: 계층형 메뉴 구조와 프로그램 실행

### 🎮 내장 데스크톱 애플리케이션
- **🧮 계산기**: 완전 기능 Windows 스타일 계산기
- **💣 지뢰찾기**: 클래식 지뢰찾기 게임 (난이도 선택 가능)
- **🖥️ 내 컴퓨터**: 시스템 정보 및 가상 드라이브 탐색
- **📁 프로젝트 폴더**: AI 서비스 및 웹 도구 런처

### 🤖 AI/ML 서비스 통합 (18개 서비스)
- **OpenWebUI**: Ollama용 웹 인터페이스 (Docker)
- **Amica AI**: 3D AI 가상 비서 (내부용)
- **Translation Service**: AI 기반 다중 엔진 번역
- **Whisper STT**: 고속 음성-텍스트 변환 (100+ 언어)
- **EdgeTTS**: Microsoft Edge 고품질 TTS
- **Zonos TTS**: 고품질 텍스트-음성 변환 (200k시간 학습)
- **Kokoro FastAPI**: 다국어 TTS 서비스 (Docker)

### 🌐 웹 서비스 & 도구
- **Explorer**: 웹 기반 파일 탐색기
- **N8N**: 워크플로우 자동화 (Docker)
- **Tribler**: P2P 파일 공유 (Docker)
- **Cobalt**: 소셜 미디어 다운로더
- **WebTools**: 이미지 변환 도구

### 🔧 개발/운영 도구
- **Ollama**: 로컬 LLM 서버 (Docker)
- **GPU 모니터링**: RTX 3090 24GB 실시간 모니터링
- **Docker 관리**: 컨테이너 상태 및 리소스 관리
- **성능 모니터링**: CPU, 메모리, 디스크 사용률

## 🛠️ 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업 및 웹 표준 준수
- **CSS3**:
  - Windows 9x UI 완벽 재현
  - 반응형 디자인 (데스크톱/모바일)
  - CSS Grid & Flexbox 레이아웃
  - 애니메이션 및 트랜지션 효과
- **Vanilla JavaScript**:
  - 모듈화된 구조 (8개 JS 파일)
  - 창 관리 시스템
  - 이벤트 기반 아키텍처
  - 게임 로직 구현

### 백엔드 & 인프라
- **Nginx**: 웹 서버 및 리버스 프록시
- **Ubuntu Server**: 운영 체제
- **systemd**: 서비스 관리
- **Docker**: 컨테이너 기반 서비스 배포
- **GPU**: NVIDIA RTX 3090 24GB

## 📁 파일 구조

```
main-website/
├── index.html              # 메인 페이지 (210 lines)
├── README.md              # 프로젝트 문서
├── css/
│   └── style.css          # 전체 스타일시트 (1074 lines)
└── js/                    # 모듈화된 JavaScript (8개 파일)
    ├── common.js          # 공통 DOM 요소 정의
    ├── boot.js            # 부팅 시퀀스 처리
    ├── desktop.js         # 데스크톱 아이콘 및 시작 메뉴
    ├── windowManager.js   # 창 관리 시스템
    ├── projectsApp.js     # AI 서비스 데이터 및 렌더링
    ├── calculator.js      # 계산기 애플리케이션
    ├── minesweeper.js     # 지뢰찾기 게임 로직
    └── myComputerApp.js   # 시스템 정보 표시
```

## 🎨 UI/UX 디자인

### Windows 9x 테마
- **색상 팔레트**: 클래식 Windows 그레이 톤
- **타이포그래피**: MS Sans Serif 스타일 폰트
- **아이콘**: 90년대 픽셀 아트 스타일 이모지
- **창 효과**: 3D 베젤 효과와 그림자

### 반응형 디자인
- **데스크톱**: 전체 창 관리 시스템
- **태블릿**: 터치 최적화 인터페이스
- **모바일**: 간소화된 모바일 뷰

### 애니메이션 시스템
- **부팅 시퀀스**: POST → 부트 → 데스크톱 전환
- **창 애니메이션**: 열기/닫기 효과
- **호버 효과**: 버튼 및 아이콘 인터랙션

## 🚀 설치 및 배포

### 1. 파일 배포
```bash
# 웹사이트 디렉토리 생성
mkdir -p /home/purestory/main-website

# 파일 권한 설정
chmod 755 /home/purestory/main-website
chmod 644 /home/purestory/main-website/index.html
```

### 2. Nginx 설정
```nginx
# 메인 페이지 설정
location = / {
    root /home/purestory/main-website;
    try_files /index.html =404;

    # 실시간 업데이트를 위한 캐시 비활성화
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 정적 파일 (CSS, JS)
location ~ ^/(css|js)/ {
    root /home/purestory/main-website;
    expires 1d;
    add_header Cache-Control "public";
}
```

### 3. 서비스 적용
```bash
# Nginx 설정 테스트
sudo nginx -t

# Nginx 재로드
sudo systemctl reload nginx
```

## 🎮 사용 방법

### 웹사이트 접속
1. **URL**: http://itsmyzone.iptime.org/
2. **부팅 과정 관람**: POST → Windows 부팅 → 데스크톱 로드
3. **데스크톱 탐색**: 아이콘 더블클릭으로 애플리케이션 실행

### 내장 애플리케이션 사용
- **계산기**: 시작 메뉴 또는 바탕화면 아이콘
- **지뢰찾기**: 클래식 게임 체험 (초급/중급/고급)
- **내 컴퓨터**: 시스템 정보 및 드라이브 탐색
- **프로젝트**: AI 서비스 런처 (18개 서비스)

### AI 서비스 접근
1. **프로젝트 폴더** 더블클릭
2. **서비스 카테고리별 탐색**:
   - 🤖 AI/ML 서비스
   - 🌐 웹 서비스
   - 🔧 개발/운영 도구
3. **서비스 실행**: 아이콘 클릭으로 새 탭에서 열기

## 📈 성능 최적화

### 캐싱 전략
- **HTML**: 실시간 업데이트를 위한 캐시 비활성화
- **CSS/JS**: 1일 캐싱으로 로딩 속도 향상
- **브라우저 캐싱**: 정적 리소스 최적화

### 코드 최적화
- **모듈화**: 8개 JS 파일로 기능별 분리
- **이벤트 위임**: 효율적인 이벤트 처리
- **메모리 관리**: 창 열기/닫기 시 리소스 정리

## 🔄 서비스 관리

### AI 서비스 추가/수정
```javascript
// js/projectsApp.js 파일에서 projectsData 배열 수정
const projectsData = [
    {
        name: '새 서비스',
        description: '서비스 설명',
        link: '/새서비스/',
        type: 'AI/ML Service',
        status: 'Active',
        iconUrl: 'https://example.com/icon.png' // 선택사항
    }
    // ... 기존 서비스들
];
```

### 상태 모니터링
- **Docker 서비스**: `docker ps`로 컨테이너 상태 확인
- **systemd 서비스**: `systemctl status` 명령어
- **GPU 사용률**: nvidia-smi 실시간 모니터링

## 🔮 향후 개발 계획

### 기능 확장
- [ ] 실시간 서버 상태 API 연동
- [ ] 웹소켓 기반 실시간 업데이트
- [ ] 다크 테마 토글 기능
- [ ] 사용자 설정 저장 (LocalStorage)
- [ ] PWA (Progressive Web App) 지원

### 게임 추가
- [ ] 솔리테어 카드 게임
- [ ] 테트리스 게임
- [ ] 스네이크 게임
- [ ] 2048 퍼즐 게임

### 시스템 개선
- [ ] 멀티 모니터 지원
- [ ] 창 스냅 기능
- [ ] 가상 키보드
- [ ] 음성 명령 인터페이스

## 🔧 기술적 특징

### 창 관리 시스템
- **드래그 앤 드롭**: 실시간 창 이동
- **크기 조정**: 모든 방향 리사이징
- **Z-Index 관리**: 창 포커스 시스템
- **최소화/복원**: Windows 스타일 애니메이션

### 게임 엔진
- **지뢰찾기**: 완전한 게임 로직 구현
  - 재귀적 빈 칸 열기
  - 플래그 시스템
  - 타이머 및 점수 시스템
  - 난이도별 맞춤 설정

### 애니메이션 시스템
- **CSS 키프레임**: 부드러운 전환 효과
- **JavaScript 타이머**: 부팅 시퀀스 제어
- **상태 관리**: 애플리케이션 생명주기

## 📞 지원 및 문의

- **관리자**: purestory
- **서버**: Ubuntu Server (RTX 3090 24GB)
- **접속**: http://itsmyzone.iptime.org/
- **모니터링**: 24/7 자동 상태 확인

---

© 2025 ItsMyZone Windows Desktop Simulator - 향수를 불러일으키는 AI 서비스 통합 플랫폼
