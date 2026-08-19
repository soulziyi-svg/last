import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { stageProducts } from '../../data/stageProducts';
import { STAGE_REVIEWS } from '../../data/contentReviewData';
import ProductContentSection from './ProductContentSection';
import { asset } from '../../utils/asset';

const LOGO = asset('/img/콘텐츠1/전통한복/logo05.png');

function ContentStage({ content }) {
  return <ProductContentSection id="content-stage" logo={LOGO} title={content?.title || '오늘은 무대 위의 내가 되어봄'} desc={content?.desc || '아이돌 무대복부터 행사 단체복까지, 주인공이 되는 순간을 준비해보세요.\n한국인 공연자가 직접 연출한 실제 무대 느낌의 착용 사진과 다양한 스타일을 만나볼 수 있습니다.\n조명 아래 가장 빛나는 한순간을 입어봄이 완성해드립니다.'} titleFont={FONTS.blackHan} accent={CONTENT_THEME.stage.accent} bgcolor={CONTENT_THEME.stage.bg} products={stageProducts} reviews={STAGE_REVIEWS} reviewTitle="무대의상, 진짜로 입어봄" />;
}

export default ContentStage;
