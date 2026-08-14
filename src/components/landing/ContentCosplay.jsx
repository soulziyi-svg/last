import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { cosplayProducts } from '../../data/cosplayProducts';
import { COSPLAY_REVIEWS } from '../../data/contentReviewData';
import ProductContentSection from './ProductContentSection';
import { asset } from '../../utils/asset';

const LOGO = asset('/img/콘텐츠1/전통한복/logo04.png');

function ContentCosplay() {
  return <ProductContentSection id="content-cosplay" logo={LOGO} title="오늘은 캐릭터가 되어봄" desc={'게임과 판타지 속 좋아하는 캐릭터를 현실에서 만나보세요.\n한국인 모델의 실제 착용 연출과 함께 행사·촬영에 어울리는 다양한 코스튬을 준비했습니다.\n나만의 캐릭터를 하루 동안 빌려 특별한 장면을 완성해드립니다.'} titleFont={FONTS.chab} accent={CONTENT_THEME.cosplay.accent} bgcolor={CONTENT_THEME.cosplay.bg} products={cosplayProducts} reviews={COSPLAY_REVIEWS} reviewTitle="코스프레, 진짜로 입어봄" />;
}

export default ContentCosplay;
