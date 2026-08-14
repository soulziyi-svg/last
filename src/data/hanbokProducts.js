/**
 * 콘텐츠1 - 전통한복 상품 데이터
 * public/img/콘텐츠1/전통한복/컨텐츠1/상품 실제 이미지 파일을 기준으로 작성됨.
 */

import { asset } from '../utils/asset';

const BASE = asset('/img/콘텐츠1/전통한복/컨텐츠1/상품');

const CATEGORY_INFO = {
  평상복: {
    order: 1,
    history:
      '궁 밖 저잣거리와 규방에서 즐겨 입던 나들이용 한복입니다. 화려한 예복과 달리 몸을 편히 움직일 수 있도록 지어져, 산책이나 사진 촬영처럼 가볍게 즐기기 좋습니다.',
    tagline: '가볍게 즐기는 나들이 한복',
    composition: '저고리, 치마(또는 바지), 족두리, 비녀, 꽃신, 노리개',
    priceRange: [39000, 49000],
  },
  예복: {
    order: 2,
    history:
      '혼례나 큰 잔치 때 갖춰 입던 격식 있는 한복입니다. 금박과 자수로 화려하게 장식되어 인생의 특별한 하루를 더욱 빛나게 해줍니다.',
    tagline: '인생의 특별한 하루를 위한 예복',
    composition: '겉옷, 속옷 세트, 대대(허리띠), 화관, 장신구',
    priceRange: [89000, 120000],
  },
  관복: {
    order: 3,
    history:
      '조선시대 문관과 무관이 관청에 출근할 때 입던 정복입니다. 가슴과 등의 흉배 문양으로 품계를 나타내며, 위엄 있는 실루엣이 특징입니다.',
    tagline: '위엄이 느껴지는 관청의 정복',
    composition: '단령(겉옷), 흉배, 각대, 사모',
    priceRange: [69000, 89000],
  },
  선비: {
    order: 4,
    history:
      '학문을 닦던 선비들이 즐겨 입던 도포 차림입니다. 넉넉한 소매와 단정한 실루엣으로 절제된 기품을 표현하며, 갓과 함께 갖추면 완성도가 높아집니다.',
    tagline: '단정한 기품이 느껴지는 도포 차림',
    composition: '도포, 세조대(허리끈), 갓, 버선',
    priceRange: [45000, 59000],
  },
  왕: {
    order: 5,
    history:
      '용포라 불리는 왕실 최고 예복입니다. 가슴의 용흉배와 금사 자수가 왕의 위엄을 드러내며, 궁중 화보나 기념 촬영에서 특히 인기가 높습니다.',
    tagline: '궁중 화보 인기 1위, 왕의 용포',
    composition: '곤룡포, 익선관, 옥대, 목화(신발)',
    priceRange: [129000, 159000],
  },
  노비: {
    order: 6,
    history:
      '장터와 들녘에서 일하던 서민들의 생활 한복입니다. 꾸밈없이 소박하지만 그 시대의 삶이 고스란히 담겨있어 이색적인 컨셉 촬영에 제격입니다.',
    tagline: '이색 컨셉 촬영에 제격인 생활 한복',
    composition: '저고리, 바지(또는 치마), 행전, 짚신',
    priceRange: [25000, 35000],
  },
};

// [카테고리, 상품명, 이미지 파일명 배열, 악세서리 파일명 배열]
const RAW_PRODUCTS = [
  // 평상복
  ['평상복', '달빛하얀소복', ['01', '02', '03'], ['꽃신', '노리개', '비녀', '족두리']],
  ['평상복', '라벤더달빛한복', ['01', '02', '03'], ['꽃신', '노리개', '비녀', '족두리']],
  ['평상복', '붉은궁중한복', ['01', '02', '03'], ['꽃신', '노리개', '비녀', '족두리']],
  ['평상복', '산호빛모란한복', ['01', '02', '03'], ['꽃신', '노리개', '비녀', '족두리']],
  ['평상복', '에메랄드공작한복', ['01', '02', '03'], ['꽃신', '노리개', '비녀', '족두리']],
  ['평상복', '파스텔봄한복', ['', '02', '03'], ['꽃신', '노리개', '비녀', '족두리']],
  ['평상복', '할로윈고딕한복', ['', '02'], ['꽃신', '노리개', '비녀', '족두리']],
  // 예복
  ['예복', '연지꽃혼례복', ['01', '02', '03'], []],
  ['예복', '비단꽃활옷', ['01', '02', '03'], []],
  ['예복', '청홍원삼예복', ['01', '02', '03'], []],
  ['예복', '금빛대례복', ['01', '02', '03'], []],
  ['예복', '백년가약혼례복', ['01', '02', '03'], []],
  // 관복
  ['관복', '붉은단령관복', ['01', '02', '03'], []],
  ['관복', '푸른단령관복', ['01', '02', '03'], []],
  ['관복', '학흉배문관복', ['01', '02', '03'], []],
  ['관복', '호랑이흉배무관복', ['01', '02', '03'], []],
  ['관복', '암행어사관복', ['01', '02', '03'], []],
  // 선비
  ['선비', '청풍선비한복', ['01', '02', '03'], []],
  ['선비', '달빛도포선비', ['01', '02', '03'], []],
  ['선비', '먹빛갓선비', ['01', '02', '03'], []],
  ['선비', '매화유생복', ['01', '02', '03'], []],
  ['선비', '풍류선비한복', ['01', '02', '03'], []],
  // 왕
  ['왕', '태양의붉은곤룡포', ['01', '02', '03'], []],
  ['왕', '황금용곤룡포', ['01', '02', '03'], []],
  ['왕', '푸른왕의곤룡포', ['01', '02', '03'], []],
  ['왕', '세자비단곤룡포', ['01', '02', '03'], []],
  ['왕', '어좌의왕대례복', ['01', '02', '03'], []],
  // 노비
  ['노비', '들꽃마당쇠복', ['01', '02', '03'], []],
  ['노비', '삼베돌쇠옷', ['01', '02', '03'], []],
  ['노비', '시골아낙한복', ['01', '02', '03'], []],
  ['노비', '장터보부상복', ['01', '02', '03'], []],
  ['노비', '장터주모한복', ['01', '02', '03'], []],
];

// 파일명이 상품명 접두사 규칙을 따르지 않는 예외 이미지
const IRREGULAR_EXTRA_IMAGES = {
  '평상복-할로윈고딕한복': [`${BASE}/평상복/할로윈고딕한복/03.png`],
};

const seededRating = (i) => (4.5 + ((i * 7) % 5) / 10).toFixed(1);
const seededReviewCount = (i) => 24 + ((i * 17) % 130);
const seededPrice = (i, [min, max]) => {
  const step = (max - min) / 10;
  return Math.round((min + step * (i % 10)) / 1000) * 1000;
};

export const hanbokProducts = RAW_PRODUCTS.map(
  ([category, name, imgSuffixes, accSuffixes], i) => {
    const info = CATEGORY_INFO[category];
    const folder = `${BASE}/${category}/${name}`;
    const id = `${category}-${name}`;
    const images = imgSuffixes
      .filter((s) => s !== null)
      .map((s) => `${folder}/${s === '' ? name : `${name}${s}`}.png`)
      .concat(IRREGULAR_EXTRA_IMAGES[id] || []);
    const accessories = accSuffixes.map((s) => ({
      label: s,
      src: `${folder}/${name}${s}.png`,
    }));

    return {
      id,
      category,
      contentKey: 'hanbok',
      name,
      thumbnail: images[0],
      images,
      accessories,
      history: info.history.replace(/^./, (c) => c),
      description: `${name}, ${info.history}`,
      shortDesc: info.tagline,
      composition: accessories.length
        ? info.composition
        : info.composition.replace(/, 족두리, 비녀, 꽃신, 노리개$/, ''),
      sizes: ['S', 'M', 'L'],
      rentalPeriod: '2박 3일',
      price: seededPrice(i, info.priceRange),
      rating: Number(seededRating(i)),
      reviewCount: seededReviewCount(i),
      hot: i % 3 === 0,
    };
  }
);

export const hanbokCategories = Object.keys(CATEGORY_INFO).sort(
  (a, b) => CATEGORY_INFO[a].order - CATEGORY_INFO[b].order
);

export const getHanbokProductsByCategory = (category) =>
  hanbokProducts.filter((p) => p.category === category);

export const getHanbokProductById = (id) =>
  hanbokProducts.find((p) => p.id === id);
