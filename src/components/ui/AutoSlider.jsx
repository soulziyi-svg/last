import { useState } from 'react';
import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';

function SliderCard({ product, onOpen, onHoverChange }) {
  const [hover, setHover] = useState(false);

  return (
    <Box
      onMouseEnter={() => {
        setHover(true);
        onHoverChange(true);
      }}
      onMouseLeave={() => {
        setHover(false);
        onHoverChange(false);
      }}
      onClick={() => onOpen(product)}
      sx={{
        position: 'relative',
        width: { xs: '165px', sm: '200px', md: '245px' },
        flexShrink: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: COLORS.white,
      }}
    >
      <Box
        component="img"
        src={product.thumbnail}
        alt={product.name}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transition: 'transform 0.35s ease',
          transform: hover ? 'scale(1.05)' : 'scale(1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 2,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '18px', color: COLORS.white, mb: 0.5 }}>
          {product.name}
        </Box>
        <Box
          sx={{
            fontFamily: FONTS.pretendard,
            fontSize: '10px',
            color: 'rgba(255,255,255,0.85)',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.history}
        </Box>
        <Box sx={{ fontFamily: FONTS.pretendard, fontWeight: 700, fontSize: '13px', color: '#E23B3B' }}>
          자세히 보기 →
        </Box>
      </Box>
    </Box>
  );
}

/**
 * AutoSlider 컴포넌트
 * 카드형 자동 슬라이더 (500x700 비율). hover 시 정지 + 상세보기 오버레이 노출.
 *
 * @param {Array} products - 슬라이더에 노출할 상품 배열 [Required]
 * @param {function} onOpen - 카드 클릭 시 실행 [Required]
 *
 * Example usage:
 * <AutoSlider products={products} onOpen={handleOpen} />
 */
function AutoSlider({ products, onOpen }) {
  const [paused, setPaused] = useState(false);
  const loop = [...products, ...products];
  const duration = products.length * 4.5;

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          gap: { xs: '14px', md: '20px' },
          animation: `marquee-scroll ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {loop.map((product, i) => (
          <SliderCard
            key={`${product.id}-${i}`}
            product={product}
            onOpen={onOpen}
            onHoverChange={setPaused}
          />
        ))}
      </Box>
    </Box>
  );
}

export default AutoSlider;
