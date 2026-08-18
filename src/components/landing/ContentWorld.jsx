import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { COLORS, FONTS, CONTENT_THEME } from '../../theme/tokens';
import { worldProducts, worldCategories } from '../../data/worldProducts';
import { WORLD_REVIEWS } from '../../data/worldReviewData';
import ContentSectionHeader from './ContentSectionHeader';
import AutoSlider from '../ui/AutoSlider';
import ProductCard from '../ui/ProductCard';
import ProductModal from '../ui/ProductModal';
import ReviewSection from './ReviewSection';
import { asset } from '../../utils/asset';
import useManagedProducts from '../../hooks/useManagedProducts';

const LOGO = asset('/img/콘텐츠1/전통한복/logo03.png');
const accent = CONTENT_THEME.world.accent;

function ContentWorld() {
  const [selected, setSelected] = useState(null);
  const managedProducts = useManagedProducts(worldProducts, 'world');
  const sliderProducts = useMemo(
    () => worldCategories.flatMap((category) => managedProducts.filter((p) => p.category === category).slice(0, 2)),
    [managedProducts]
  );

  return (
    <Box id="content-world" component="section" sx={{ width: '100%', pt: { xs: 8, md: 12 }, pb: 0, bgcolor: CONTENT_THEME.world.bg }}>
      <ContentSectionHeader
        logo={LOGO}
        title="오늘은 세계를 입어봄"
        desc={'비행기 없이 떠나는 세계 의상 여행.\n일본의 기모노부터 중국의 치파오, 베트남의 아오자이와 태국 전통복까지 만나보세요.\n낯선 문화를 가장 가까이에서 입고 특별한 하루를 완성해드립니다.'}
        titleFont={FONTS.paperlogy}
        accentColor={accent}
        logoHeight="120px"
        titleSize={{ xs: '22px', md: '30px' }}
        descSize={{ xs: '13px', md: '15px' }}
      />

      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Box sx={{ width: 'fit-content', mx: 'auto', px: { xs: 3, md: 4 }, py: { xs: 1, md: 1.2 }, position: 'relative', textAlign: 'center', fontFamily: FONTS.pretendard, fontWeight: 800, fontSize: { xs: '20px', md: '28px' }, letterSpacing: '0.08em', color: COLORS.white, bgcolor: accent, border: '1px solid rgba(255,255,255,0.75)', borderRadius: '999px', boxShadow: '0 8px 22px rgba(23,23,23,0.18)', mb: { xs: 3, md: 4 }, '&::before, &::after': { content: '""', position: 'absolute', top: '50%', width: { xs: '34px', md: '64px' }, height: '1px', bgcolor: accent }, '&::before': { right: 'calc(100% + 12px)' }, '&::after': { left: 'calc(100% + 12px)' } }}>
          인기 상품
        </Box>
        <AutoSlider products={sliderProducts} onOpen={setSelected} />
      </Box>

      <Box sx={{ width: '90%', mx: 'auto', mt: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {managedProducts.map((product) => (
            <ProductCard key={product.id} product={product} accentColor={accent} onOpen={setSelected} />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 8, md: 12 } }}>
        <ReviewSection title="세계 전통의상, 진짜로 입어봄" reviews={WORLD_REVIEWS} bgcolor={COLORS.white} />
      </Box>

      <ProductModal product={selected} open={Boolean(selected)} onClose={() => setSelected(null)} accentColor={accent} />
    </Box>
  );
}

export default ContentWorld;
