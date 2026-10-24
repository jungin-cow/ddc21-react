import {
  FaBookOpen,
  FaChurch,
  FaAddressCard,
  FaImage,
  FaBook,
  FaUserFriends,
  FaBookmark,
  FaRegCommentDots,
} from 'react-icons/fa'

const SITE = 'http://ddc21.or.kr'
const page = (id) => `${SITE}/?page_id=${id}`

export const img = (path) => `${import.meta.env.BASE_URL}images/${path}`

export const ABOUT_URL = page(7885)

// 상단 메뉴 (원본 사이트의 menu-new-main-menu)
// to 는 이 앱 안의 페이지, href 는 원본 사이트 등 외부 주소
export const MENU = [
  { label: '홈', to: '/' },
  {
    label: '교회소개',
    href: page(7885),
    children: [
      { label: '비전', href: page(7885) },
      { label: '교역자 소개', href: page(7895) },
      { label: '예배안내', href: page(7783) },
      { label: '오시는 길', href: page(7787) },
      { label: '주보 및 가정예배 순서지', href: page(7913) },
    ],
  },
  { label: '설교', href: page(388) },
  {
    label: '교육부서',
    href: page(609),
    children: [
      { label: '기쁨키즈(유아부)', href: page(609) },
      { label: '드림키즈(유치부)', href: page(1785) },
      { label: 'D포스2(유년부)', href: page(10829) },
      { label: 'D포스1(초등부)', href: page(613) },
      { label: 'DoDream(중∙고등부)', href: page(611) },
      { label: 'D-ecclesia(청년부)', href: page(10714) },
    ],
  },
  {
    label: '양육',
    href: page(7790),
    children: [
      { label: '행동 세미나', href: page(7790) },
      { label: '사역 훈련', href: page(7851) },
    ],
  },
  { label: '선교', href: page(7909) },
  { label: '굿팸', href: page(16) },
  { label: '갤러리', to: '/gallery' },
]

// 노란 바로가기 버튼. mobileOrder 는 원본의 모바일 배치 순서.
export const QUICK_LINKS = [
  { label: '설교', icon: FaBookOpen, href: page(388), mobileOrder: 3 },
  { label: '예배안내', icon: FaChurch, href: page(7783), mobileOrder: 2 },
  { label: '온라인 교인센터', icon: FaAddressCard, href: 'https://mas3.ohjic.com/member/home/ddc21', mobileOrder: 7 },
  { label: '교회사진', icon: FaImage, to: '/gallery', mobileOrder: 4 },
  { label: '주보', icon: FaBook, href: page(7913), mobileOrder: 1 },
  {
    label: '온라인 새가족등록',
    icon: FaUserFriends,
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSdiSWkuCPJBYjEfHP_RAhpQ277omsVrw-BOeLpq-wsHnrJDHw/viewform?usp=sf_link',
    mobileOrder: 5,
  },
  { label: '카카오톡 문의', icon: FaRegCommentDots, href: 'http://pf.kakao.com/_HGxjvxb/chat', mobileOrder: 6 },
  { label: '오시는길', icon: FaBookmark, href: page(7787), mobileOrder: 8 },
]

// 부서/예배 아이콘 카드
export const DEPARTMENTS = [
  { label: '예배실황', icon: 'icon-youtube.png', href: 'https://www.youtube.com/channel/UCIHx0cbc_YdfDPgkF5PNqUA/live' },
  { label: '기쁨키즈(유아부)', icon: 'icon-joy.png', href: page(609) },
  { label: '드림키즈(유치부)', icon: 'icon-dream.png', href: page(1785) },
  { label: '디포스(유년부)', icon: 'icon-dforce2.png', href: page(10829) },
  { label: '선교활동', icon: 'icon-mission.png', href: page(7909) },
  { label: '디포스(초등부)', icon: 'icon-dforce1.png', href: page(613) },
  { label: '두드림(청소년부)', icon: 'icon-dodream.png', href: page(611) },
  { label: '청년부(데클레시아)', icon: 'icon-youth.png', href: page(10714) },
]

export const YOUTUBE_EMBED = 'https://www.youtube.com/embed/iqEurdO2uCs'

export const PHOTO_SLIDES = [1, 2, 3, 4, 5, 6].map((n) => `slides/${n}.jpg`)

export const FOOTER = {
  address: '경기도 화성시 동탄순환대로 12길 37(산척동 834-5번지) 동탄동산교회',
  phone: '0507) 1445 8848',
  fax: '031) 8050 8858',
  copyright: '© Copyright 2016 Dongtandongsan Church | Proudly Designed by GoodBoomSquare All Rights Reserved',
}
