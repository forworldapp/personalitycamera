#!/bin/bash

# 브랜치명과 GitHub 저장소 URL 정의
BRANCH_NAME="deployment-ready-20250611-0243"
REPO_URL="https://github.com/forworldapp/personalitycamera.git"

echo "=== $BRANCH_NAME 브랜치로 코드 푸시 중 ==="

# Git 저장소인지 확인
if [ ! -d .git ]; then
  echo "❌ 현재 디렉토리는 Git 저장소가 아닙니다."
  exit 1
fi

# config.lock 문제 해결
if [ -f .git/config.lock ]; then
  echo "⚠️ 기존 Git 설정 락 파일 제거 중..."
  rm -f .git/config.lock
fi

# origin 원격 저장소 확인
if ! git remote | grep -q "^origin$"; then
  echo "🔗 origin 원격 저장소가 없어서 등록합니다: $REPO_URL"
  git remote add origin "$REPO_URL"
fi

# 변경사항 스테이징
git add .

# 커밋 여부 판단 후 커밋
if git diff --cached --quiet; then
  echo "✅ 커밋할 변경사항이 없습니다. 이전 상태 그대로 푸시합니다."
else
  git commit -m "📦 Deploy update for $BRANCH_NAME"
fi

# 브랜치 존재 여부 확인 및 이동
if git show-ref --quiet refs/heads/$BRANCH_NAME; then
  git checkout $BRANCH_NAME
  echo "✔️ 기존 브랜치 $BRANCH_NAME 체크아웃 완료"
else
  git checkout -b $BRANCH_NAME
  echo "✨ 새 브랜치 $BRANCH_NAME 생성 완료"
fi

# 원격 브랜치 푸시
if git push -u origin "$BRANCH_NAME"; then
  echo ""
  echo "✅ 코드가 성공적으로 $BRANCH_NAME 브랜치에 푸시되었습니다!"
  echo "🔗 GitHub: https://github.com/forworldapp/personalitycamera/tree/$BRANCH_NAME"
else
  echo "❌ 푸시에 실패했습니다. 원격 저장소 접근 권한 또는 네트워크 상태를 확인하세요."
  exit 1
fi

# (선택) main 복귀
# git checkout main

# 클론 및 빌드 안내
echo ""
echo "📥 클론 및 빌드 가이드:"
echo "git clone https://github.com/forworldapp/personalitycamera.git"
echo "cd personalitycamera"
echo "git checkout $BRANCH_NAME"
echo "npm install"
echo "./scripts/build-all-platforms.sh android"
