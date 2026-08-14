import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { COLORS, FONTS } from '../../theme/tokens';
import ContentSectionHeader from './ContentSectionHeader';
import AutoSlider from '../ui/AutoSlider';
import ProductCard from '../ui/ProductCard';
import ProductModal from '../ui/ProductModal';
import ReviewSection from './ReviewSection';

function ProductContentSection({ id, logo, title, desc, titleFont, accent, bgcolor, products, reviews, reviewTitle }) {
  const [selected, setSelected] = useState(null);
  const sliderProducts = useMemo(() => {
    const categories = [...new Set(products.map((product) => product.category))];
    return categories.flatMap((category) => products.filter((product) => product.category === category).slice(0, 2));
  }, [products]);

  return (
    <Box id={id} component="section" sx={{ width: '100%', pt: { xs: 8, md: 12 }, pb: 0, bgcolor }}>
      <ContentSectionHeader logo={logo} title={title} desc={desc} titleFont={titleFont} accentColor={accent} logoHeight="120px" titleSize={{ xs: '22px', md: '30px' }} descSize={{ xs: '13px', md: '15px' }} />

      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Box sx={{ width: 'fit-content', mx: 'auto', px: { xs: 3, md: 4 }, py: { xs: 1, md: 1.2 }, position: 'relative', textAlign: 'center', fontFamily: FONTS.pretendard, fontWeight: 800, fontSize: { xs: '20px', md: '28px' }, letterSpacing: '0.08em', color: COLORS.white, bgcolor: accent, border: '1px solid rgba(255,255,255,0.75)', borderRadius: '999px', boxShadow: '0 8px 22px rgba(23,23,23,0.18)', mb: { xs: 3, md: 4 }, '&::before, &::after': { content: '""', position: 'absolute', top: '50%', width: { xs: '34px', md: '64px' }, height: '1px', bgcolor: accent }, '&::before': { right: 'calc(100% + 12px)' }, '&::after': { left: 'calc(100% + 12px)' } }}>
          인기 상품
        </Box>
        <AutoSlider products={sliderProducts} onOpen={setSelected} />
      </Box>

      <Box sx={{ width: '90%', mx: 'auto', mt: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }, gap: { xs: 2, md: 3 } }}>
          {products.map((product) => <ProductCard key={product.id} product={product} accentColor={accent} onOpen={setSelected} />)}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
          <Button variant="outlined" sx={{ minWidth: { xs: 150, md: 190 }, py: 1.2, borderWidth: '2px', borderColor: accent, borderRadius: '999px', color: accent, fontFamily: FONTS.pretendard, fontWeight: 800, fontSize: { xs: '13px', md: '15px' }, '&:hover': { borderWidth: '2px', borderColor: accent, bgcolor: accent, color: COLORS.white } }}>
            더보기 +
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 8, md: 12 } }}>
        <ReviewSection title={reviewTitle} reviews={reviews} bgcolor={COLORS.white} />
      </Box>
      <ProductModal product={selected} open={Boolean(selected)} onClose={() => setSelected(null)} accentColor={accent} />
    </Box>
  );
}

export default ProductContentSection;
