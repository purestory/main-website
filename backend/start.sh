#!/bin/bash

echo "🚀 지뢰찾기 백엔드 서버 설정 및 시작..."

# Node.js와 npm이 설치되어 있는지 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되지 않았습니다. 설치 중..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm이 설치되지 않았습니다."
    exit 1
fi

# SQLite3 설치 확인
if ! command -v sqlite3 &> /dev/null; then
    echo "📦 SQLite3 설치 중..."
    sudo apt update
    sudo apt install -y sqlite3
fi

# backend 디렉토리로 이동
cd "$(dirname "$0")"

# 의존성 설치
echo "📦 npm 패키지 설치 중..."
npm install

# 포트 확인 및 서버 시작
PORT=${PORT:-8001}
echo "🌐 포트 $PORT 에서 백엔드 서버를 시작합니다..."

# 기존 프로세스가 있다면 종료
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  포트 $PORT 가 이미 사용 중입니다. 기존 프로세스를 종료합니다..."
    sudo kill -9 $(lsof -Pi :$PORT -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

# 서버 시작
echo "✅ 모든 준비가 완료되었습니다!"
echo "📱 브라우저에서 http://localhost:$PORT 로 접속하세요."
echo "🎯 백엔드 API: http://localhost:$PORT/api/"
echo ""

# 개발 모드로 실행 (nodemon이 있으면 사용, 없으면 node 사용)
if npm list nodemon --depth=0 &> /dev/null; then
    npm run dev
else
    npm start
fi 