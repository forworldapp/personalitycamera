# 배포 패키지 다운로드 가이드

## 현재 상황
Replit 환경에서 Git 작업에 제한이 있어 GitHub 브랜치 생성이 어렵습니다. 하지만 프로젝트는 완전히 배포 준비가 완료된 상태입니다.

## 다운로드 방법

### 방법 1: GitHub에서 직접 클론 (권장)
```bash
git clone https://github.com/forworldapp/personalitycamera.git
cd personalitycamera
npm install
```

### 방법 2: Replit에서 ZIP 다운로드
1. Replit 좌측 Files 패널에서 루트 폴더 우클릭
2. "Download" 선택
3. ZIP 파일로 전체 프로젝트 다운로드

## 로컬 빌드 과정

### 1. 환경 설정
```bash
# 의존성 설치
npm install

# 환경변수 설정
echo "GEMINI_API_KEY=your_actual_key" > .env
echo "DATABASE_URL=your_database_url" >> .env
```

### 2. Android 빌드
```bash
# 모든 플랫폼 빌드
./scripts/build-all-platforms.sh android

# 또는 개별 명령어
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### 3. iOS 빌드 (macOS만)
```bash
npx cap sync ios
npx cap open ios
# Xcode에서 Archive 생성
```

## 완료된 준비사항
- ✅ 완전한 앱 기능 (AI 분석, 카메라, 광고시스템)
- ✅ 양대 플랫폼 빌드 스크립트
- ✅ 앱스토어 출시 가이드 및 자료
- ✅ 마케팅 전략 및 수익화 모델
- ✅ 법적 문서 (개인정보처리방침, 이용약관)

GitHub에서 클론하여 바로 빌드하시면 됩니다.