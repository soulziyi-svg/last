/* ============================================================
   IBUBOM(입어봄) 상품 데이터
   - 실제 img 폴더 자산에 맞춰 생성한 데이터 모델입니다.
   - 콘텐츠2~4는 파일명이 world-XX / cosplay-XX / stage-XX 식으로만
     구분되어 있어, 기획서에 제시된 실제 상품명을 순서대로 매칭했습니다.
   - 관리자페이지(추후 단계)에서 이 구조를 localStorage로 override 합니다.
   ============================================================ */

const CATEGORY_META = {
  hanbok: {
    key: "hanbok",
    label: "전통한복",
    color: "#FF5C8A",
    colorVarName: "--pink",
    font: "'Paperlogy', 'Pretendard', sans-serif",
    bgClass: "bg-hanbok",
    logo: "img/콘텐츠1/전통한복/logo02.png",
    heroTitle: "오늘은 한국의 아름다움을 입어봄",
    heroDesc:
      "한국의 전통의상을 입고 구석구석 한국의 아름다움을 느껴보세요.\n한복 외에도 결혼 예복, 관복, 선비, 노비 의상까지 — 시대와 신분을 넘나드는 특별한 하루를 만나보세요.",
    order: ["평상복", "예복", "관복", "선비", "왕", "노비"]
  },
  world: {
    key: "world",
    label: "각 나라 전통의상",
    color: "#FFD84D",
    colorVarName: "--yellow",
    font: "'Pretendard SemiBold', 'Pretendard', sans-serif",
    bgClass: "bg-world",
    logo: "img/콘텐츠1/전통한복/logo03.png",
    heroTitle: "오늘은 세계를 입어봄",
    heroDesc:
      "비행기 없이 떠나는 세계여행.\n일본의 기모노부터 인도의 사리까지, 각 나라의 전통과 색을 직접 경험해보세요. 낯선 문화를 가장 가까이에서 만나고 특별한 하루를 완성해드립니다.",
    order: ["일본", "중국", "베트남", "태국", "인도", "중동권"]
  },
  cosplay: {
    key: "cosplay",
    label: "코스프레",
    color: "#7C4DFF",
    colorVarName: "--purple",
    font: "'LOTTERIACHAB', 'Pretendard', sans-serif",
    bgClass: "bg-cosplay",
    logo: "img/콘텐츠1/전통한복/logo04.png",
    heroTitle: "오늘은 캐릭터가 되어봄",
    heroDesc:
      "게임과 판타지 속 좋아하는 캐릭터를 현실에서 만나보세요.\n행사 촬영에 어울리는 다양한 코스튬을 준비했습니다.\n나만의 캐릭터를 빌려 특별한 장면을 완성해드립니다.",
    order: ["리그 오브 레전드", "오버워치", "귀멸의 칼날", "주술회전", "원피스", "DC", "마블"]
  },
  stage: {
    key: "stage",
    label: "공연의상",
    color: "#49D6B4",
    colorVarName: "--mint",
    font: "'Black Han Sans', 'Pretendard', sans-serif",
    bgClass: "bg-stage",
    logo: "img/콘텐츠1/전통한복/logo05.png",
    heroTitle: "오늘은 무대 위의 내가 되어봄",
    heroDesc:
      "아이돌 무대복부터 행사 단체복까지, 주인공이 되는 순간을 준비해보세요.\n무대 느낌의 착용 사진과 다양한 스타일을 만나볼 수 있습니다.\n조명 아래 가장 빛나는 한 순간을 입어봄이 완성해드립니다.",
    order: [
      "리센느", "아이브", "에스파", "뉴진스",
      "BTS", "세븐틴", "스트레이 키즈", "NCT",
      "행사의상", "치어리더"
    ]
  }
};

/* ---------- 콘텐츠1 : 전통한복 (실제 폴더/파일명 그대로 매칭) ---------- */
const ACC_PRICE = { 노리개: 3000, 꽃신: 5000, 족두리: 2000, 비녀: 2000 };
const HANBOK_BASE = "img/콘텐츠1/전통한복/컨텐츠1/상품";

/* 대부분 파일명이 "{상품명}01.png" 형태로 접두사가 붙어있어 기본값으로 생성하고,
   예외 3건(파스텔봄한복/할로윈고딕한복의 대표 이미지 명명 규칙)만 별도 지정한다. */
function hb(name, opts){
  opts = opts || {};
  const files = opts.files || [`${name}01.png`, `${name}02.png`, `${name}03.png`];
  return { name, files, hasAcc: !!opts.hasAcc };
}
const HANBOK_RAW = {
  평상복: [
    hb("달빛하얀소복", { hasAcc:true }),
    hb("라벤더달빛한복", { hasAcc:true, files:["라벤더달빛한복01.png","라벤더달빛한복02.jpg","라벤더달빛한복03.png"] }),
    hb("붉은궁중한복", { hasAcc:true }),
    hb("산호빛모란한복", { hasAcc:true }),
    hb("에메랄드공작한복", { hasAcc:true, files:["에메랄드공작한복01.png","에메랄드공작한복02.jpg","에메랄드공작한복03.png"] }),
    hb("파스텔봄한복", { hasAcc:true, files:["파스텔봄한복.png","파스텔봄한복02.png","파스텔봄한복03.png"] }),
    hb("할로윈고딕한복", { hasAcc:true, files:["할로윈고딕한복.png","할로윈고딕한복02.png","03.png"] })
  ],
  예복: [
    hb("연지꽃혼례복"), hb("비단꽃활옷"), hb("청홍원삼예복"), hb("금빛대례복"), hb("백년가약혼례복")
  ],
  관복: [
    hb("붉은단령관복"), hb("푸른단령관복"), hb("학흉배문관복"), hb("호랑이흉배무관복"), hb("암행어사관복")
  ],
  선비: [
    hb("청풍선비한복"), hb("달빛도포선비"), hb("먹빛갓선비"), hb("매화유생복"), hb("풍류선비한복")
  ],
  왕: [
    hb("태양의붉은곤룡포"), hb("황금용곤룡포"), hb("푸른왕의곤룡포"), hb("세자비단곤룡포"), hb("어좌의왕대례복")
  ],
  노비: [
    hb("들꽃마당쇠복"), hb("삼베돌쇠옷"), hb("시골아낙한복"), hb("장터보부상복"), hb("장터주모한복")
  ]
};

/* ---------- 콘텐츠2 : 각 나라 전통의상 (world-01~18, base+ -product) ---------- */
const WORLD_FLAGS = {
  일본: "img/flags/japan.svg",
  중국: "img/flags/china.svg",
  베트남: "img/flags/vietnam.svg",
  태국: "img/flags/thailand.svg",
  인도: "🇮🇳",
  중동권: "🇦🇪"
};
const WORLD_RAW = {
  일본: [
    { name: "사쿠라 기모노", code: "world-01" },
    { name: "붉은 후리소데", code: "world-02" },
    { name: "남성 하오리·하카마", code: "world-03" }
  ],
  중국: [
    { name: "붉은 치파오", code: "world-04" },
    { name: "청화 치파오", code: "world-05" },
    { name: "한푸", code: "world-06" }
  ],
  베트남: [
    { name: "백색 아오자이", code: "world-07" },
    { name: "연꽃 아오자이", code: "world-08" },
    { name: "붉은 아오자이", code: "world-09" }
  ],
  태국: [
    { name: "금빛 쑷타이", code: "world-10" },
    { name: "사바이 전통복", code: "world-11" },
    { name: "태국 왕실풍 전통복", code: "world-12" }
  ],
  인도: [
    { name: "사리", code: "world-13" },
    { name: "레헨가", code: "world-14" },
    { name: "살와르 카미즈", code: "world-15" }
  ],
  중동권: [
    { name: "아바야", code: "world-16" },
    { name: "카프탄", code: "world-17" },
    { name: "칸두라풍 전통복", code: "world-18" }
  ]
};

/* ---------- 콘텐츠3 : 코스프레 (cosplay-01~42, -product / -worn) ---------- */
const COSPLAY_RAW = {
  "리그 오브 레전드": [
    "아칼리", "아리", "이즈리얼", "문도", "소나", "럭스", "야스오", "요네", "티모"
  ].map((n, i) => ({ name: n, code: `cosplay-${String(i + 1).padStart(2, "0")}` })),
  오버워치: [
    "디바", "메르시", "트레이서", "겐지", "한조", "키리코", "위도우메이커"
  ].map((n, i) => ({ name: n, code: `cosplay-${String(i + 10).padStart(2, "0")}` })),
  "귀멸의 칼날": [
    "탄지로", "네즈코", "젠이츠", "이노스케", "기유", "렌고쿠", "미츠리", "아카자"
  ].map((n, i) => ({ name: n, code: `cosplay-${String(i + 17).padStart(2, "0")}` })),
  주술회전: [
    "고죠 사토루", "이타도리", "후시구로", "노바라", "게토"
  ].map((n, i) => ({ name: n, code: `cosplay-${String(i + 25).padStart(2, "0")}` })),
  원피스: [
    "루피", "조로", "상디", "나미", "로빈", "에이스", "샹크스"
  ].map((n, i) => ({ name: n, code: `cosplay-${String(i + 30).padStart(2, "0")}` })),
  DC: [
    "조커", "할리 퀸", "배트맨", "슈퍼맨", "원더우먼"
  ].map((n, i) => ({ name: n, code: `cosplay-${String(i + 37).padStart(2, "0")}` })),
  마블: [
    { name: "아이언맨", code: "cosplay-42" }
  ]
};

/* ---------- 콘텐츠4 : 공연의상 (stage-01~18, -product / -worn) ---------- */
const STAGE_RAW = {
  리센느: [
    { name: "화이트 스쿨룩", code: "stage-01" },
    { name: "파스텔 무대복", code: "stage-02" }
  ],
  아이브: [
    { name: "프레피 스쿨룩", code: "stage-03" },
    { name: "블랙&골드 무대복", code: "stage-04" }
  ],
  에스파: [
    { name: "메탈릭 사이버룩", code: "stage-05" },
    { name: "블랙 레더룩", code: "stage-06" }
  ],
  뉴진스: [
    { name: "Y2K 데님룩", code: "stage-07" },
    { name: "힙합 트레이닝룩", code: "stage-08" }
  ],
  BTS: [
    { name: "블랙 수트", code: "stage-09" },
    { name: "화이트 수트", code: "stage-10" }
  ],
  세븐틴: [
    { name: "청량 마린룩", code: "stage-11" },
    { name: "스쿨룩", code: "stage-12" }
  ],
  "스트레이 키즈": [
    { name: "스트리트룩", code: "stage-13" },
    { name: "블랙 레더", code: "stage-14" }
  ],
  NCT: [
    { name: "네온 스트리트", code: "stage-15" },
    { name: "힙합 무대복", code: "stage-16" }
  ],
  행사의상: [{ name: "레드 골드 밸리복", code: "stage-17" }],
  치어리더: [{ name: "레드 치어리더", code: "stage-18" }]
};

/* ---------- 공용 후기 이미지 (보유 수량이 적어 섹션마다 재사용) ---------- */
const REVIEW_IMAGES = Array.from({ length: 12 }, (_, i) => `img/reviews/review-${String(i + 1).padStart(2, "0")}.png`);
const REVIEW_NAMES = ["장철희", "김수아", "박도윤", "이하늘", "정민준", "최서연", "오지훈", "한예린", "윤태오", "임소율", "배은우", "강나윤"];
const REVIEW_TAGS = {
  hanbok: ["#졸업사진", "#한복나들이", "#프로필사진", "#가족사진", "#여행"],
  world: ["#세계여행", "#이색컨셉", "#프로필사진", "#해외파티", "#졸업사진"],
  cosplay: ["#코스프레", "#캐릭터덕후", "#행사촬영", "#쇼츠촬영", "#덕질인증"],
  stage: ["#무대의상", "#단체촬영", "#공연", "#아이돌커버", "#행사"]
};

function pseudoRand(seed) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}
function stockFor(i) {
  const s = Math.floor(pseudoRand(i * 3 + 1) * 5);
  const m = Math.floor(pseudoRand(i * 5 + 2) * 5);
  const l = Math.floor(pseudoRand(i * 7 + 3) * 5);
  return { S: s, M: m, L: l };
}
function ratingFor(i) {
  return (4.2 + (i % 9) * 0.09).toFixed(1);
}
function priceFor(cat, i) {
  const base = { hanbok: 20000, world: 24000, cosplay: 26000, stage: 28000 }[cat];
  return base + (i % 6) * 2000;
}
function descFor(cat, sub, name) {
  const lines = {
    hanbok: [
      `${sub} 스타일의 '${name}', 한 벌로 완성되는 오늘의 한국.`,
      `깨끗하게 세탁·고온살균 처리된 원단을 문 앞에서 바로 받아보세요.`,
      `졸업사진, 여행, 가족사진 어디에나 잘 어울리는 실루엣입니다.`
    ],
    world: [
      `${sub}의 색과 자수를 그대로 재현한 '${name}'.`,
      `현지 전통의 디테일을 살려 촬영·행사 어디서나 시선을 사로잡습니다.`,
      `사이즈별 실측을 확인하고 편하게 빌려보세요.`
    ],
    cosplay: [
      `${sub} 속 '${name}'을(를) 그대로 입어보는 시간.`,
      `가발·소품까지 구성 옵션으로 챙길 수 있어 완성도가 높습니다.`,
      `행사·촬영·쇼츠 어떤 장면에도 바로 투입 가능한 퀄리티.`
    ],
    stage: [
      `${sub} 무드의 무대의상 '${name}'.`,
      `단체 대여 시 추가 할인, 급한 공연 일정도 빠르게 대응합니다.`,
      `조명 아래에서 가장 선명하게 보이는 소재와 컬러로 제작했습니다.`
    ]
  };
  return lines[cat];
}

const PRODUCTS = [];
let _pid = 1;

function pushProduct(cat, sub, item, idx) {
  const id = `p${String(_pid++).padStart(4, "0")}`;
  let images, thumbs, worn, accessories = [];

  if (cat === "hanbok") {
    const dir = `${HANBOK_BASE}/${sub}/${item.name}`;
    images = item.files.map((f) => `${dir}/${f}`);
    thumbs = images;
    worn = images[1] || images[0];
    if (item.hasAcc) {
      accessories = ["노리개", "꽃신", "족두리", "비녀"].map((a) => ({
        name: a,
        price: ACC_PRICE[a],
        image: `${dir}/${item.name}${a}.png`
      }));
    }
  } else if (cat === "world") {
    const base = `img/콘텐츠2/${item.code}.png`;
    const product = `img/콘텐츠2/${item.code}-product.png`;
    images = [product, base];
    thumbs = images;
    worn = base;
    accessories = [
      { name: "전통 소품 세트", price: 5000, image: null },
      { name: "매칭 슈즈", price: 5000, image: null }
    ];
  } else if (cat === "cosplay") {
    const product = `img/콘텐츠3/${item.code}-product.png`;
    const wornImg = `img/콘텐츠3/${item.code}-worn.png`;
    images = [product, wornImg];
    thumbs = images;
    worn = wornImg;
    if (item.name === "네즈코") {
      accessories = [
        { name: "대나무 소품", price: 5000, image: "img/콘텐츠3/nezuko-accessories.png" },
        { name: "왕코 게다", price: 4000, image: "img/콘텐츠3/nezuko-geta.png" }
      ];
    } else {
      accessories = [
        { name: "가발", price: 8000, image: null },
        { name: "소품 세트", price: 5000, image: null }
      ];
    }
  } else if (cat === "stage") {
    const product = `img/콘텐츠4/${item.code}-product.png`;
    const wornImg = `img/콘텐츠4/${item.code}-worn.png`;
    images = [product, wornImg];
    thumbs = images;
    worn = wornImg;
    accessories = [
      { name: "무대화", price: 5000, image: null },
      { name: "포인트 액세서리", price: 3000, image: null }
    ];
  }

  const gi = _pid; // global index for pseudo-random spread
  PRODUCTS.push({
    id,
    cat,
    sub,
    name: item.name,
    images,
    thumbs,
    worn,
    accessories,
    price: priceFor(cat, gi),
    rating: ratingFor(gi),
    reviewCount: 8 + (gi % 40),
    stock: stockFor(gi),
    hot: gi % 4 === 0,
    popular: gi % 3 === 0,
    country: cat === "world" ? sub : null,
    desc: descFor(cat, sub, item.name)
  });
}

Object.entries(HANBOK_RAW).forEach(([sub, list]) => list.forEach((item, i) => pushProduct("hanbok", sub, item, i)));
Object.entries(WORLD_RAW).forEach(([sub, list]) => list.forEach((item, i) => pushProduct("world", sub, item, i)));
Object.entries(COSPLAY_RAW).forEach(([sub, list]) => list.forEach((item, i) => pushProduct("cosplay", sub, item, i)));
Object.entries(STAGE_RAW).forEach(([sub, list]) => list.forEach((item, i) => pushProduct("stage", sub, item, i)));

function productsByCat(cat) {
  return PRODUCTS.filter((p) => p.cat === cat);
}
function productsByCatSub(cat, sub) {
  return PRODUCTS.filter((p) => p.cat === cat && p.sub === sub);
}
function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
function randomPick(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

const BANNER_IMAGES = ["000", "011", "022", "033", "044", "066", "077"].map((n) => `img/베너/${n}.png`);
