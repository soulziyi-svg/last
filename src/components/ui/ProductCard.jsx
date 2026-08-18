import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { COLORS, FONTS } from '../../theme/tokens';
import { asset } from '../../utils/asset';
import { useStore } from '../../store/StoreContext';

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
  const { cart, addToCart } = useStore();
  const inCart = cart.some((item) => item.id === product.id);
  const wornImage = product.images[1] || product.images[0];
  const countryFlags = {
    일본: asset('/img/flags/japan.svg'),
    중국: asset('/img/flags/china.svg'),
    베트남: asset('/img/flags/vietnam.svg'),
    태국: asset('/img/flags/thailand.svg'),
  };
  const countryFlag = product.contentKey === 'world' ? countryFlags[product.category] : null;
  const showActions = true;
  const showDetailedDescription = true;
  const cardDescription = showDetailedDescription
    ? product.history || product.description || product.shortDesc
    : product.shortDesc;

  const stopCardAction = (event, action) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  return (
    <Box
      component="article"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(product)}
      onKeyDown={(event) => {
        if (event.currentTarget === event.target && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onOpen(product);
        }
      }}
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
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', bgcolor: COLORS.white }}>
        <Box
          component="img"
          src={product.thumbnail}
          alt={product.name}
          sx={{ width: '100%', height: 'auto', display: 'block', opacity: hover ? 0 : 1, transition: 'opacity 0.2s ease' }}
        />
        <Box
          component="img"
          src={wornImage}
          alt={`${product.name} 착용 이미지`}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
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
        {countryFlag && (
          <Box
            aria-label={`${product.category} 국기`}
            title={`${product.category} 상품`}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              width: { xs: 25, sm: 29 },
              height: { xs: 18, sm: 20 },
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.96)',
              border: '2px solid #fff',
              borderRadius: '5px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
            }}
          >
            <Box component="img" src={countryFlag} alt={`${product.category} 국기`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Box>
        )}
        {product.contentKey === 'hanbok' && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 4,
              px: { xs: 1, sm: 1.2 },
              py: 0.45,
              bgcolor: 'rgba(255,255,255,0.94)',
              color: accentColor,
              border: `1.5px solid ${accentColor}`,
              borderRadius: '999px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
              fontFamily: FONTS.pretendard,
              fontWeight: 800,
              fontSize: { xs: '10px', sm: '11px' },
              lineHeight: 1.2,
            }}
          >
            {product.category}
          </Box>
        )}
        {showActions && (
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              zIndex: 5,
              display: 'flex',
              gap: 0.6,
            }}
          >
            <IconButton
              aria-label={inCart ? '장바구니에 담긴 상품' : '장바구니 담기'}
              onClick={(event) => stopCardAction(event, () => addToCart(product))}
              sx={{ width: 34, height: 34, bgcolor: inCart ? accentColor : 'rgba(255,255,255,0.94)', color: inCart ? COLORS.white : COLORS.black, boxShadow: '0 3px 12px rgba(0,0,0,0.2)', '&:hover': { bgcolor: inCart ? accentColor : COLORS.white } }}
            >
              <ShoppingCartOutlinedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{ pt: 1.2 }}>
        <Box
          sx={{
            fontFamily: FONTS.gmarket,
            fontSize: { xs: '16px', sm: '14px' },
            color: COLORS.black,
            mb: 0.5,
          }}
        >
          {product.name}
        </Box>
        {cardDescription && (
          <Box
            sx={{
              fontFamily: FONTS.pretendard,
              fontSize: '11px',
              color: 'rgba(23,23,23,0.55)',
              mb: 0.6,
              lineHeight: 1.55,
              ...(showDetailedDescription && {
                minHeight: '4.65em',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
              }),
            }}
          >
            {cardDescription}
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
