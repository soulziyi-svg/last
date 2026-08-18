import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { COLORS, FONTS, CONTENT_THEME } from '../../theme/tokens';
import { hanbokProducts, hanbokCategories } from '../../data/hanbokProducts';
import { HANBOK_REVIEWS } from '../../data/reviewData';
import ContentSectionHeader from './ContentSectionHeader';
import AutoSlider from '../ui/AutoSlider';
import ProductCard from '../ui/ProductCard';
import ProductModal from '../ui/ProductModal';
import ReviewSection from './ReviewSection';
import { asset } from '../../utils/asset';
import useManagedProducts from '../../hooks/useManagedProducts';

const LOGO = asset('/img/콘텐츠1/전통한복/logo02.png');
const HANJI_BG = asset('/img/background.jpg');
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
  const managedProducts = useManagedProducts(hanbokProducts, 'hanbok');

  const sliderProducts = useMemo(
    () => hanbokCategories.flatMap((cat) => managedProducts.filter((p) => p.category === cat).slice(0, 2)),
    [managedProducts]
  );

  return (
    <Box
      id="content-hanbok"
      component="section"
      sx={{
        width: '100%',
        pt: { xs: 8, md: 12 },
        pb: 0,
        backgroundColor: '#f6efdd',
        backgroundImage: `url(${HANJI_BG})`,
        backgroundRepeat: 'repeat',
      }}
    >
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
            width: 'fit-content',
            mx: 'auto',
            px: { xs: 3, md: 4 },
            py: { xs: 1, md: 1.2 },
            position: 'relative',
            textAlign: 'center',
            fontFamily: FONTS.pretendard,
            fontWeight: 800,
            fontSize: { xs: '20px', md: '28px' },
            letterSpacing: '0.08em',
            color: COLORS.white,
            bgcolor: '#B72E2E',
            border: '1px solid #D9A441',
            borderRadius: '999px',
            boxShadow: '0 8px 22px rgba(126, 29, 29, 0.22)',
            mb: { xs: 3, md: 4 },
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: { xs: '34px', md: '64px' },
              height: '1px',
              bgcolor: '#B98A36',
            },
            '&::before': { right: 'calc(100% + 12px)' },
            '&::after': { left: 'calc(100% + 12px)' },
          }}
        >
          인기 상품
        </Box>
        <AutoSlider products={sliderProducts} onOpen={setSelected} />
      </Box>

      <Box sx={{ width: '90%', mx: 'auto', mt: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {managedProducts.map((product) => (
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
