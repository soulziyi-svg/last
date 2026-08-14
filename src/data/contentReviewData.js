import { cosplayProducts } from './cosplayProducts';
import { stageProducts } from './stageProducts';

const NAMES = ['김하윤', '이도현', '박서아', '최민준', '정유나', '윤지호', '한채린', '오시우', '임나연', '강준호', '송예은', '백태민'];
const COSPLAY_TEXTS = ['옷만 봤을 때보다 직접 입으니 캐릭터 분위기가 확 살아났어요.', '행사장에서 사진이 정말 잘 나왔고 소품도 가벼워서 편했습니다.', '사이즈가 잘 맞고 원단과 장식의 완성도가 기대 이상이었어요.', '친구들과 코스프레 촬영을 했는데 하루 종일 즐거웠습니다.'];
const STAGE_TEXTS = ['조명 아래에서 색과 장식이 정말 예쁘게 빛났어요.', '춤출 때 움직임이 편하고 사진에서도 실루엣이 잘 살아났습니다.', '단체 공연용으로 대여했는데 무대가 훨씬 완성도 있게 보였어요.', '배송과 반납이 간편하고 의상 상태도 아주 깨끗했습니다.'];

const makeReviews = (products, prefix, texts) => Array.from({ length: 12 }, (_, index) => ({ id: `${prefix}-review-${index + 1}`, photo: products[index].images[1], nickname: NAMES[index], date: `2026.${String(8 - Math.floor(index / 3)).padStart(2, '0')}.${String(22 - (index % 3) * 5).padStart(2, '0')}`, rating: index % 4 === 0 ? 4.5 : 5, text: texts[index % texts.length], tags: [`#${products[index].category.replaceAll(' ', '')}`, '#촬영의상', '#입어봄'], product: products[index].name }));

export const COSPLAY_REVIEWS = makeReviews(cosplayProducts, 'cosplay', COSPLAY_TEXTS);
export const STAGE_REVIEWS = makeReviews(stageProducts, 'stage', STAGE_TEXTS);
