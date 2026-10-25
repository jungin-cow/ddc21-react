# 소스코드 구조

React 프로젝트는 "내용 데이터"와 "화면 조각"을 나눈 구조입니다.
문구와 링크는 `src/data.js` 한 곳에 모여 있고, 화면 조각(컴포넌트)은 그 데이터를 받아 그리기만 합니다.

## 폴더 구조

```
react-app/
├── index.html          ← 페이지 뼈대 (제목, 폰트 CSS 연결, #root)
├── vite.config.js      ← 빌드 설정, 개발 중 /api 프록시
├── .env.example        ← API 서버의 DB 접속 정보 예시 (.env 로 복사)
├── server/             ← API 서버 (MySQL ddc21_c 조회)
├── package.json        ← 의존성: react, react-icons, vite-plugin-singlefile
├── public/             ← 가공 없이 그대로 복사되는 파일
│   ├── favicon.png
│   ├── images/         ← 로고, 메인 사진, 아이콘 8개, slides/1~6.jpg
│   └── fonts/          ← Noto Sans KR, Roboto (woff2 + fonts.css)
├── src/
│   ├── main.jsx        ← 시작점: <App />을 #root에 그림
│   ├── App.jsx         ← 화면 조각을 위에서 아래 순서로 배치
│   ├── data.js         ← 메뉴, 버튼, 카드, 푸터 내용 (여기만 고치면 내용 변경)
│   ├── index.css       ← 전체 스타일 + 반응형
│   └── components/
│       ├── Header.jsx
│       ├── Hero.jsx
│       ├── QuickLinks.jsx
│       ├── Departments.jsx
│       ├── Media.jsx
│       ├── PhotoSlider.jsx
│       └── Footer.jsx
└── dist/               ← npm run build 결과물 (npm start 가 같이 내보냄)
```

## 화면과 컴포넌트 대응

`App.jsx`가 컴포넌트를 아래 순서로 쌓습니다.

| 화면 영역 | 컴포넌트 | 하는 일 |
|---|---|---|
| 로고 · 환영 문구 · 메뉴 | `Header` | PC에서는 마우스를 올리면 하위 메뉴가 펼쳐지고, 모바일에서는 햄버거 버튼으로 메뉴를 엽니다 |
| 큰 건물 사진 + 문구 | `Hero` | 배경 사진, 흰 로고, 4줄 문구, 영문 교회명과 밑줄이 차례로 나타납니다 |
| 노란 버튼 8개 | `QuickLinks` | 아이콘과 이름이 있는 바로가기 버튼입니다 |
| 회색 카드 8개 | `Departments` | 예배실황과 각 부서로 가는 카드입니다 |
| 유튜브 + 사진 슬라이더 | `Media` → `PhotoSlider` | 왼쪽에 유튜브 영상, 오른쪽에 사진 6장 슬라이더가 있습니다 |
| 주소 · 전화 | `Footer` | 주소, 전화, 팩스, 저작권 문구입니다 |

## 파일별 핵심

### `src/data.js`: 내용을 모은 곳

화면에 나오는 텍스트와 링크는 모두 여기 있습니다.

- **`MENU`**: 상단 메뉴입니다. `children`이 있는 항목은 하위 메뉴가 생깁니다.
- **`QUICK_LINKS`**: 노란 버튼입니다. `icon`은 react-icons의 Font Awesome 아이콘이고, `mobileOrder`는 원본 사이트의 모바일 배치 순서입니다.
- **`DEPARTMENTS`**: 부서 카드입니다. 아이콘 파일 이름과 링크가 들어 있습니다.
- **`PHOTO_SLIDES`, `YOUTUBE_EMBED`, `FOOTER`**: 슬라이드 사진 목록, 유튜브 주소, 푸터 내용입니다.
- **`img()`**: 그림 경로를 만드는 함수입니다. `./images/...` 같은 상대 경로를 만들어서 `file://`에서도 그림이 열립니다.

예를 들어 버튼을 하나 추가하려면 `QUICK_LINKS`에 항목만 넣으면 되고, 컴포넌트는 고칠 필요가 없습니다.

### `Header.jsx`

- **상태 2개:** `mobileOpen`(모바일 메뉴가 열렸는지)과 `openSub`(모바일에서 펼친 하위 메뉴)를 기억합니다.
- **PC 하위 메뉴:** JS 없이 CSS의 `:hover`와 `:focus-within`만으로 펼쳐집니다.
- **로고:** 큰 로고와 모바일용 작은 로고를 둘 다 넣어 두고, CSS가 화면 폭에 맞는 하나만 보여줍니다.

### `Hero.jsx`

원본 슬라이더는 1920×1080 크기를 기준으로 글자 위치를 픽셀로 정해 둡니다.
이를 `vw` 단위로 바꿨기 때문에 화면 폭이 달라져도 사진과 글자가 같은 비율로 커지고 작아집니다.
원본의 등장 효과는 CSS 애니메이션(`fade-up`, `grow-x`)으로 옮겼습니다.

### `PhotoSlider.jsx`

이 프로젝트에서 동작 로직이 가장 많은 컴포넌트입니다.

- **상태:** `index`(지금 보이는 사진)와 `paused`(마우스를 올려서 멈췄는지)를 기억합니다.
- **자동 넘김:** `useEffect`에서 5초 타이머를 걸고, 사진이 바뀔 때마다 다시 겁니다.
- **수동 넘김:** 화살표, 아래쪽 점 버튼, 손가락으로 넘기기(50px 이상 밀었을 때)로 움직입니다.
- **전환 효과:** 6장을 모두 겹쳐 놓고 `is-active`인 사진만 `opacity: 1`로 보여서 서서히 바뀌게 합니다.
- **진행 막대:** 아래쪽 막대는 사진이 바뀔 때마다 `key`가 바뀌어서 애니메이션이 처음부터 다시 시작됩니다.

### `index.css`

- **색과 간격 변수:** 원본에서 뽑은 색(남색 `#262261`, 노랑 `#ffc75f` 등)과 간격을 맨 위 `:root`에 모았습니다. 색을 바꿀 때는 여기만 고치면 됩니다.
- **반응형 기준:**
  - 1024px 이하: 햄버거 메뉴로 바뀌고, 버튼과 카드가 2열, 영상과 슬라이더가 위아래로 놓입니다.
  - 640px 이하: 버튼과 카드가 1열이 되고, 버튼이 원본의 모바일 순서(`--mobile-order`)대로 놓입니다.
- **움직임 줄이기:** 컴퓨터에 "움직임 줄이기"가 설정된 사용자에게는 애니메이션을 끕니다.

### `vite.config.js`: `file://`로 열리게 하는 설정

- **`base: './'`:** 모든 경로를 상대 경로로 만듭니다.
- **`viteSingleFile`:** JS와 CSS를 `dist/index.html` 안에 넣습니다. 일반 Vite 빌드처럼 JS 파일을 따로 두면 `file://`로 열 때 브라우저 보안 정책 때문에 실행되지 않습니다.
- **그림과 폰트는 `public/`에 둡니다.** 빌드할 때 HTML 안에 넣지 않고 파일로 복사되므로 `index.html`이 커지지 않습니다.

## 자주 할 작업

| 하고 싶은 것 | 고칠 곳 |
|---|---|
| 메뉴, 버튼, 링크, 문구 변경 | `src/data.js` |
| 색, 크기, 간격 변경 | `src/index.css` (맨 위 `:root` 변수부터) |
| 슬라이드 사진 교체 | `public/images/slides/` 파일 교체. 개수가 바뀌면 `data.js`의 `PHOTO_SLIDES`도 수정 |
| 슬라이드 넘김 속도 | `PhotoSlider.jsx`의 `INTERVAL` |
| 새 영역 추가 | `components/`에 파일을 만들고 `App.jsx`에 끼워 넣기 |

수정한 뒤에는 `npm run server` + `npm run dev`로 바로 확인하고, 배포용은 `npm run build` 후 `npm start`로 띄웁니다.

## 페이지 이동과 갤러리

`main.jsx`에서 **HashRouter**(react-router-dom)로 감쌌습니다. 주소가 `index.html#/gallery`처럼 `#` 뒤에 붙기 때문에 `file://`(삼바)로 열어도 페이지 이동이 됩니다.

| 주소 | 페이지 파일 | 내용 |
|---|---|---|
| `#/` | `src/pages/HomePage.jsx` | 메인 화면 (Hero, QuickLinks, Departments, Media) |
| `#/gallery?cat=events&page=2` | `src/pages/GalleryPage.jsx` | 갤러리 목록. 분류 필터와 페이지 번호가 주소에 남아서 뒤로가기가 됩니다 |
| `#/gallery/19647` | `src/pages/GalleryPostPage.jsx` | 게시물 사진 모음. 사진을 누르면 `Lightbox`로 크게 봅니다 |

- **메뉴 링크:** `data.js` 항목에 `to`가 있으면 앱 안 페이지, `href`가 있으면 원본 사이트로 갑니다. `SmartLink` 컴포넌트가 이를 구분합니다.
- **갤러리 데이터:** 로컬 MySQL `ddc21_c`를 API 서버(`server/`)가 읽어서 JSON으로 줍니다. 화면은 `src/api.js`의 `useApi`로 받습니다. 아래 "API 서버"를 보세요.

## API 서버 (`server/`)

DB 명세(`../DDC_DB/DDC_db_design.md`)와 페이지 설계 가이드(`../DDC_DB/DDC_homepage_design_guide.md`)의 `/api/v1` 규칙을 따릅니다.

| 파일 | 하는 일 |
|---|---|
| `server/index.js` | 라우트, 파라미터 검사(400), 오류 형식 `{ error, message }`, `dist/` 내보내기 |
| `server/db.js` | MySQL 연결(.env). DATETIME(UTC)을 KST ISO 문자열로 바꾸는 `toKst` |
| `server/media.js` | 객체 키 → 이미지 URL, `media` + `media_variants` → 미디어 객체 |

| API | 화면 |
|---|---|
| `GET /api/v1/boards?type=gallery` | 갤러리 부서 탭 (공개 글이 있는 게시판만, `sort_order` 순) |
| `GET /api/v1/galleries/posts?page=&size=` | 갤러리 전체 목록 (8개 게시판 합쳐서 최신순) |
| `GET /api/v1/galleries/{slug}/posts?page=&size=` | 부서별 목록. 대표 사진(small), 사진 수 |
| `GET /api/v1/posts/{id}` | 상세. 사진(small/medium/large), 본문, 태그, 같은 게시판의 이전/다음 글 |

- 공개 글(`status='publish'`)만 조회합니다. `size`는 최대 48입니다.
- 사진 목록은 `post_media`의 `gallery` → `attachment` 순입니다. `inline`은 본문에 이미 있어서 뺍니다. HEIC와 pptx도 브라우저에서 보여줄 수 없어서 뺍니다. mp4는 영상으로 내려줍니다.
- **한글 파일명 주의:** DB 키는 NFC인데, GCS에는 NFD(자모 분리)로 올라간 파일과 NFC인 파일이 섞여 있습니다. 그래서 서버가 시작할 때 버킷의 객체 목록(약 9.5만 개, 10초 정도)을 받아 "NFC 키 → 실제 이름" 표를 만듭니다. 목록은 `server/.cache/gcs-objects.json`에 하루 동안 캐시되고, `npm run media:refresh`로 바로 새로 받을 수 있습니다.
- 그래도 GCS에 아예 없는 파일이 있습니다(갤러리 대표 사진 707장 중 11장). 화면은 "사진 없음"으로 표시합니다.

## 갤러리 화면

| 주소 | 페이지 파일 | 내용 |
|---|---|---|
| `#/gallery` | `GalleryPage.jsx` | 전체 갤러리. 부서 탭, 카드(대표 사진 · 제목 · 부서 · 날짜 · 사진 수), 페이지당 12개 |
| `#/gallery/happykids?page=2` | `GalleryPage.jsx` | 부서별 목록. 페이지 번호가 주소에 남아서 뒤로가기가 됩니다 |
| `#/gallery/happykids/19574` | `GalleryPostPage.jsx` | 상세. 본문(`PostBody`, DOMPurify로 sanitize) → 사진 그리드(small) → `Lightbox`(large, 영상은 `<video>`) → 이전/다음 글 |

- 불러오는 동안에는 스켈레톤을 보여주고, 실패하면 `LoadError`에 "다시 시도" 버튼을 띄웁니다. 사진을 못 불러오면 `MediaImage`가 "사진 없음"으로 바꿉니다.
- 상세 주소의 게시판이 실제 게시판과 다르면 맞는 주소로 바꿉니다.
