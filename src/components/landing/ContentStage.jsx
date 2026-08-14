import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { STAGE_MENU } from '../../data/menuData';
import PlaceholderContentSection from './PlaceholderContentSection';
import { asset } from '../../utils/asset';

const LOGO = asset('/img/콘텐츠1/전통한복/logo05.png');

function ContentStage() {
  return (
    <PlaceholderContentSection
      id="content-stage"
      logo={LOGO}
      title="오늘은 무대 위의 내가 되어봄"
      desc={'아이돌 무대복부터 행사 단체복까지, 주인공이 되는 순간을 준비해보세요.\n길거리 공연과 댄스팀, 응원단에 어울리는 다채로운 스타일을 만나볼 수 있습니다.\n조명 아래 가장 빛나는 한순간을 입어봄이 완성해드립니다.'}
      titleFont={FONTS.blackHan}
      accentColor={CONTENT_THEME.stage.accent}
      bgColor={CONTENT_THEME.stage.bg}
      groups={STAGE_MENU}
    />
  );
}

export default ContentStage;
