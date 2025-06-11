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

# config.lock 제거
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

# 브랜치 이동
if git show-ref --quiet refs/heads/$BRANCH_NAME; then
  git checkout $BRANCH_NAME
  echo "✔️ 기존 브랜치 $BRANCH_NAME 체크아웃 완료"
else
  git checkout -b $BRANCH_NAME
  echo "✨ 새 브랜치 $BRANCH_NAME 생성 완료"
fi

# 원격 변경 사항 반영 (rebase)
echo "🔄 원격 브랜치와 동기화 시도 중..."
if git pull --rebase origin "$BRANCH_NAME"; then
  echo "✅ 리베이스 완료"
else
  echo "⚠️ 리베이스 실패 – 충돌 무시하고 강제 푸시 준비 중..."
fi

# 푸시 시도
if git push origin "$BRANCH_NAME"; then
  echo ""
  echo "✅ 정상적으로 푸시 완료!"
else
  echo "⚠️ 일반 푸시 실패 – 강제 푸시 실행 중..."
  if git push -f origin "$BRANCH_NAME"; then
    echo "✅ 강제 푸시 완료!"
  else
    echo "❌ 강제 푸시에도 실패했습니다. 권한 또는 네트워크 상태를 확인하세요."
    exit 1
  fi
fi

# 결과 안내
echo ""
echo "🔗 GitHub: https://github.com/forworldapp/personalitycamera/tree/$BRANCH_NAME"
echo ""
echo "📥 클론 및 빌드 가이드:"
echo "git clone https://github.com/forworldapp/personalitycamera.git"
echo "cd personalitycamera"
echo "git checkout $BRANCH_NAME"
echo "npm install"
echo "./scripts/build-all-platforms.sh android"
