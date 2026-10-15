# 동탄동산교회 메인 페이지 (React)

http://ddc21.or.kr/ 메인 화면을 React + Vite로 다시 구현한 것입니다.
원본 미러는 `../ddc21.or.kr/index.html` 에 있습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173, 다른 PC에서 보려면 npm run dev -- --host)
npm run build    # dist/ 에 결과물 생성
```

## 결과물 (dist/)

- `dist/index.html` 하나에 JS와 CSS가 모두 들어 있습니다 (vite-plugin-singlefile).
- 그림(`images/`)과 폰트(`fonts/`)는 상대 경로로 불러옵니다.
- 그래서 웹 서버 없이 윈도우 삼바에서 `dist/index.html` 을 바로 열어도 동작합니다.
  `dist` 폴더를 통째로 옮겨야 합니다.

## 구조

- `src/data.js` — 메뉴, 바로가기 버튼, 부서 카드, 푸터 내용 (링크는 원본 사이트로 연결)
- `src/components/` — Header, Hero, QuickLinks, Departments, Media(유튜브 + PhotoSlider), Footer
- `src/index.css` — 전체 스타일 (1024px / 640px 기준 반응형)
- `public/images/` — 원본에서 가져온 로고, 메인 사진, 아이콘, 슬라이드 사진
- `public/fonts/` — 원본 사이트에서 받은 Noto Sans KR, Roboto 웹폰트
