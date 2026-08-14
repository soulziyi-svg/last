import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { COSPLAY_MENU } from '../../data/menuData';
import PlaceholderContentSection from './PlaceholderContentSection';

const LOGO = '/img/콘텐츠1/전통한복/logo04.png';

/**
 * ContentCosplay 컴포넌트
 * 콘텐츠3 - 코스프레 섹션
 *
 * Example usage:
 * <ContentCosplay />
 */
function ContentCosplay() {
  return (
    <PlaceholderContentSection
      id="content-cosplay"
      logo={LOGO}
      title="오늘은 캐릭터가 되어봄"
      desc="게임, 애니메이션, 영화 속 그 캐릭터가 되어보세요. 리그 오브 레전드부터 마블까지, 최애 캐릭터를 하루 동안 빌려드립니다."
      titleFont={FONTS.chab}
      accentColor={CONTENT_THEME.cosplay.accent}
      bgColor={CONTENT_THEME.cosplay.bg}
      groups={COSPLAY_MENU}
    />
  );
}

export default ContentCosplay;
