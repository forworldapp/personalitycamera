# iOS App Store 출시 가이드

## 1. Apple 개발자 계정 준비

### A. Apple Developer Program 등록
- **비용**: $99/년 (개인) 또는 $299/년 (기업)
- **등록 절차**: 
  1. Apple ID 생성
  2. Apple Developer 사이트에서 등록
  3. 신원 확인 (최대 48시간 소요)
  4. 결제 완료

### B. 개발 환경 요구사항
- **macOS**: macOS 13.0 이상
- **Xcode**: 15.0 이상
- **iOS Deployment Target**: iOS 13.0 이상
- **Apple Silicon Mac 권장** (빌드 속도 향상)

## 2. iOS 프로젝트 설정

### A. Capacitor iOS 설정 업데이트
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.personalityai.app',
  appName: 'Personality AI',
  webDir: 'dist/public',
  ios: {
    scheme: 'PersonalityAI',
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#8b5cf6'
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT_CONTENT',
      backgroundColor: '#8b5cf6',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'ionic'
    },
    Camera: {
      iosPermissions: {
        cameraDescription: "얼굴 분석을 위해 카메라 접근 권한이 필요합니다."
      }
    }
  }
};
```

### B. Info.plist 권한 설정
```xml
<!-- ios/App/App/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>얼굴 분석을 위해 카메라 접근 권한이 필요합니다.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>사진을 선택하여 성격 분석을 받을 수 있습니다.</string>

<key>CFBundleDisplayName</key>
<string>Personality AI</string>

<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<key>CFBundleVersion</key>
<string>1</string>
```

## 3. App Store Connect 설정

### A. 앱 정보 등록
```
앱 이름: Personality AI
부제목: 얼굴로 보는 성격 분석
SKU: PERSONALITY-AI-001
번들 ID: com.personalityai.app
기본 언어: 한국어
카테고리: 엔터테인먼트
하위 카테고리: 기타
```

### B. 앱 설명 (한국어)
```
🧠 AI가 당신의 얼굴을 분석하여 성격과 MBTI 유형을 예측합니다!

✨ 주요 기능
• Google AI 기반 정확한 얼굴 분석
• MBTI 16가지 유형 예측
• Big Five 성격 특성 분석
• 한국어/영어 결과 제공
• 간편한 카메라 촬영

🎯 완벽한 선택
• 자신의 성격 유형이 궁금한 분
• MBTI 테스트에 관심 있는 분
• 재미있는 AI 분석을 경험하고 싶은 분

⚡ 특별 혜택
• 무료로 하루 3회 분석 가능
• 광고 시청으로 추가 분석 기회
• 즉시 결과 확인

※ 분석 결과는 참고용이며 실제와 다를 수 있습니다.
개인정보는 분석 완료 즉시 안전하게 삭제됩니다.
```

### C. 영어 설명
```
🧠 AI analyzes your face to predict personality and MBTI type!

✨ Key Features
• Accurate facial analysis powered by Google AI
• Predicts all 16 MBTI personality types
• Big Five personality traits analysis
• Results available in Korean/English
• Easy camera capture interface

🎯 Perfect For
• Those curious about their personality type
• MBTI test enthusiasts
• Anyone wanting to try AI-powered analysis
• Self-discovery and personal growth

⚡ Special Benefits
• 3 free analyses per day
• Watch ads for additional opportunities
• Instant results delivery
• Secure data handling

※ Results are for reference and may differ from reality.
Personal data is securely deleted immediately after analysis.
```

## 4. iOS 스크린샷 요구사항

### A. 필수 스크린샷 크기
- **6.7" Display (iPhone 14 Pro Max)**: 1290 x 2796 pixels
- **6.5" Display (iPhone 11 Pro Max)**: 1242 x 2688 pixels
- **5.5" Display (iPhone 8 Plus)**: 1242 x 2208 pixels

### B. 권장 스크린샷 순서
1. **메인 화면**: 카메라 준비 상태
2. **얼굴 감지**: 촬영 가이드라인 표시
3. **분석 진행**: AI 분석 중 화면
4. **MBTI 결과**: 성격 유형 결과
5. **상세 분석**: Big Five 특성 그래프
6. **언어 선택**: 한영 전환 기능
7. **기록 보기**: 분석 히스토리
8. **광고 화면**: 추가 분석 기회

## 5. 앱 아이콘 및 에셋

### A. 앱 아이콘 크기 (iOS)
```
1024 x 1024 (App Store)
180 x 180 (iPhone @3x)
120 x 120 (iPhone @2x)
167 x 167 (iPad Pro @2x)
152 x 152 (iPad @2x)
76 x 76 (iPad @1x)
```

### B. 스플래시 스크린
```xml
<!-- ios/App/App/Assets.xcassets/Splash.imageset/ -->
splash-1x.png (1x) - 1024 x 1024
splash-2x.png (2x) - 2048 x 2048
splash-3x.png (3x) - 3072 x 3072
```

## 6. 프라이버시 및 데이터 사용

### A. 앱 개인정보 보고서
```
데이터 수집:
- 연락처 정보: 이메일 (계정 관리)
- 사용자 콘텐츠: 사진 (분석 목적, 즉시 삭제)
- 사용 데이터: 앱 사용 통계

데이터 용도:
- 앱 기능: 성격 분석 서비스 제공
- 분석: 서비스 개선 및 성능 측정
- 개발자 광고: 맞춤형 광고 표시

제3자 데이터:
- Google (AI 분석): 얼굴 이미지 처리
- AdMob (광고): 광고 맞춤화
```

### B. 추적 투명성 프레임워크
```xml
<!-- ios/App/App/Info.plist -->
<key>NSUserTrackingUsageDescription</key>
<string>맞춤형 광고를 제공하기 위해 앱 활동 추적을 허용해주세요.</string>
```

## 7. TestFlight 베타 테스트

### A. 내부 테스터 그룹
- 개발팀 및 가족/친구 (최대 100명)
- 즉시 빌드 접근 가능
- 90일간 테스트 가능

### B. 외부 테스터 그룹
- 공개 링크 또는 이메일 초대
- Apple 검토 필요
- 최대 10,000명 테스터

### C. 베타 테스트 계획
```
Week 1: 내부 테스터 (20명)
- 기본 기능 테스트
- 버그 신고 및 수정

Week 2: 외부 베타 (100명)
- 사용자 경험 피드백
- 성능 및 안정성 확인

Week 3: 최종 빌드
- 모든 피드백 반영
- App Store 제출 준비
```

## 8. 심사 가이드라인 준수

### A. 앱 스토어 심사 가이드라인
- **2.1**: 앱 완전성 - 모든 기능 정상 작동
- **2.3**: 정확한 메타데이터 - 설명과 실제 기능 일치
- **3.1**: 결제 - IAP 사용 시 Apple 결제 시스템 필수
- **5.1**: 개인정보 - 명확한 개인정보 처리방침

### B. 광고 정책 준수
- 아동 대상 광고 금지
- 적절한 광고 배치
- 사용자 추적 권한 요청
- 광고 식별자(IDFA) 적절한 사용

## 9. 빌드 및 제출 과정

### A. Xcode에서 아카이브 생성
```bash
# Capacitor 동기화
npx cap sync ios

# Xcode에서 열기
npx cap open ios

# Xcode 내에서:
# 1. Product > Archive
# 2. Distribute App
# 3. App Store Connect
# 4. Upload
```

### B. App Store Connect에서 앱 정보 완성
1. 스크린샷 업로드
2. 앱 설명 입력
3. 키워드 설정 (최대 100자)
4. 지원 URL 및 연락처
5. 개인정보 처리방침 URL

### C. 심사 제출
- 심사용 계정 정보 제공
- 특별한 기능 사용법 설명
- 심사 노트 작성

## 10. iOS 특화 기능 최적화

### A. 다크 모드 지원
```css
/* iOS Safari 다크 모드 감지 */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --text: #ffffff;
  }
}
```

### B. Safe Area 대응
```css
/* iOS 노치 대응 */
.header {
  padding-top: env(safe-area-inset-top);
}

.footer {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### C. 햅틱 피드백
```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// 성공 시 햅틱 피드백
await Haptics.impact({ style: ImpactStyle.Light });
```

## 11. 출시 후 관리

### A. 성능 모니터링
- Xcode Organizer 크래시 리포트
- App Store Connect 분석
- 사용자 리뷰 모니터링

### B. 업데이트 계획
```
v1.1 (출시 2주 후): 버그 수정
v1.2 (출시 1개월 후): iOS 18 최적화
v1.3 (출시 2개월 후): Widget 지원
v2.0 (출시 3개월 후): Apple Intelligence 통합
```

## 12. 비용 및 예상 일정

### A. 개발 비용
- Apple Developer Program: $99/년
- Mac 대여/구매: $1000-3000 (필요 시)
- 앱 아이콘 디자인: $100-300
- 총 예상 비용: $1199-3399

### B. 개발 일정
```
Week 1-2: Apple 개발자 계정 및 Mac 환경 설정
Week 3-4: iOS 빌드 및 테스트
Week 5: App Store Connect 설정
Week 6-7: TestFlight 베타 테스트
Week 8: 심사 제출 및 출시
```

### C. 심사 예상 기간
- 첫 번째 제출: 24-48시간
- 거부 시 재제출: 24시간
- 평균 승인률: 85% (첫 번째 제출)

## 출시 체크리스트

### 기술적 준비
- [ ] Apple Developer 계정 등록
- [ ] macOS 개발 환경 구축
- [ ] iOS 프로젝트 빌드 테스트
- [ ] 실제 iOS 기기 테스트
- [ ] 앱 아이콘 및 스크린샷 준비

### App Store Connect
- [ ] 앱 정보 등록 완료
- [ ] 개인정보 보고서 작성
- [ ] 가격 및 배포 설정
- [ ] TestFlight 베타 테스트 완료
- [ ] 심사 제출

### 법적 준비
- [ ] 개인정보 처리방침 iOS 대응
- [ ] 이용약관 업데이트
- [ ] 추적 투명성 정책 준수
- [ ] 아동 보호 정책 확인

Android와 iOS 동시 출시로 더 많은 사용자에게 도달할 수 있으며, 양쪽 플랫폼의 수익을 합쳐 월 $200-800 수준의 수익을 기대할 수 있습니다.