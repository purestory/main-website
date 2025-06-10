# 🗄️ 지뢰찾기 백엔드 서버

Node.js + Express + SQLite를 사용한 지뢰찾기 게임 순위 시스템 백엔드입니다.

## 🚀 빠른 시작

```bash
# 의존성 설치 및 서버 시작
./start.sh

# 또는 수동 실행
npm install
npm start
```

## 📋 API 엔드포인트

### 순위 조회
- `GET /main-api/minesweeper/scores` - 모든 난이도 순위 조회
- `GET /main-api/minesweeper/scores?difficulty=beginner` - 특정 난이도 순위
- `GET /main-api/minesweeper/scores/beginner` - 초급 순위 (상위 10개)

### 점수 관리
- `POST /main-api/minesweeper/scores` - 새 점수 저장
- `DELETE /main-api/minesweeper/scores` - 모든 순위 초기화

## 🗃️ 데이터베이스

SQLite 데이터베이스 (`minesweeper.db`)가 자동으로 생성됩니다.

### scores 테이블 구조
```sql
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    time INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 환경 설정

- **포트**: 8001 (환경변수 PORT로 변경 가능)
- **CORS**: 모든 도메인 허용
- **정적 파일**: 상위 디렉토리(`../`) 서빙

## 📦 의존성

- **express**: 웹 서버 프레임워크
- **sqlite3**: SQLite 데이터베이스 드라이버
- **cors**: CORS 정책 관리
- **nodemon**: 개발용 자동 재시작

## 🔄 실행 모드

```bash
# 프로덕션 모드
npm start

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
``` 