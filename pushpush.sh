#!/bin/bash

# 고정 브랜치명
BRANCH_NAME="deployment-ready-20250611-0243"

echo "=== $BRANCH_NAME 브랜치로 코드 푸시 중 ==="

# Git 저장소인지 확인
if [ ! -d .git ]; then
  echo "❌ 이 디렉토리는 Git 저장소가 아닙니다."
  exit 1
fi

# 변경사항 모두 스테이징
git add .

# 커밋 (변경사항이 있을 때만)
if git diff --cached --quiet; then
  echo "✅ 커밋할 변경사항이 없습니다. 이전 커밋 상태 그대로 푸시합니다."
else
  git commit -m "📦 Deploy update for $BRANCH_NAME"
fi

# 브랜치가 없다면 생성
if git show-ref --quiet refs/heads/$BRANCH_NAME; then
  echo "✔️ 로컬에 $BRANCH_NAME 브랜치가 이미 있습니다."
else
  git checkout -b $BRANCH_NAME
fi

# 원격 브랜치 푸시
git push origin $BRANCH_NAME

# main 브랜치로 복귀 (선택)
#git checkout main

echo ""
echo "✅ 코드가 $BRANCH_NAME 브랜치로 푸시되었습니다!"
echo "🔗 GitHub: https://github.com/forworldapp/personalitycamera/tree/$BRANCH_NAME"
echo ""
echo "📥 클론 가이드:"
echo "git clone https://github.com/forworldapp/personalitycamera.git"
echo "cd personalitycamera"
echo "git checkout $BRANCH_NAME"
echo "npm install"
echo "./scripts/build-all-platforms.sh android"
