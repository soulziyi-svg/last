import { asset } from '../utils/asset';

const PRODUCTS = [
  ['일본', '사쿠라 후리소데', '벚꽃을 닮은 분홍빛과 섬세한 꽃무늬가 돋보이는 일본 여성 예복입니다.', '후리소데, 오비, 오비지메', 69000],
  ['일본', '순백 시로무쿠', '일본 전통 혼례에서 입는 순백의 겹옷으로 단정하고 우아한 분위기를 완성합니다.', '시로무쿠, 오비, 혼례 장식', 119000],
  ['일본', '버건디 하카마', '흰 기모노와 깊은 버건디색 주름 하카마가 어우러진 졸업식 스타일입니다.', '기모노, 하카마, 허리끈', 59000],
  ['일본', '하늘빛 유카타', '가볍고 시원한 면 소재에 잔잔한 꽃무늬를 더한 여름 축제용 유카타입니다.', '유카타, 오비, 허리끈', 49000],
  ['일본', '남색 사무라이 전통복', '남색 하오리와 하카마의 절제된 선이 멋스러운 사무라이풍 남성 전통복입니다.', '기모노, 하오리, 하카마', 79000],
  ['중국', '금화 붉은 치파오', '금빛 꽃 자수와 붉은 비단이 화려하게 어우러진 정통 치파오입니다.', '치파오, 장식 술, 부채', 59000],
  ['중국', '설화 백색 치파오', '은은한 백색 자수와 차분한 실루엣이 청아한 분위기를 만드는 치파오입니다.', '치파오, 헤어 장식', 59000],
  ['중국', '청화 남색 치파오', '깊은 남색 원단에 은빛 문양을 더해 고전적인 기품을 살린 치파오입니다.', '치파오, 귀걸이 장식', 62000],
  ['중국', '봄빛 파스텔 한푸', '넓은 소매와 겹겹이 흐르는 치마가 아름다운 파스텔 색상의 한푸입니다.', '상의, 겹치마, 허리띠', 79000],
  ['중국', '적금 당나라 예복', '붉은색과 금빛 자수를 풍성하게 사용한 당나라풍 문화 행사 예복입니다.', '상의, 장치마, 숄, 허리띠', 89000],
  ['베트남', '순백 아오자이', '깨끗한 흰색 긴 튜닉과 바지가 단아한 실루엣을 만드는 전통 아오자이입니다.', '아오자이 튜닉, 바지', 49000],
  ['베트남', '햇살 노랑 아오자이', '따뜻한 노란 비단이 밝고 생기 있는 여행 사진을 완성하는 아오자이입니다.', '아오자이 튜닉, 바지', 52000],
  ['베트남', '연지 붉은 아오자이', '선명한 붉은 비단과 우아한 옆트임이 돋보이는 행사·촬영용 아오자이입니다.', '아오자이 튜닉, 바지', 55000],
  ['베트남', '연꽃 남색 아오자이', '깊은 남색과 은은한 문양이 차분하고 세련된 인상을 주는 아오자이입니다.', '아오자이 튜닉, 바지', 55000],
  ['태국', '금빛 쑷타이', '정교한 금빛 직조와 어깨 장식이 왕실의 기품을 전하는 태국 여성 전통복입니다.', '쑷타이 상의, 치마, 사바이', 89000],
  ['태국', '분홍 사바이 전통복', '부드러운 분홍 실크와 사선으로 두르는 사바이가 우아한 태국 전통복입니다.', '실크 상의, 치마, 사바이', 79000],
  ['태국', '크림 남성 전통복', '크림색 상의와 적갈색 하의, 허리띠가 어우러진 품격 있는 남성 전통복입니다.', '전통 재킷, 쫑끄라벤, 허리띠', 69000],
  ['태국', '왕실 남빛 전통복', '왕실을 연상시키는 남빛 실크와 은빛 디테일이 화려한 여성 전통복입니다.', '실크 상의, 치마, 사바이', 89000],
];

export const worldProducts = PRODUCTS.map(([category, name, history, composition, price], index) => {
  const number = String(index + 1).padStart(2, '0');
  const productImage = asset(`/img/content-world/world-${number}-product.png`);
  const wornImage = asset(`/img/content-world/world-${number}.png`);

  return {
    id: `world-${number}`,
    contentKey: 'world',
    category,
    name,
    thumbnail: productImage,
    images: [productImage, wornImage],
    accessories: [],
    history,
    description: `${name}. ${history} 여행, 축제, 기념 촬영에서 현지 문화의 아름다움을 자연스럽게 경험해 보세요.`,
    shortDesc: history,
    composition,
    sizes: ['S', 'M', 'L'],
    rentalPeriod: '2박 3일',
    price,
    rating: index % 5 === 0 ? 4.8 : index % 3 === 0 ? 4.9 : 5,
    reviewCount: 31 + ((index * 19) % 128),
    hot: index % 3 === 0,
  };
});

export const worldCategories = [...new Set(worldProducts.map((product) => product.category))];
export const getWorldProductsByCategory = (category) => worldProducts.filter((product) => product.category === category);
export const getWorldProductById = (id) => worldProducts.find((product) => product.id === id);
