import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { STAGE_MENU } from '../../data/menuData';
import PlaceholderContentSection from './PlaceholderContentSection';

const LOGO = '/img/콘텐츠1/전통한복/logo05.png';

/**
 * ContentStage 컴포넌트
 * 콘텐츠4 - 공연의상 섹션
 *
 * Example usage:
 * <ContentStage />
 */
function ContentStage() {
  return (
    <PlaceholderContentSection
      id="content-stage"
      logo={LOGO}
      title="오늘은 무대 위의 내가 됨"
      desc="아이돌 스테이지 룩부터 행사 단체복까지. 길거리 공연, 댄스팀, 응원단까지 무대 위 그 순간을 완성해드립니다."
      titleFont={FONTS.blackHan}
      accentColor={CONTENT_THEME.stage.accent}
      bgColor={CONTENT_THEME.stage.bg}
      groups={STAGE_MENU}
    />
  );
}

export default ContentStage;
