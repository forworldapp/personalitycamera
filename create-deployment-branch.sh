#!/bin/bash

# 배포 준비 완료 브랜치 생성 스크립트
echo "=== 배포 준비 완료 브랜치 생성 중 ==="

# 현재 날짜와 시간으로 브랜치명 생성
BRANCH_NAME="deployment-ready-$(date +%Y%m%d-%H%M)"
echo "브랜치명: $BRANCH_NAME"

# 모든 변경사항 추가
git add .

# 현재 상태 커밋
git commit -m "🚀 Ready for deployment - Complete Personality AI app

✅ Features completed:
- AI personality analysis with Google Gemini
- MBTI prediction and Big Five traits
- Korean/English bilingual support
- Camera capture with animated loading
- AdMob monetization system
- iOS/Android deployment ready
- Complete documentation and guides

✅ Technical stack:
- React + TypeScript + Tailwind CSS
- Express.js + PostgreSQL + Drizzle ORM
- Capacitor for mobile deployment
- Comprehensive build scripts

✅ Deployment assets:
- App store descriptions (KR/EN)
- Privacy policy and terms of service
- Marketing strategy and ASO plan
- Build scripts for all platforms

Ready for immediate deployment to Google Play Store and Apple App Store."

# 새 브랜치 생성 및 전환
git checkout -b $BRANCH_NAME

# GitHub에 새 브랜치 푸시
git push origin $BRANCH_NAME

# main 브랜치로 돌아가기
git checkout main

# main 브랜치도 업데이트
git push origin main

echo "✅ 백업 완료!"
echo "📦 배포 준비 브랜치: $BRANCH_NAME"
echo "🔗 GitHub: https://github.com/forworldapp/personalitycamera"
echo ""
echo "이제 안전하게 클론하여 로컬에서 빌드할 수 있습니다:"
echo "git clone https://github.com/forworldapp/personalitycamera.git"
echo "cd personalitycamera"
echo "git checkout $BRANCH_NAME  # 배포 준비 완료 버전"
echo "npm install"
echo "./scripts/build-all-platforms.sh android"