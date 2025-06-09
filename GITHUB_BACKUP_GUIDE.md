# GitHub 백업 가이드

## Replit에서 로컬로 다운로드하기

1. **Replit Shell에서 압축 파일 생성**
```bash
# 프로젝트 루트에서 실행
tar -czf personality-ai.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=*.log \
  client/ server/ shared/ docs/ public/ \
  *.md *.json *.js *.ts backup-to-github.sh .gitignore
```

2. **파일 다운로드**
- Replit Files 패널에서 `personality-ai.tar.gz` 파일을 찾아 다운로드

## 로컬에서 GitHub 업로드하기

1. **압축 해제**
```bash
tar -xzf personality-ai.tar.gz
cd personality-ai
```

2. **의존성 설치 및 확인**
```bash
npm install
npm run build  # 빌드 테스트
```

3. **GitHub 저장소 생성**
- GitHub에서 새 저장소 생성: `personalitycamera`
- README.md 초기화 없이 생성

4. **Git 설정 및 푸시**
```bash
# Git 초기화
git init

# 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Personality AI - 얼굴로 보는 성격 분석"

# 브랜치 설정
git branch -M main

# 원격 저장소 연결
git remote add origin git@github.com:forworldapp/personalitycamera.git

# 푸시
git push -u origin main
```

## 주요 파일 구조

```
personality-ai/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   └── lib/           # 유틸리티
│   └── index.html
├── server/                # Express 백엔드
│   ├── db.ts             # 데이터베이스 설정
│   ├── routes.ts         # API 라우트
│   ├── storage.ts        # 데이터 저장소
│   └── replitAuth.ts     # 인증 시스템
├── shared/               # 공유 타입/스키마
│   └── schema.ts
├── docs/                 # 문서
│   └── android-deployment.md
├── public/               # 정적 파일
│   └── manifest.json     # PWA 설정
├── package.json          # 의존성 설정
├── README.md             # 프로젝트 설명
└── .gitignore           # Git 제외 파일
```

## 환경변수 설정

GitHub에 업로드 후 배포 시 필요한 환경변수:

```env
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_random_string
REPL_ID=your_replit_app_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-app.replit.dev
```

## 배포 옵션

### Vercel (권장)
1. GitHub 저장소를 Vercel에 연결
2. 환경변수 설정
3. 자동 배포

### Netlify
1. GitHub 저장소를 Netlify에 연결
2. Build command: `npm run build`
3. Publish directory: `dist`

### Railway
1. GitHub 저장소를 Railway에 연결
2. PostgreSQL 서비스 추가
3. 환경변수 설정

## 주의사항

- `GEMINI_API_KEY`는 Google AI Studio에서 발급받아야 함
- 데이터베이스는 PostgreSQL 호환 서비스 필요
- Replit 로그인 기능은 다른 인증 시스템으로 교체 필요 (배포 시)
- AdMob 광고는 실제 앱 ID로 교체 필요

## 백업 완료 체크리스트

- [ ] 모든 소스 코드 파일 포함
- [ ] README.md 작성 완료
- [ ] .gitignore 설정
- [ ] package.json 의존성 확인
- [ ] 환경변수 문서화
- [ ] 배포 가이드 작성
- [ ] GitHub 저장소 생성 및 푸시
- [ ] 첫 배포 테스트