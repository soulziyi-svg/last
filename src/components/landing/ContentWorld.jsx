import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { WORLD_MENU } from '../../data/menuData';
import PlaceholderContentSection from './PlaceholderContentSection';

const LOGO = '/img/콘텐츠1/전통한복/logo03.png';

/**
 * ContentWorld 컴포넌트
 * 콘텐츠2 - 각 나라 전통의상 섹션
 *
 * Example usage:
 * <ContentWorld />
 */
function ContentWorld() {
  return (
    <PlaceholderContentSection
      id="content-world"
      logo={LOGO}
      title="오늘은 세계를 입어봄"
      desc="비행기 없이 떠나는 세계 의상 여행. 일본의 기모노부터 인도의 사리까지, 지구 반대편의 문화를 하루 동안 입어보세요."
      titleFont={FONTS.paperlogy}
      accentColor={CONTENT_THEME.world.accent}
      bgColor={CONTENT_THEME.world.bg}
      groups={WORLD_MENU}
    />
  );
}

export default ContentWorld;
