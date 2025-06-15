# Main Website

Windows 95/98 스타일 데스크톱 시뮬레이션

## 주요 기능

### 부팅 시스템
- POST 화면 (BIOS 스타일)
- Boot 화면 (Windows 로딩)
- 자동 전환 시스템

### 데스크톱 환경
- Windows 95/98 스타일 UI
- 드래그 가능한 아이콘들
- 우클릭 컨텍스트 메뉴
- 멀티 윈도우 관리

### 내장 애플리케이션
- **계산기**: 완전 기능 계산기
- **지뢰찾기**: 난이도별 게임 + 점수 저장
- **Paint**: 그림 그리기 도구
- **파일 탐색기**: 외부 파일 관리자 연동
- **Chrome**: 웹 브라우저 (iframe)
- **시스템 모니터**: 서버/프로젝트/앱 상태 모니터링
- **내 컴퓨터**: 시스템 정보 표시

### 외부 연결 앱
#### AI/ML 서비스
- **OpenWebUI**: Ollama용 웹 인터페이스 (`/openwebui/`)
- **Amica AI**: 3D AI 가상 비서 (`/amica/`)
- **Translation Service**: AI 기반 다중 엔진 번역 (`/translation/`)
- **Whisper STT**: 고속 음성-텍스트 변환 (`/whisper/`)
- **EdgeTTS**: Microsoft Edge 고품질 TTS (`/edgetts/`)
- **Zonos TTS**: 고품질 텍스트-음성 변환 (`/zonos/`)
- **Kokoro FastAPI**: 다국어 TTS 서비스 (`/kokoro/`)

#### 웹 서비스
- **N8N**: 워크플로우 자동화 (`/n8n/`)
- **Tribler**: P2P 파일 공유 (`/tribler/`)
- **Cobalt**: 소셜 미디어 다운로더 (`/cobalt/`)

### 태스크바
- 시작 버튼 + 시작 메뉴
- 빠른 실행 영역 (바탕화면 보기, 파일 탐색기, Chrome)
- 시계 (12시간 형식 + 년-월-일)
- 볼륨 아이콘

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Nginx 정적 파일 서빙
- **Database**: SQLite (지뢰찾기 점수)
- **스타일링**: CSS3

## 프로젝트 구조

```
main-website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── boot/          # 부팅 시스템
│   │   │   ├── desktop/       # 데스크톱 환경
│   │   │   ├── windows/       # 애플리케이션 창들
│   │   │   └── ui/           # 공통 UI 컴포넌트
│   │   ├── types/            # TypeScript 타입 정의
│   │   ├── data/             # 프로젝트 데이터
│   │   └── assets/           # 이미지 리소스
│   └── dist/                 # 빌드 결과물
├── backend/                  # SQLite DB
└── tmp/                     # 임시 파일
```

## 개발

```bash
cd frontend
npm install
npm run dev    # 개발서버
npm run build  # 빌드
```

## 배포

빌드 후 파일들이 자동으로 `/home/purestory/main-website/frontend/dist`에 생성됨
nginx가 이 경로를 직접 참조하므로 별도 복사 불필요

## 개발 규칙

### 절대 금지사항
1. nginx sites-enabled에 백업파일 생성 금지
2. 권한 확인 없이 파일 수정 금지
3. 배포 경로 임의 지정 금지
4. 사용자 승인 없이 배포 금지

### 필수 준수사항
1. 파일 수정 전 권한 확인 (`ls -la`)
2. nginx 설정은 tmp 폴더에서 편집
3. 배포 전 백업 생성
4. 배포 경로는 사용자에게 확인

## 최근 업데이트

### v1.3.0 (2025-06-15)
- 시스템 모니터 앱 추가
- iframe 권한 확장
- 시계 개선 (12시간 형식 + 년도)
- 태스크바 디자인 개선

### v1.2.0 (2025-06-14)
- 컨텍스트 메뉴 제어
- 볼륨 아이콘 추가
- POST 화면 개선 