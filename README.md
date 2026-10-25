# 동탄동산교회 메인 페이지 (React)

http://ddc21.or.kr/ 메인 화면을 React + Vite로 다시 구현한 것입니다.
원본 미러는 `../ddc21.or.kr/index.html` 에 있습니다.

갤러리는 로컬 MySQL DB(`ddc21_c`, 명세는 `../DDC_DB/`)를 읽는 API 서버(`server/`)에서 데이터를 받습니다.

## 1. DB 준비 (처음 한 번)

`../DDC_DB/DDC_db_schema_mysql8.sql` 은 스키마와 데이터가 모두 들어 있는 덤프입니다.

```bash
# MySQL 관리자 계정으로 덤프 적재 (ddc21_c DB가 만들어짐)
sudo mysql --default-character-set=utf8mb4 < ../DDC_DB/DDC_db_schema_mysql8.sql

# 읽기 전용 계정 만들기 (비밀번호는 원하는 값으로)
sudo mysql -e "CREATE USER 'ddc21'@'localhost' IDENTIFIED BY '비밀번호';
               GRANT SELECT ON ddc21_c.* TO 'ddc21'@'localhost';"

cp .env.example .env   # DB_USER, DB_PASSWORD 등을 채운다
```

## 2. 실행

```bash
npm install
npm run server   # API 서버 (http://localhost:3001/api/v1, 파일 수정 시 자동 재시작)
npm run dev      # 다른 터미널에서. 개발 서버 http://localhost:5173 (/api 는 API 서버로 프록시)
```

배포용은 빌드한 뒤 API 서버 하나만 띄우면 됩니다. 서버가 `dist/`도 같이 내보냅니다.

```bash
npm run build
npm start        # http://localhost:3001 에서 사이트 + API
```

- 갤러리가 API를 써야 하므로 이제는 `dist/index.html`을 삼바(file://)로 바로 열면 갤러리가 "서버에 연결할 수 없습니다"로 나옵니다. 홈 화면은 그대로 열립니다.
- API 서버가 다른 주소에 있다면 `VITE_API_BASE=http://서버:3001/api/v1 npm run build`로 빌드합니다(이 경우 서버에 CORS 설정 추가 필요).

## 구조

- `server/` — API 서버 (express + mysql2). 갤러리 목록·상세 API
- `src/api.js` — API 호출과 `useApi` 훅
- `src/data.js` — 메뉴, 바로가기 버튼, 부서 카드, 푸터 내용 (링크는 원본 사이트로 연결)
- `src/components/` — Header, Hero, QuickLinks, Departments, Media(유튜브 + PhotoSlider), Footer
- `src/index.css` — 전체 스타일 (1024px / 640px 기준 반응형)
- `public/images/` — 원본에서 가져온 로고, 메인 사진, 아이콘, 슬라이드 사진
- `public/fonts/` — 원본 사이트에서 받은 Noto Sans KR, Roboto 웹폰트
