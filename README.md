# Personality AI - 얼굴로 보는 성격 분석 앱

AI 기술을 사용하여 얼굴 분석을 통해 MBTI 성격 유형과 Big Five 특성을 예측하는 모바일 웹 애플리케이션입니다.

## 🎯 주요 기능

- **AI 성격 분석**: Google Gemini Vision API를 사용한 얼굴 기반 성격 예측
- **MBTI 예측**: 16가지 성격 유형 분류
- **Big Five 분석**: 5가지 핵심 성격 특성 점수화 (1-10)
- **다국어 지원**: 한국어/영어 완벽 지원
- **실시간 카메라**: 웹캠을 통한 즉시 촬영 및 분석
- **애니메이션 로딩**: 성격 분석 단계별 진행 표시
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
- iOS Safe Area 지원
- 햅틱 피드백

## 🚀 빠른 시작

### 환경 설정
```bash
# 프로젝트 클론
git clone https://github.com/forworldapp/personalitycamera.git
cd personalitycamera

# 의존성 설치
npm install

# 환경변수 설정
echo "GEMINI_API_KEY=your_actual_api_key" > .env
echo "DATABASE_URL=your_database_url" >> .env
```

### 개발 서버 실행
```bash
npm run dev
```

### 모바일 앱 빌드
```bash
# 모든 플랫폼 빌드
./scripts/build-all-platforms.sh all

# Android만
./scripts/build-all-platforms.sh android

# iOS만 (macOS 필요)
./scripts/build-all-platforms.sh ios
```

## 📱 배포 가이드

### Android (Google Play Store)
1. 가이드 문서: `docs/google-play-release-checklist.md`
2. 빌드 실행: `./scripts/build-all-platforms.sh android`
3. APK 위치: `android/app/build/outputs/apk/`

### iOS (App Store)
1. 가이드 문서: `docs/ios-app-store-guide.md`
2. App Store 최적화: `docs/app-store-optimization.md`
3. Xcode 프로젝트: `ios/App.xcworkspace`

## 💰 수익화 모델

### 무료 버전
- 일일 3회 분석 제한
- 배너 광고 표시

### 프리미엄 구독 ($2.99/월)
- 무제한 분석
- 상세 성격 리포트
- 분석 기록 비교
- 광고 제거

### 예상 수익
- 첫 달: $800 (다운로드 8,000회)
- 6개월: $5,000/월 (구독자 2,000명)

## 🔒 개인정보 보호

- 사진은 분석 후 즉시 삭제
- 개인 식별 정보 수집 안함
- GDPR/CCPA 완전 준수
- 개인정보처리방침: `/privacy-policy`
- 이용약관: `/terms-of-service`

## 📄 포함된 문서

- 📱 `docs/google-play-release-checklist.md` - Android 출시 가이드
- 🍎 `docs/ios-app-store-guide.md` - iOS 출시 가이드
- 📈 `docs/app-store-optimization.md` - ASO 전략
- 🚀 `docs/deployment-guide.md` - 종합 배포 가이드
- ✅ `docs/final-deployment-checklist.md` - 최종 체크리스트

## 🛠 주요 컴포넌트

- `PersonalityCamera` - 카메라 촬영 및 분석
- `PersonalityLoading` - 애니메이션 로딩 진행 표시
- `PersonalityResult` - 분석 결과 표시
- `AdManager` - 광고 시스템 관리
- `SafeArea` - iOS 디바이스 최적화

## 📞 연락처

- 개발자: Personality AI Team
- 이메일: support@personalityai.app
- GitHub: https://github.com/forworldapp/personalitycamera

배포 준비 완료 상태 - 즉시 앱스토어 출시 가능