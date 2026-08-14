import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(false);
  const wornImage = product.images[1] || product.images[0];
  const showActions = product.contentKey === 'hanbok' || product.contentKey === 'world';
  const countryFlags = { 일본: '🇯🇵', 중국: '🇨🇳', 베트남: '🇻🇳', 태국: '🇹🇭' };
  const countryFlag = product.contentKey === 'world' ? countryFlags[product.category] : null;

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
        {showActions && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 0.7,
            }}
          >
            {countryFlag && (
              <Box
                aria-label={`${product.category} 국기`}
                title={`${product.category} 상품`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 0.9,
                  py: 0.35,
                  bgcolor: 'rgba(255,255,255,0.96)',
                  border: `2px solid ${accentColor}`,
                  borderRadius: '999px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
                  fontFamily: FONTS.pretendard,
                  lineHeight: 1,
                }}
              >
                <Box component="span" sx={{ fontSize: { xs: 18, sm: 21 } }}>{countryFlag}</Box>
                <Box component="span" sx={{ fontSize: '10px', fontWeight: 900, color: COLORS.black }}>
                  {product.category}
                </Box>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 0.25,
                p: 0.35,
                bgcolor: 'rgba(255,255,255,0.94)',
                borderRadius: '999px',
                boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
              }}
            >
              <Tooltip title={liked ? '좋아요 취소' : '좋아요'}>
                <IconButton
                  size="small"
                  aria-label={liked ? '좋아요 취소' : '좋아요'}
                  onClick={(event) => {
                    event.stopPropagation();
                    setLiked((value) => !value);
                  }}
                  sx={{ color: liked ? '#db3340' : COLORS.black }}
                >
                  {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title={inCart ? '장바구니에서 빼기' : '장바구니 담기'}>
                <IconButton
                  size="small"
                  aria-label={inCart ? '장바구니에서 빼기' : '장바구니 담기'}
                  onClick={(event) => {
                    event.stopPropagation();
                    setInCart((value) => !value);
                  }}
                  sx={{ color: inCart ? accentColor : COLORS.black }}
                >
                  {inCart ? <ShoppingCartIcon fontSize="small" /> : <ShoppingCartOutlinedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
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
