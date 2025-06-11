\#!/bin/bash

# 고정 브랜치명
BRANCH_NAME="deployment-ready-20250611-0243"
REPO_URL="https://github.com/forworldapp/personalitycamera.git"

echo "=== $BRANCH_NAME 브랜치로 코드 푸시 중 ==="

# Git 저장소인지 확인
if [ ! -d .git ]; then
  echo "❌ 이 디렉토리는 Git 저장소가 아닙니다."
  exit 1
fi

# 원격 저장소 설정 확인 및 등록
if ! git remote | grep -q "^origin$"; then
  echo "🔗 origin 원격 저장소가 없어서 등록합니다: $REPO_URL"
  git remote add origin "$REPO_URL"
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
  git checkout $BRANCH_NAME
  echo "✔️ 로컬에 $BRANCH_NAME 브랜치가 이미 있어 체크아웃했습니다."
else
  git checkout -b $BRANCH_NAME
  echo "✨ 새 브랜치 $BRANCH_NAME 생성 완료!"
fi

# 브랜치 푸시
if git push -u origin "$BRANCH_NAME"; then
  echo ""
  echo "✅ 코드가 $BRANCH_NAME 브랜치로 푸시되었습니다!"
  echo "🔗 GitHub: https://github.com/forworldapp/personalitycamera/tree/$BRANCH_NAME"
else
  echo "❌ 푸시에 실패했습니다. 원격 저장소 권한이나 연결 상태를 확인하세요."
  exit 1
fi

# (선택) main 브랜치로 복귀하려면 아래 주석 해제
# git checkout main

# 안내 메시지
echo ""
echo "📥 클론 가이드:"
echo "git clone https://github.com/forworldapp/personalitycamera.git"
echo "cd personalitycamera"
echo "git checkout $BRANCH_NAME"
echo "npm install"
echo "./scripts/build-all-platforms.sh android"
