# 🌟 ItsMyZone 메인 웹사이트

## 📋 프로젝트 개요

itsmyzone.iptime.org의 메인 랜딩 페이지입니다. 서버에서 운영 중인 모든 AI 서비스와 웹 도구들을 한눈에 볼 수 있는 허브 역할을 합니다.

## 🎯 주요 기능

### 📊 실시간 서버 상태
- **활성 서비스 수**: 15+ 개의 서비스
- **GPU 정보**: RTX 3090 24GB VRAM 사용률
- **서비스 운영**: 24/7 무중단 서비스
- **시스템 업타임**: 실시간 모니터링

### 🗂️ 서비스 카테고리

#### 🤖 AI/ML 서비스
- **Zonos TTS**: 고품질 텍스트-음성 변환 (200k시간 학습)
- **Whisper STT**: 고속 음성-텍스트 변환 (100+ 언어)
- **Translation Service**: AI 기반 다중 엔진 번역
- **EdgeTTS**: Microsoft Edge 고품질 TTS

#### 🌐 웹 서비스
- **Converter**: 이미지 및 자막 파일 변환
- **Explorer**: 웹 기반 파일 탐색기
- **YouTube Tools**: 유튜브 관련 도구

#### 🔧 개발/운영 도구
- **Ollama**: 로컬 LLM 서버 (Docker)
- **OpenWebUI**: Ollama용 웹 인터페이스
- **N8N**: 워크플로우 자동화

#### ✨ 특별 프로젝트
- **Amica AI**: 3D AI 가상 비서 (내부용)
- **Kokoro FastAPI**: 다국어 TTS 서비스

## 🛠️ 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 그라디언트 디자인
- **JavaScript**: 인터랙티브 애니메이션
- **반응형 디자인**: 모바일/데스크톱 최적화

### 백엔드
- **Nginx**: 웹 서버 및 리버스 프록시
- **Ubuntu Server**: 운영 체제
- **systemd**: 서비스 관리

### 인프라
- **GPU**: NVIDIA RTX 3090 24GB
- **도메인**: itsmyzone.iptime.org
- **SSL**: Let's Encrypt (자동 갱신)

## 📁 파일 구조

```
main-website/
├── index.html          # 메인 페이지
├── README.md           # 프로젝트 문서
└── assets/             # 정적 파일 (추후 추가)
    ├── css/
    ├── js/
    └── images/
```

## 🔧 설치 및 설정

### 1. 파일 배포
```bash
# 메인 웹사이트 디렉토리 생성
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
    
    # 캐시 설정
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 정적 파일 (CSS, JS, 이미지 등)
location ~ ^/(css|js|images|assets)/ {
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

## 🌐 접속 방법

- **메인 페이지**: http://itsmyzone.iptime.org/
- **로컬 접속**: http://localhost/

## 🎨 디자인 특징

### 색상 팔레트
- **주 색상**: 그라디언트 (#667eea → #764ba2)
- **배경**: 동적 그라디언트
- **카드**: 반투명 글래스모피즘
- **텍스트**: 고대비 가독성

### 애니메이션
- **페이지 로드**: 순차적 카드 애니메이션
- **호버 효과**: 부드러운 변환
- **진행 바**: GPU 사용률 시각화

### 반응형 디자인
- **데스크톱**: 4열 그리드 레이아웃
- **태블릿**: 2열 그리드 레이아웃
- **모바일**: 1열 스택 레이아웃

## 📈 성능 최적화

### 캐싱 전략
- **HTML**: 캐시 비활성화 (실시간 업데이트)
- **정적 파일**: 1일 캐싱
- **이미지**: 1년 캐싱 (추후)

### 로딩 최적화
- **인라인 CSS**: 외부 요청 최소화
- **압축**: Gzip 압축 활성화
- **최소화**: 불필요한 공백 제거

## 🔄 업데이트 방법

### 서비스 정보 업데이트
1. `index.html` 파일 수정
2. 서비스 상태 및 GPU 정보 업데이트
3. 새로운 서비스 추가/제거

### 실시간 정보 연동 (추후 계획)
- **API 엔드포인트**: `/api/status`
- **자동 업데이트**: JavaScript fetch
- **WebSocket**: 실시간 모니터링

## 🚀 향후 계획

### 기능 추가
- [ ] 실시간 서버 상태 API 연동
- [ ] 서비스별 상태 모니터링
- [ ] 다크/라이트 테마 토글
- [ ] 서비스 검색 기능
- [ ] 즐겨찾기 기능

### 성능 개선
- [ ] PWA (Progressive Web App) 지원
- [ ] 서비스 워커 캐싱
- [ ] 이미지 최적화
- [ ] CDN 연동

## 📞 문의 및 지원

- **관리자**: purestory
- **서버 위치**: Ubuntu Server
- **모니터링**: 24/7 자동 모니터링

---

© 2025 ItsMyZone Server - 다양한 AI 및 웹 서비스를 제공하는 통합 플랫폼 