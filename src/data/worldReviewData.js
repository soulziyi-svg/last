import { asset } from '../utils/asset';
import { worldProducts } from './worldProducts';

const NAMES = ['김서윤', '박지호', '이하린', '최유진', '정민준', '윤다은', '한지민', '오서준', '임채원', '강도현', '송예린', '백현우'];
const TEXTS = [
  '사진에서 보던 색감 그대로였고 의상 상태도 정말 깨끗했어요. 여행 사진이 특별해졌습니다.',
  '원단이 부드럽고 구성품이 꼼꼼하게 와서 처음 입어보는데도 어렵지 않았어요.',
  '친구들과 문화 체험 촬영용으로 빌렸는데 현지에서 받은 의상처럼 자연스럽고 고급스러웠어요.',
  '사이즈 안내가 정확했고 오래 입고 걸어도 편했습니다. 다음 여행에도 다시 이용하고 싶어요.',
  '자수와 장식이 사진보다 훨씬 섬세해서 가까이 찍은 사진도 정말 잘 나왔습니다.',
  '배송부터 반납까지 간편했고 특별한 날 분위기를 확실하게 살려준 의상이었어요.',
];

export const WORLD_REVIEWS = Array.from({ length: 12 }, (_, index) => ({
  id: `world-review-${index + 1}`,
  photo: asset(`/img/content-world/world-${String(index + 1).padStart(2, '0')}.png`),
  nickname: NAMES[index],
  date: `2026.${String(8 - Math.floor(index / 3)).padStart(2, '0')}.${String(21 - (index % 3) * 4).padStart(2, '0')}`,
  rating: index % 4 === 0 ? 4.5 : 5,
  text: TEXTS[index % TEXTS.length],
  tags: [`#${worldProducts[index].category}전통의상`, '#여행사진', '#입어봄'],
  product: worldProducts[index].name,
}));
