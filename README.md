# Personality AI - 얼굴로 보는 성격 분석

Google Gemini AI를 사용하여 얼굴 사진을 분석하고 성격과 MBTI 유형을 예측하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **AI 얼굴 분석**: Google Gemini Vision API로 얼굴 특징 분석
- **MBTI 예측**: 16가지 성격 유형 분류
- **Big Five 분석**: 개방성, 성실성, 외향성, 친화성, 신경성 점수 (1-10)
- **이중 언어**: 한국어/영어 결과 제공
- **실시간 카메라**: 웹캠으로 즉시 촬영 및 분석
- **모바일 최적화**: 반응형 디자인
- **수익화 시스템**: 광고 및 사용량 제한

## 🛠 기술 스택

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Wouter (라우팅)
- TanStack Query (상태 관리)
- Vite (빌드 도구)

### Backend
- Express.js
- Drizzle ORM
- PostgreSQL
- Multer (파일 업로드)
- Express Session

### AI & APIs
- Google Gemini Vision API
- Replit OpenID Connect

## 📱 수익화 모델

- **무료 사용자**: 하루 3회 분석 + 광고
- **보상형 광고**: 추가 분석 기회 제공
- **프리미엄 구독**: 무제한 분석 + 광고 제거
- **AdMob 통합**: 배너, 전면, 보상형 광고

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/forworldapp/personalitycamera.git
cd personalitycamera
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
# .env 파일 생성
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
```

### 4. 데이터베이스 설정
```bash
npm run db:push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

## 📊 데이터베이스 스키마

### Users 테이블
- `id`: 사용자 고유 ID
- `email`: 이메일 주소
- `firstName`, `lastName`: 이름
- `profileImageUrl`: 프로필 이미지

### Personality Analysis 테이블
- `id`: 분석 고유 ID
- `userId`: 사용자 ID (외래키)
- `mbtiType`: MBTI 유형 (예: ISTJ)
- `confidence`: 신뢰도 (low/medium/high)
- `traits`: Big Five 점수 (JSON)
- `analysis`: 분석 결과 (한/영)
- `strengths`: 강점 (한/영)
- `weaknesses`: 약점 (한/영)
- `recommendations`: 추천사항 (한/영)

## 🎨 UI/UX 특징

- **모바일 퍼스트**: 스마트폰 최적화 디자인
- **다크 모드**: 시스템 테마 자동 감지
- **애니메이션**: Framer Motion을 활용한 부드러운 전환
- **접근성**: ARIA 라벨 및 키보드 네비게이션 지원

## 📈 성능 최적화

- **이미지 압축**: Canvas API로 업로드 전 최적화
- **지연 로딩**: 컴포넌트별 코드 스플리팅
- **캐싱**: TanStack Query로 API 응답 캐싱
- **PWA**: 오프라인 지원 및 앱 설치 가능

## 🔒 보안 및 프라이버시

- **데이터 보호**: 분석 후 이미지 즉시 삭제
- **세션 관리**: 안전한 세션 저장소 사용
- **CORS 설정**: 허용된 도메인만 접근 가능
- **입력 검증**: Zod를 통한 데이터 유효성 검사

## 📱 Android 앱 배포

### PWA to Android
```bash
# Capacitor 설치
npm install @capacitor/core @capacitor/cli
npx cap init "Personality AI" "com.personalityai.app"
npx cap add android
```

### AdMob 설정
- Google AdMob 계정 생성
- 광고 단위 ID 설정
- `docs/android-deployment.md` 참조

## 🚀 배포 옵션

### Vercel (권장)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# dist 폴더를 Netlify에 업로드
```

### Railway
```bash
# railway.json 설정 파일 사용
railway up
```

## 📝 API 엔드포인트

### 인증
- `GET /api/auth/user` - 현재 사용자 정보
- `GET /api/login` - 로그인 시작
- `GET /api/logout` - 로그아웃

### 성격 분석
- `POST /api/analyze-personality` - 얼굴 이미지 분석
- `GET /api/personality-history` - 분석 기록 조회

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

- **이메일**: support@personalityai.app
- **GitHub**: https://github.com/forworldapp/personalitycamera
- **웹사이트**: https://personalityai.app

## 🙏 감사의 말

- Google Gemini AI 팀
- Replit 플랫폼
- shadcn/ui 컴포넌트 라이브러리
- 오픈소스 커뮤니티