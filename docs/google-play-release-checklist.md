# Google Play Store 출시 체크리스트

## 1. 기술적 준비사항

### A. PWA to Android 변환
```bash
# Capacitor 설치 및 설정
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Personality AI" "com.personalityai.app"
npx cap add android
```

### B. 앱 아이콘 및 스플래시 생성
- **앱 아이콘**: 1024x1024 PNG (고해상도)
- **적응형 아이콘**: 108x108dp foreground, 108x108dp background
- **스플래시 스크린**: 다양한 해상도 (1080x1920, 1440x2560 등)

### C. Android Manifest 설정
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## 2. AdMob 광고 설정

### A. Google AdMob 계정 생성
1. Google AdMob 계정 생성
2. 새 앱 추가 ("Personality AI")
3. 광고 단위 생성:
   - 배너 광고 단위
   - 전면 광고 단위
   - 보상형 동영상 광고 단위

### B. 앱 ID 및 광고 단위 ID 획득
```javascript
// Android AdMob IDs
const ADMOB_CONFIG = {
  appId: "ca-app-pub-xxxxxxxx~xxxxxxxxx",
  bannerAdUnitId: "ca-app-pub-xxxxxxxx/xxxxxxxxx",
  interstitialAdUnitId: "ca-app-pub-xxxxxxxx/xxxxxxxxx", 
  rewardedAdUnitId: "ca-app-pub-xxxxxxxx/xxxxxxxxx"
};
```

## 3. Google Play Console 준비

### A. 개발자 계정 설정
- **비용**: $25 (평생 등록비)
- **개발자 이름**: 개인 또는 회사명
- **연락처 정보**: 실제 연락 가능한 정보

### B. 앱 정보 입력
```
앱 이름: Personality AI - 얼굴로 보는 성격 분석
패키지명: com.personalityai.app
카테고리: 엔터테인먼트 > 개인화
대상 연령: 전체 이용가 (3+)
콘텐츠 등급: Everyone
```

## 4. 필수 문서 작성

### A. 개인정보 처리방침
```markdown
# 개인정보 처리방침

## 수집하는 정보
- 얼굴 사진 (분석 목적, 분석 후 즉시 삭제)
- 사용자 계정 정보 (이메일, 이름)
- 분석 결과 데이터

## 정보 사용 목적
- 성격 분석 서비스 제공
- 사용자 경험 개선
- 통계 분석 (익명화)

## 데이터 보관 및 삭제
- 얼굴 사진: 분석 즉시 삭제
- 분석 결과: 사용자 요청 시 삭제
- 계정 정보: 계정 삭제 시 완전 삭제
```

### B. 이용약관
```markdown
# 이용약관

## 서비스 이용
- 만 13세 이상 이용 가능
- 부적절한 사진 업로드 금지
- 분석 결과는 참고용으로만 사용

## 서비스 제한
- 일일 무료 분석 3회 제한
- 광고 시청으로 추가 분석 가능
- 서비스 남용 시 이용 제한 가능
```

## 5. 스크린샷 및 홍보 자료

### A. 스크린샷 요구사항
- **개수**: 최소 2개, 최대 8개
- **크기**: 16:9 또는 9:16 비율
- **해상도**: 최소 1080p
- **내용**: 주요 기능별 화면

### B. 필요한 스크린샷
1. 메인 화면 (카메라 준비)
2. 얼굴 촬영 화면
3. 분석 중 화면
4. 결과 화면 (MBTI + 특성)
5. 한영 언어 전환 화면
6. 광고 화면 (선택사항)

## 6. 앱 설명 작성

### A. 한국어 설명
```
🧠 Personality AI - 얼굴로 보는 성격 분석

AI가 당신의 얼굴을 분석하여 성격과 MBTI 유형을 예측합니다!

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

### B. 영어 설명
```
🧠 Personality AI - Face-Based Personality Analysis

AI analyzes your face to predict personality and MBTI type!

✨ Key Features
• Accurate facial analysis powered by Google AI
• Predicts all 16 MBTI types
• Big Five personality traits analysis
• Results in Korean/English
• Easy camera capture

🎯 Perfect for
• Those curious about their personality type
• MBTI enthusiasts
• Anyone wanting to try AI analysis

⚡ 3 free analyses per day
Watch ads for additional analysis opportunities!

※ Results are for reference and may differ from reality.
```

## 7. 콘텐츠 등급 및 심사 준비

### A. 콘텐츠 등급 설문
- **폭력성**: 없음
- **성적 콘텐츠**: 없음
- **욕설**: 없음
- **도박**: 없음
- **약물/알코올**: 없음
- **광고**: 포함됨 (배너, 전면, 보상형)

### B. 앱 액세스 권한 설명
```
카메라 권한: 얼굴 사진 촬영을 위해 필요
인터넷 권한: AI 분석 서비스 이용을 위해 필요
네트워크 상태: 연결 상태 확인을 위해 필요
```

## 8. 테스트 및 품질 관리

### A. 내부 테스트
- 다양한 Android 기기에서 테스트
- 네트워크 상태별 테스트 (WiFi, 4G, 약한 신호)
- 권한 거부 시나리오 테스트
- 광고 로딩 실패 시나리오 테스트

### B. 베타 테스트 (선택사항)
- 친구/가족 대상 클로즈드 베타
- Google Play Console 내부 테스트 트랙 활용
- 피드백 수집 및 버그 수정

## 9. 출시 전 최종 체크리스트

### 기술적 요소
- [ ] APK/AAB 파일 생성 및 서명
- [ ] 앱 버전 코드 설정 (예: 1.0.0)
- [ ] ProGuard/R8 난독화 적용
- [ ] 64비트 아키텍처 지원
- [ ] 앱 크기 최적화 (<50MB 권장)

### 콘텐츠 요소
- [ ] 앱 아이콘 및 스크린샷 업로드
- [ ] 앱 설명 한영 작성 완료
- [ ] 개인정보 처리방침 링크 설정
- [ ] 이용약관 링크 설정
- [ ] 연락처 정보 입력

### 법적 요소
- [ ] 개발자 계정 등록 완료
- [ ] 앱 서명 키 안전 보관
- [ ] 개인정보 처리방침 웹페이지 공개
- [ ] 이용약관 웹페이지 공개

## 10. 출시 후 관리

### A. 모니터링
- 다운로드 수 및 평점 추적
- 크래시 리포트 확인
- 사용자 리뷰 모니터링
- AdMob 수익 분석

### B. 업데이트 계획
- 버그 수정 업데이트
- 새로운 기능 추가
- UI/UX 개선
- 광고 최적화

## 예상 일정

**Week 1-2**: 기술적 준비 (PWA → Android 변환, AdMob 통합)
**Week 3**: 문서 작성 (개인정보처리방침, 이용약관)
**Week 4**: Google Play Console 설정 및 자료 준비
**Week 5**: 내부 테스트 및 버그 수정
**Week 6**: 심사 제출 및 출시

## 예상 비용

- Google Play Console 등록: $25
- 앱 아이콘/그래픽 디자인: $50-200 (외주 시)
- 개인정보처리방침 법적 검토: $100-500 (선택사항)
- 총 예상 비용: $175-725