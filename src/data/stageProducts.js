import { asset } from '../utils/asset';

const ITEMS = [
  ['청량 무대', '화이트 스쿨룩', '은빛 파이핑을 더한 흰색 재킷과 플리츠 하의가 청량한 무대 의상입니다.'],
  ['청량 무대', '파스텔 무대복', '분홍과 하늘색을 조합한 부드러운 색감의 팝 퍼포먼스 의상입니다.'],
  ['청량 무대', '데님 무대복', '구조적인 데님 재킷과 실버 장식이 세련된 댄스 무대 의상입니다.'],
  ['프레피 무대', '프레피 스쿨룩', '남색과 버건디 블레이저, 체크 하의가 단정한 프레피 의상입니다.'],
  ['프레피 무대', '블랙 골드 무대복', '검정 밀리터리 재킷과 금빛 브레이드가 화려한 메인 무대 의상입니다.'],
  ['프레피 무대', '화이트 퍼포먼스룩', '올화이트 재킷과 비대칭 패널이 조명 아래 우아하게 빛나는 의상입니다.'],
  ['글램 무대', '핑크 트위드 무대복', '분홍과 아이보리 트위드, 진주 단추가 고급스러운 무대 의상입니다.'],
  ['사이버 무대', '메탈릭 사이버룩', '은빛 메탈릭 소재와 홀로그램 장식이 미래적인 퍼포먼스 의상입니다.'],
  ['사이버 무대', '블랙 레더룩', '노출 없이 구성한 검정 인조가죽 재킷과 팬츠가 강렬한 의상입니다.'],
  ['사이버 무대', '네온 무대복', '형광 라임과 전기빛 파랑, 반사 장식이 돋보이는 댄스 의상입니다.'],
  ['사이버 무대', '미래전사 스타일', '흰색과 은색의 경량 갑옷 패널을 활용한 미래형 퍼포먼스 슈트입니다.'],
  ['치어 무대', '컬러풀 치어리더', '빨강·파랑·노랑의 밝은 배색과 폼폼이 생동감 있는 응원 의상입니다.'],
  ['레트로 무대', '레트로 나팔바지룩', '화려한 패턴 재킷과 나팔바지가 1970년대 분위기를 살리는 의상입니다.'],
  ['레트로 무대', '파스텔 팝 무대복', '라벤더와 민트, 복숭아색을 조합한 사랑스러운 팝 무대 의상입니다.'],
  ['Y2K 무대', 'Y2K 데님룩', '오버사이즈 데님 재킷과 카고 팬츠, 체인 장식의 2000년대 스타일입니다.'],
  ['Y2K 무대', '힙합 트레이닝룩', '검정과 코발트 배색의 넉넉한 트랙 재킷과 카고 팬츠 의상입니다.'],
  ['Y2K 무대', '레트로 스쿨룩', '버건디 블레이저와 베이지 조끼, 체크 하의의 복고 스쿨 의상입니다.'],
  ['스포츠 무대', '블랙 스포츠룩', '검정 기능성 재킷과 와이드 팬츠, 붉은 파이핑이 역동적인 의상입니다.'],
];

export const stageProducts = ITEMS.map(([category, name, history], index) => {
  const number = String(index + 1).padStart(2, '0');
  const product = asset(`/img/content-stage/stage-${number}-product.png`);
  const worn = asset(`/img/content-stage/stage-${number}-worn.png`);
  return { id: `stage-${number}`, contentKey: 'stage', category, name, thumbnail: product, images: [product, worn], accessories: [], history, description: `${name}. ${history} 공연과 촬영에서 움직임과 조명을 고려해 편안하게 제작된 대여 의상입니다.`, shortDesc: history, composition: '상의, 하의, 무대 장식 세트', sizes: ['S', 'M', 'L'], rentalPeriod: '2박 3일', price: 59000 + (index % 5) * 10000, rating: index % 5 === 0 ? 4.8 : 5, reviewCount: 34 + ((index * 23) % 137), hot: index % 3 === 0 };
});

export const getStageProductById = (id) => stageProducts.find((product) => product.id === id);
