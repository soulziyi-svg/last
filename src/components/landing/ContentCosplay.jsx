import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { COSPLAY_MENU } from '../../data/menuData';
import PlaceholderContentSection from './PlaceholderContentSection';
import { asset } from '../../utils/asset';

const LOGO = asset('/img/콘텐츠1/전통한복/logo04.png');

function ContentCosplay() {
  return (
    <PlaceholderContentSection
      id="content-cosplay"
      logo={LOGO}
      title="오늘은 캐릭터가 되어봄"
      desc={'게임과 애니메이션, 영화 속 좋아하는 캐릭터를 현실에서 만나보세요.\n리그 오브 레전드부터 마블까지 다양한 세계관의 의상을 한곳에 준비했습니다.\n행사와 촬영, 특별한 모임을 위한 나만의 캐릭터를 하루 동안 빌려드립니다.'}
      titleFont={FONTS.chab}
      accentColor={CONTENT_THEME.cosplay.accent}
      bgColor={CONTENT_THEME.cosplay.bg}
      groups={COSPLAY_MENU}
    />
  );
}

export default ContentCosplay;
