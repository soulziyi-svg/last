import { FONTS, CONTENT_THEME } from '../../theme/tokens';
import { WORLD_MENU } from '../../data/menuData';
import PlaceholderContentSection from './PlaceholderContentSection';
import { asset } from '../../utils/asset';

const LOGO = asset('/img/콘텐츠1/전통한복/logo03.png');

function ContentWorld() {
  return (
    <PlaceholderContentSection
      id="content-world"
      logo={LOGO}
      title="오늘은 세계를 입어봄"
      desc={'비행기 없이 떠나는 세계 의상 여행.\n일본의 기모노부터 인도의 사리까지, 각 나라의 전통과 색을 직접 경험해보세요.\n낯선 문화를 가장 가까이에서 만나고 특별한 하루를 완성해드립니다.'}
      titleFont={FONTS.paperlogy}
      accentColor={CONTENT_THEME.world.accent}
      bgColor={CONTENT_THEME.world.bg}
      groups={WORLD_MENU}
    />
  );
}

export default ContentWorld;
