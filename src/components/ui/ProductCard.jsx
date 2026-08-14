import { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { COLORS, FONTS } from '../../theme/tokens';

/**
 * ProductCard 컴포넌트
 * 서브메뉴 상품 그리드용 카드. hover 시 상품 착용 이미지로 즉시 전환된다.
 *
 * @param {object} product - 상품 데이터 [Required]
 * @param {string} accentColor - 컨텐츠 테마 강조색 [Required]
 * @param {function} onOpen - 카드 클릭 시 실행 [Required]
 *
 * Example usage:
 * <ProductCard product={product} accentColor={COLORS.pink} onOpen={handleOpen} />
 */
function ProductCard({ product, accentColor, onOpen }) {
  const [hover, setHover] = useState(false);
  const wornImage = product.images[1] || product.images[0];

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpen(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', overflow: 'hidden', bgcolor: '#fff' }}>
        <Box
          component="img"
          src={hover ? wornImage : product.thumbnail}
          alt={product.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {product.hot && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: '#E23B3B',
              color: COLORS.white,
              fontFamily: FONTS.pretendard,
              fontWeight: 700,
              fontSize: '11px',
              px: '8px',
              py: '2px',
            }}
          >
            HOT
          </Box>
        )}
      </Box>

      <Box sx={{ pt: 1.2 }}>
        <Box
          sx={{
            fontFamily: FONTS.gmarket,
            fontSize: '14px',
            color: COLORS.black,
            mb: 0.5,
          }}
        >
          {product.name}
        </Box>
        {product.shortDesc && (
          <Box
            sx={{
              fontFamily: FONTS.pretendard,
              fontSize: '11px',
              color: 'rgba(23,23,23,0.55)',
              mb: 0.6,
            }}
          >
            {product.shortDesc}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: 0.5 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '11px', color: 'rgba(23,23,23,0.55)' }}>
            {product.rating} ({product.reviewCount})
          </Box>
        </Box>
        <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '12px', color: 'rgba(23,23,23,0.6)', mb: 0.3 }}>
          대여기간 {product.rentalPeriod} · {product.sizes.join(' / ')}
        </Box>
        <Box sx={{ fontFamily: FONTS.pretendard, fontWeight: 700, fontSize: '15px', color: accentColor }}>
          {product.price.toLocaleString()}원
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
