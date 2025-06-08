# Android 배포 가이드 - Personality AI

## 개요
이 앱은 PWA(Progressive Web App)로 구현되어 웹과 안드로이드 모두에서 사용 가능합니다.

## 안드로이드 배포 옵션

### 1. PWA를 Android 앱으로 변환 (권장)
- **TWA (Trusted Web Activity)** 사용
- Google Play Console에 직접 업로드 가능
- 네이티브 앱과 동일한 사용자 경험

### 2. Capacitor를 사용한 하이브리드 앱
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Personality AI" "com.personalityai.app"
npx cap add android
npx cap sync
npx cap open android
```

## AdMob 통합 설정

### Android용 AdMob SDK 설정
```javascript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.personalityai.app',
  appName: 'Personality AI',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-YOUR_ADMOB_APP_ID~YOUR_APP_ID',
      testDeviceIds: ['YOUR_TEST_DEVICE_ID'],
    },
  },
};

export default config;
```

### 광고 단위 ID 설정
```javascript
// src/config/admob.ts
export const AdMobConfig = {
  android: {
    bannerAdUnitId: 'ca-app-pub-YOUR_ID/BANNER_AD_UNIT',
    interstitialAdUnitId: 'ca-app-pub-YOUR_ID/INTERSTITIAL_AD_UNIT',
    rewardedAdUnitId: 'ca-app-pub-YOUR_ID/REWARDED_AD_UNIT',
  },
  ios: {
    bannerAdUnitId: 'ca-app-pub-YOUR_ID/IOS_BANNER_AD_UNIT',
    interstitialAdUnitId: 'ca-app-pub-YOUR_ID/IOS_INTERSTITIAL_AD_UNIT',
    rewardedAdUnitId: 'ca-app-pub-YOUR_ID/IOS_REWARDED_AD_UNIT',
  },
  test: {
    bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',
  }
};
```

## 수익화 전략

### 1. 광고 배치 최적화
- **배너 광고**: 상단/하단 고정 배치
- **전면 광고**: 분석 완료 후 2회마다 표시
- **보상형 광고**: 일일 분석 제한 해제

### 2. 프리미엄 기능
- 무제한 분석 (월 구독)
- 광고 제거 옵션
- 상세 성격 리포트 제공

### 3. 예상 수익 구조
- 무료 사용자: 하루 3회 분석 + 광고
- 보상형 광고로 추가 분석 가능
- 프리미엄 구독: 월 $2.99

## Google Play Console 업로드 준비

### 1. 앱 정보
```
앱 이름: Personality AI - 얼굴로 보는 성격 분석
패키지명: com.personalityai.app
카테고리: 엔터테인먼트 > 개인화
연령 등급: 전체 이용가 (3+)
```

### 2. 스크린샷 요구사항
- 최소 2개, 최대 8개 스크린샷
- 크기: 16:9 또는 9:16 비율
- 해상도: 1080p 이상

### 3. 개인정보 처리방침
```
수집 데이터:
- 얼굴 사진 (일시적, 분석 후 삭제)
- 사용자 계정 정보 (이메일)
- 분석 결과 저장

데이터 사용 목적:
- 성격 분석 서비스 제공
- 사용자 경험 개선
- 광고 표시 (익명화된 데이터)
```

## 배포 체크리스트

### 기술적 준비
- [ ] PWA manifest.json 설정 완료
- [ ] Service Worker 구현
- [ ] 앱 아이콘 준비 (192x192, 512x512)
- [ ] AdMob 계정 및 광고 단위 생성
- [ ] Google Play Console 개발자 계정

### 법적 준비
- [ ] 개인정보 처리방침 작성
- [ ] 이용약관 작성
- [ ] 광고 정책 준수 확인
- [ ] 연령 등급 심사 준비

### 마케팅 준비
- [ ] 앱 설명 작성 (한국어/영어)
- [ ] 키워드 최적화
- [ ] 스크린샷 및 홍보 이미지 제작
- [ ] 출시 전 베타 테스트

## 예상 일정
1. **Week 1**: AdMob 통합 및 테스트
2. **Week 2**: Android 빌드 및 최적화
3. **Week 3**: Google Play Console 준비
4. **Week 4**: 심사 제출 및 출시

## 참고사항
- Google Play 심사는 보통 1-3일 소요
- AdMob 승인은 앱 출시 후 필요
- 초기 다운로드 목표: 1,000회/월
- 예상 수익: $100-500/월 (광고 + 구독)