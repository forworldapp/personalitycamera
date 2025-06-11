#!/bin/bash

# GitHub 백업 스크립트 - Personality AI
# 사용법: 로컬 환경에서 이 스크립트를 실행하세요

echo "=== Personality AI GitHub 백업 스크립트 ==="
echo "현재 디렉토리: $(pwd)"

# Git 저장소 초기화 (이미 있으면 건너뜀)
if [ ! -d ".git" ]; then
    echo "Git 저장소 초기화 중..."
    git init
else
    echo "Git 저장소가 이미 존재합니다."
fi

# .gitignore 파일 생성
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Replit specific
.replit
.upm
EOF

echo "파일들을 staging area에 추가 중..."
git add .

echo "첫 번째 커밋 생성 중..."
git commit -m "Initial commit: Personality AI - 얼굴로 보는 성격 분석 앱

Features:
- Google Gemini AI를 사용한 얼굴 기반 성격 분석
- MBTI 16가지 유형 예측
- Big Five 성격 특성 분석 (1-10 점수)
- 한국어/영어 이중 언어 지원
- 실시간 카메라 촬영 및 분석
- 반응형 모바일 퍼스트 디자인
- Replit 로그인 시스템 통합
- PostgreSQL 데이터베이스 연동

Monetization:
- 일일 분석 제한 시스템 (3회/일)
- 배너, 전면, 보상형 광고 컴포넌트
- AdMob 통합 준비
- PWA 설정으로 안드로이드 앱 변환 가능

Tech Stack:
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js + Drizzle ORM
- Database: PostgreSQL
- AI: Google Gemini Vision API
- Auth: Replit OpenID Connect"

echo "브랜치를 main으로 변경 중..."
git branch -M main

echo "원격 저장소 추가 중..."
git remote add origin git@github.com:forworldapp/personalitycamera.git

echo "GitHub에 푸시 중..."
git push -u origin main

echo "=== 백업 완료! ==="
echo "GitHub 저장소: https://github.com/forworldapp/personalitycamera"
echo ""
echo "다음 단계:"
echo "1. GitHub에서 저장소가 생성되었는지 확인"
echo "2. README.md 파일 추가 고려"
echo "3. 배포 설정 (Vercel, Netlify 등)"
echo "4. 환경변수 설정 (GEMINI_API_KEY, DATABASE_URL 등)"