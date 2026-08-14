import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { COLORS, FONTS, CONTENT_THEME } from '../../theme/tokens';
import { hanbokProducts, hanbokCategories, getHanbokProductsByCategory } from '../../data/hanbokProducts';
import { HANBOK_REVIEWS } from '../../data/reviewData';
import ContentSectionHeader from './ContentSectionHeader';
import AutoSlider from '../ui/AutoSlider';
import ProductCard from '../ui/ProductCard';
import ProductModal from '../ui/ProductModal';
import ReviewSection from './ReviewSection';

const LOGO = '/img/콘텐츠1/전통한복/logo02.png';
const accent = CONTENT_THEME.hanbok.accent;

/**
 * ContentHanbok 컴포넌트
 * 콘텐츠1 - 전통한복 섹션 (자동슬라이더 + 상품그리드 + 후기)
 *
 * Example usage:
 * <ContentHanbok />
 */
function ContentHanbok() {
  const [selected, setSelected] = useState(null);

  const sliderProducts = useMemo(
    () => hanbokCategories.flatMap((cat) => getHanbokProductsByCategory(cat).slice(0, 2)),
    []
  );

  return (
    <Box id="content-hanbok" component="section" className="hanji-bg" sx={{ width: '100%', py: { xs: 8, md: 12 } }}>
      <ContentSectionHeader
        logo={LOGO}
        title="오늘은 한국의 아름다움을 입어봄"
        desc="한국의 전통의상을 입고 구석구석 한국의 아름다움을 느껴보세요. 한복 외에도 결혼 예복, 관복, 선비, 노비 의상까지 — 조선의 하루를 그대로 빌려드립니다."
        titleFont={FONTS.doHyeon}
        accentColor={accent}
        logoHeight="120px"
        titleSize={{ xs: '22px', md: '30px' }}
        descSize={{ xs: '13px', md: '15px' }}
      />

      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            textAlign: 'center',
            fontFamily: FONTS.pretendard,
            fontWeight: 700,
            fontSize: { xs: '22px', md: '30px' },
            color: '#E23B3B',
            mb: 1,
          }}
        >
          인기상품
        </Box>
        <AutoSlider products={sliderProducts} onOpen={setSelected} />
      </Box>

      <Box sx={{ width: '90%', mx: 'auto', mt: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {hanbokProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              accentColor={accent}
              onOpen={(p) =>
                window.open(`${import.meta.env.BASE_URL}#/product/${encodeURIComponent(p.id)}`, '_blank')
              }
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 8, md: 12 } }}>
        <ReviewSection reviews={HANBOK_REVIEWS} bgcolor={COLORS.white} />
      </Box>

      <ProductModal product={selected} open={Boolean(selected)} onClose={() => setSelected(null)} accentColor={accent} />
    </Box>
  );
}

export default ContentHanbok;
