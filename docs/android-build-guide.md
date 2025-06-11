# Android 빌드 및 Google Play Store 출시 가이드

## 1. 로컬 환경 설정 (개발 PC에서 진행)

### A. 필수 소프트웨어 설치
```bash
# Android Studio 설치 (공식 사이트에서 다운로드)
# Java 17 설치
sudo apt install openjdk-17-jdk  # Ubuntu/Debian
brew install openjdk@17         # macOS

# 환경변수 설정
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### B. 프로젝트 클론 및 의존성 설치
```bash
git clone https://github.com/forworldapp/personalitycamera.git
cd personalitycamera
npm install
```

## 2. Android 프로젝트 빌드

### A. 웹 앱 빌드
```bash
npm run build
```

### B. Capacitor 동기화
```bash
npx cap sync android
```

### C. 디버그 APK 생성
```bash
cd android
./gradlew assembleDebug
```
생성된 파일: `android/app/build/outputs/apk/debug/app-debug.apk`

### D. 릴리즈 APK 생성 (서명 필요)
```bash
./gradlew assembleRelease
```

## 3. 앱 서명 설정

### A. 키스토어 생성
```bash
keytool -genkey -v -keystore personality-ai-release-key.keystore \
  -alias personality-ai -keyalg RSA -keysize 2048 -validity 10000
```

### B. Gradle 서명 설정
`android/app/build.gradle`에 추가:
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### C. 환경변수 설정
`android/gradle.properties`에 추가:
```
MYAPP_RELEASE_STORE_FILE=../personality-ai-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=personality-ai
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

## 4. Google Play Console 설정

### A. 개발자 계정 생성
1. Google Play Console 접속 (play.google.com/console)
2. 개발자 등록 ($25 결제)
3. 개발자 프로필 작성

### B. 새 앱 생성
```
앱 이름: Personality AI - 얼굴로 보는 성격 분석
기본 언어: 한국어
앱 유형: 앱
무료 또는 유료: 무료
```

### C. 앱 정보 입력
1. **스토어 설정**
   - 앱 카테고리: 엔터테인먼트
   - 태그: 개인화, AI, MBTI, 성격분석

2. **개인정보처리방침**
   - URL: https://your-domain.com/privacy-policy.html

3. **앱 액세스 권한**
   - 카메라: 얼굴 촬영을 위해 필요
   - 인터넷: AI 분석 서비스 이용

## 5. 스토어 등록정보 작성

### A. 앱 설명 (한국어)
```
🧠 AI가 당신의 얼굴을 분석하여 성격과 MBTI 유형을 예측합니다!

✨ 주요 기능
• Google AI 기반 정확한 얼굴 분석
• MBTI 16가지 유형 예측  
• Big Five 성격 특성 분석
• 한국어/영어 결과 제공
• 간편한 카메라 촬영

🎯 이런 분들께 추천
• 자신의 성격 유형이 궁금한 분
• MBTI에 관심 있는 분
• 재미있는 AI 분석을 경험하고 싶은 분

⚡ 무료로 하루 3회 분석 가능
광고 시청으로 추가 분석 기회를 얻으세요!

※ 분석 결과는 참고용이며 실제와 다를 수 있습니다.
```

### B. 짧은 설명
```
AI 얼굴 분석으로 성격과 MBTI 유형을 예측하는 재미있는 앱
```

### C. 스크린샷 요구사항
- 최소 2개, 최대 8개
- 16:9 또는 9:16 비율
- 최소 1080p 해상도

필요한 스크린샷:
1. 메인 화면 (카메라 준비)
2. 얼굴 촬영 화면
3. 분석 중 화면
4. MBTI 결과 화면
5. 성격 특성 결과 화면
6. 언어 전환 화면

## 6. 콘텐츠 등급 설정

### A. 타겟 연령대
- 모든 연령대 (3+)

### B. 콘텐츠 설문
```
폭력적 또는 피비린내 나는 콘텐츠: 없음
성적 콘텐츠: 없음
욕설: 없음
약물 사용: 없음
도박: 없음
광고: 있음 (배너, 전면, 보상형)
```

## 7. 테스트 및 검토

### A. 내부 테스트
1. 내부 테스트 트랙 생성
2. AAB 파일 업로드
3. 테스터 그룹 추가
4. 피드백 수집

### B. 프로덕션 출시 준비
1. 출시 세부정보 작성
2. 국가/지역 선택
3. 출시 일정 설정

## 8. AAB (Android App Bundle) 생성

### A. AAB 빌드
```bash
cd android
./gradlew bundleRelease
```
생성된 파일: `android/app/build/outputs/bundle/release/app-release.aab`

### B. AAB 업로드
1. Google Play Console에서 AAB 파일 업로드
2. 출시 노트 작성
3. 심사 제출

## 9. 출시 후 관리

### A. 모니터링 도구
- Google Play Console 통계
- Firebase Analytics (선택사항)
- Crashlytics (선택사항)

### B. 업데이트 계획
```
버전 1.1.0: 버그 수정 및 성능 개선
버전 1.2.0: 새로운 성격 분석 기능 추가
버전 1.3.0: UI/UX 개선
```

## 10. 마케팅 및 ASO

### A. 키워드 최적화
```
주요 키워드:
- 성격 분석
- MBTI 테스트
- 얼굴 분석
- AI 분석
- 성격 유형
- 심리 테스트
```

### B. 홍보 전략
1. 소셜 미디어 홍보
2. 블로그 포스팅
3. 앱 리뷰 사이트 등록
4. 인플루언서 협업

## 예상 일정 및 비용

### 일정
- Week 1-2: 로컬 환경 설정 및 빌드
- Week 3: Google Play Console 설정
- Week 4: 스토어 등록정보 작성
- Week 5: 내부 테스트
- Week 6: 프로덕션 출시

### 비용
- Google Play Console 등록: $25
- 앱 아이콘/스크린샷 디자인: $100-300 (외주 시)
- 총 예상 비용: $125-325

## 체크리스트

### 기술적 준비
- [ ] Android Studio 설치
- [ ] Java 17 설치
- [ ] Capacitor 프로젝트 설정
- [ ] APK/AAB 빌드 성공
- [ ] 앱 서명 설정

### 스토어 준비
- [ ] Google Play Console 개발자 계정
- [ ] 앱 정보 입력 완료
- [ ] 스크린샷 8개 준비
- [ ] 개인정보처리방침 웹페이지
- [ ] 이용약관 웹페이지

### 법적 준비
- [ ] 콘텐츠 등급 설정
- [ ] 앱 권한 설명
- [ ] 개인정보 수집 항목 명시
- [ ] 광고 정책 준수 확인

출시 준비가 완료되면 Google Play Store 심사는 보통 1-3일 소요됩니다.