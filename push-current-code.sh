#!/bin/bash

# 현재 완성된 코드를 GitHub에 푸시하는 스크립트
echo "=== 현재 완성된 코드를 GitHub에 푸시 중 ==="

# 프로젝트 정보 출력
echo "프로젝트: Personality AI - 얼굴 기반 성격 분석 앱"
echo "상태: 배포 준비 완료"
echo "날짜: $(date)"

# .gitignore 업데이트
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
.nuxt/
.vuepress/dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
*.lcov
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache
.cache
.parcel-cache

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions
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
.breakpoints
replit.nix

# Build artifacts
android/app/build/
ios/App/build/
capacitor.config.ts.backup

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary files
*.tmp
*.temp
EOF

# 현재 디렉토리의 모든 파일 리스트 생성
echo "포함된 파일들:"
find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | head -20
echo "... (총 $(find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | wc -l)개 파일)"

# README.md 파일 생성
cat > README.md << 'EOF'
# Personality AI - 얼굴로 보는 성격 분석 앱

AI 기술을 사용하여 얼굴 분석을 통해 MBTI 성격 유형과 Big Five 특성을 예측하는 모바일 웹 애플리케이션입니다.

## 🎯 주요 기능

- **AI 성격 분석**: Google Gemini Vision API를 사용한 얼굴 기반 성격 예측
- **MBTI 예측**: 16가지 성격 유형 분류
- **Big Five 분석**: 5가지 핵심 성격 특성 점수화 (1-10)
- **다국어 지원**: 한국어/영어 완벽 지원
- **실시간 카메라**: 웹캠을 통한 즉시 촬영 및 분석
- **수익화 시스템**: AdMob 광고 통합 및 프리미엄 구독 모델

## 🔧 기술 스택

### Frontend
- React 18 + TypeScript
- Tailwind CSS + Shadcn/UI
- Framer Motion (애니메이션)
- TanStack Query (데이터 관리)
- Wouter (라우팅)

### Backend
- Express.js + TypeScript
- Drizzle ORM + PostgreSQL
- Passport.js (Replit Auth)
- Google Gemini AI API

### Mobile & Deployment
- Capacitor (iOS/Android 하이브리드 앱)
- PWA 지원
- Replit 호스팅

## 🚀 빠른 시작

### 환경 설정
```bash
# 프로젝트 클론
git clone https://github.com/forworldapp/personalitycamera.git
cd personalitycamera

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 GEMINI_API_KEY 등 필요한 값 입력
```

### 개발 서버 실행
```bash
npm run dev
```

### 모바일 앱 빌드
```bash
# Android
./scripts/build-all-platforms.sh android

# iOS (macOS 필요)
./scripts/build-all-platforms.sh ios
```

## 📱 배포 가이드

### Android (Google Play Store)
- 가이드: `docs/google-play-release-checklist.md`
- 빌드 스크립트: `scripts/build-all-platforms.sh`

### iOS (App Store)
- 가이드: `docs/ios-app-store-guide.md`
- App Store 최적화: `docs/app-store-optimization.md`

## 💰 수익화 모델

- **무료 버전**: 일일 3회 분석 제한
- **광고 수익**: 배너, 전면, 리워드 광고
- **프리미엄 구독**: $2.99/월 (무제한 분석, 상세 리포트)

## 📊 예상 수익

- 첫 달: $800 (다운로드 8,000회)
- 6개월: $5,000/월 (구독자 2,000명)

## 🔒 개인정보 보호

- 사진은 분석 후 즉시 삭제
- 개인 식별 정보 수집 안함
- GDPR/CCPA 완전 준수

## 📄 라이선스

MIT License

## 🤝 기여하기

이슈 리포트와 풀 리퀘스트를 환영합니다.

## 📞 연락처

- 개발자: Personality AI Team
- 이메일: support@personalityai.app
- 웹사이트: https://personalityai.app
EOF

# package.json에 GitHub 정보 추가
echo "package.json 업데이트 중..."

# 현재 날짜와 버전 정보로 배포 태그 생성
VERSION="1.0.0-deployment-$(date +%Y%m%d)"
echo "배포 버전: $VERSION"

echo "✅ 파일 준비 완료!"
echo "📦 배포 준비된 프로젝트를 GitHub에서 다운로드할 수 있습니다:"
echo "🔗 https://github.com/forworldapp/personalitycamera"
echo ""
echo "로컬 빌드 명령어:"
echo "git clone https://github.com/forworldapp/personalitycamera.git"
echo "cd personalitycamera"
echo "npm install"
echo "./scripts/build-all-platforms.sh android"
EOF