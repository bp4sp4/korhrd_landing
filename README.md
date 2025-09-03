# Eduvisors Landing Page

교육 상담 서비스를 위한 랜딩 페이지입니다.

## 주요 기능

- 🎯 교육 상담 신청 폼
- 📊 실시간 통계 표시
- 🔐 Supabase Authentication 기반 어드민 페이지
- 📱 반응형 디자인
- 🎨 CSS 모듈 기반 스타일링

## 설치 및 실행

1. 의존성 설치

```bash
npm install
```

2. 환경변수 설정
   `.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. 개발 서버 실행

```bash
npm run dev
```

## Supabase 설정

### 1. 테이블 생성

`contact_inquiries` 테이블을 생성하세요:

```sql
CREATE TABLE contact_inquiries (
  id SERIAL PRIMARY KEY,
  desired_course TEXT NOT NULL,
  education TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. RLS 정책 설정

```sql
-- 모든 사용자가 읽기 가능
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 익명 사용자가 데이터 삽입 가능
CREATE POLICY "Allow anonymous insert" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- 인증된 사용자가 모든 데이터 읽기 가능
CREATE POLICY "Allow authenticated read" ON contact_inquiries
  FOR SELECT USING (true);
```

### 3. Authentication 설정

Supabase Dashboard에서 다음을 설정하세요:

1. **Authentication > Settings**에서 이메일 확인 비활성화 (선택사항)
2. **Authentication > Users**에서 새 사용자 추가:
   - 이메일: `admin@eduvisors.com` (원하는 이메일)
   - 비밀번호: 안전한 비밀번호 설정
3. **Authentication > Policies**에서 RLS 정책 확인

## 어드민 페이지

- URL: `/admin`
- **Supabase Authentication 사용**
- 이메일과 비밀번호로 로그인
- 자동 로그인 상태 유지

## 폼 필드

- **희망과정**: 학점은행제, 자격증과정, 진로상담, 기타
- **최종학력**: 고등학교 졸업, 대학교 졸업, 대학원 졸업, 기타
- **이름**: 필수 입력
- **연락처**: 필수 입력
- **특이사항**: 선택 입력
- **개인정보 동의**: 필수 체크

## 파일 구조

```
src/
├── app/
│   ├── admin/           # 어드민 페이지
│   ├── components/      # 재사용 컴포넌트
│   │   └── ContactForm.tsx
│   ├── page.tsx         # 메인 페이지
│   └── page.module.css  # 메인 페이지 스타일
├── lib/
│   └── supabase.ts      # Supabase 클라이언트
└── ...
```

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: CSS Modules
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (권장)

## 보안 기능

- Supabase Authentication으로 안전한 로그인
- RLS 정책으로 데이터 접근 제어
- 개인정보 동의 필수 체크
- 폼 제출 시 동의 여부 검증

## 주의사항

- 환경변수는 절대 공개 저장소에 커밋하지 마세요
- 개인정보 처리에 관련된 법적 요구사항을 준수하세요
- 실제 프로덕션에서는 강력한 비밀번호를 사용하세요
- 정기적으로 비밀번호를 변경하세요
