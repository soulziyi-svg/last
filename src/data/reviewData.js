import { asset } from '../utils/asset';

const P = asset('/img/콘텐츠1/전통한복/컨텐츠1/상품');

const REVIEW_PHOTOS = Array.from(
  { length: 12 },
  (_, index) => asset(`/img/reviews/review-${String(index + 1).padStart(2, '0')}.png`)
);

const BASE_REVIEWS = [
  {
    id: 1,
    photo: `${P}/평상복/달빛하얀소복/달빛하얀소복02.png`,
    nickname: '장철희',
    date: '2026.07.15',
    rating: 5,
    text: '졸업사진 찍으려고 친구 6명이 같이 빌렸어요. 좋은추억 입어보고 갑니다.',
    tags: ['#여행', '#졸업사진', '#프로필사진'],
    product: '달빛하얀소복',
  },
  {
    id: 2,
    photo: `${P}/예복/연지꽃혼례복/연지꽃혼례복02.png`,
    nickname: '이서연',
    date: '2026.06.02',
    rating: 5,
    text: '경복궁에서 촬영했는데 지나가는 외국인분들이 다 사진 찍어달라고 하셨어요. 원단이랑 자수가 진짜 고급스러워요.',
    tags: ['#혼례복', '#경복궁', '#가족사진'],
    product: '연지꽃혼례복',
  },
  {
    id: 3,
    photo: `${P}/왕/태양의붉은곤룡포/태양의붉은곤룡포02.png`,
    nickname: '박도윤',
    date: '2026.05.21',
    rating: 4.5,
    text: '아들 돌잔치 컨셉샷으로 대여했는데 다들 진짜 왕 같다고 난리났어요. 사이즈도 잘 맞았습니다.',
    tags: ['#돌잔치', '#가족사진', '#곤룡포'],
    product: '태양의붉은곤룡포',
  },
  {
    id: 4,
    photo: `${P}/선비/청풍선비한복/청풍선비한복02.png`,
    nickname: '최민재',
    date: '2026.04.10',
    rating: 5,
    text: '외국인 친구들이랑 서울 여행 왔다가 다 같이 선비 컨셉으로 빌렸어요. 인생샷 건졌습니다.',
    tags: ['#외국인친구', '#서울여행', '#선비'],
    product: '청풍선비한복',
  },
  {
    id: 5,
    photo: `${P}/관복/암행어사관복/암행어사관복02.png`,
    nickname: '한지우',
    date: '2026.03.28',
    rating: 5,
    text: '유튜브 촬영 의상으로 대여했는데 퀄리티가 생각보다 훨씬 좋아서 놀랐어요. 다음에 또 이용할게요.',
    tags: ['#촬영의상', '#유튜브', '#관복'],
    product: '암행어사관복',
  },
  {
    id: 6,
    photo: `${P}/평상복/에메랄드공작한복/에메랄드공작한복02.png`,
    nickname: '오하은',
    date: '2026.02.14',
    rating: 4.5,
    text: '색감이 사진보다 실물이 훨씬 예뻐요. 노리개랑 족두리까지 다 세트로 와서 대여할 필요가 전혀 없었어요.',
    tags: ['#프로필사진', '#한복스냅', '#색감맛집'],
    product: '에메랄드공작한복',
  },
];

const REVIEWERS = [
  '장철희', '이서연', '박도윤', '최민재', '한지우',
  '오하은', '김하린', '윤서준', '정다은', '송지호',
  '임수아', '강민준', '백예린', '조현우', '문가영',
  '신도현', '유나연', '권재민', '안소희', '서지훈',
];

const REVIEW_TEXTS = [
  '사진보다 실물이 더 예쁘고 구성품도 꼼꼼하게 도착했어요.',
  '친구들과 특별한 추억을 만들기 좋았고 사이즈도 잘 맞았습니다.',
  '촬영용으로 빌렸는데 원단과 자수의 완성도가 정말 좋았어요.',
  '배송과 반납이 간편해서 다음 행사에도 다시 이용하고 싶어요.',
  '가족 모두 만족했고 사진도 자연스럽고 멋지게 나왔습니다.',
];

export const HANBOK_REVIEWS = Array.from({ length: 12 }, (_, index) => {
  const base = BASE_REVIEWS[index % BASE_REVIEWS.length];
  const month = String(7 - Math.floor(index / 4)).padStart(2, '0');
  const day = String(15 - (index % 4) * 3).padStart(2, '0');

  return {
    ...base,
    id: index + 1,
    photo: REVIEW_PHOTOS[index],
    nickname: REVIEWERS[index],
    date: `2026.${month}.${day}`,
    rating: index % 4 === 0 ? 4.5 : 5,
    text: index < BASE_REVIEWS.length ? base.text : REVIEW_TEXTS[index % REVIEW_TEXTS.length],
  };
});
