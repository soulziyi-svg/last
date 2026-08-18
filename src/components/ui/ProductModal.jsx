import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { COLORS, FONTS } from '../../theme/tokens';
import { useStore } from '../../store/StoreContext';

/**
 * ProductModal 컴포넌트
 * 상품 상세 팝업 (1000x800, 좌 30% 정보 / 우 60% 이미지+썸네일)
 *
 * @param {object} product - 상품 데이터 [Required]
 * @param {boolean} open - 모달 노출 여부 [Required]
 * @param {function} onClose - 닫기 핸들러 [Required]
 * @param {string} accentColor - 컨텐츠 테마 강조색 [Required]
 *
 * Example usage:
 * <ProductModal product={product} open={open} onClose={handleClose} accentColor={COLORS.pink} />
 */
function ProductModal({ product, open, onClose, accentColor }) {
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart, cart } = useStore();

  useEffect(() => {
    if (open) {
      setActiveImg(0);
    }
  }, [open, product]);

  if (!product) return null;

  const thumbs = [...product.images, ...product.accessories.map((a) => a.src)].slice(0, 5);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', md: '1000px' },
          height: { xs: '86vh', md: '800px' },
          maxWidth: '96vw',
          maxHeight: '92vh',
          bgcolor: COLORS.white,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={onClose}
          aria-label="닫기"
          sx={{
            all: 'unset',
            cursor: 'pointer',
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 5,
            color: COLORS.black,
          }}
        >
          <CloseIcon />
        </Box>

        {/* left 30% info */}
        <Box
          sx={{
            width: { xs: '100%', md: '30%' },
            p: { xs: 3, md: 4 },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '22px', color: COLORS.black }}>
            {product.name}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Rating value={product.rating} precision={0.5} size="small" readOnly />
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '12px', color: 'rgba(23,23,23,0.55)' }}>
              {product.rating} ({product.reviewCount})
            </Box>
          </Box>

          <Box>
            <Box sx={{ fontFamily: FONTS.doHyeon, fontSize: '14px', color: accentColor, mb: 0.5 }}>
              역사와 배경
            </Box>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px', lineHeight: 1.7, color: 'rgba(23,23,23,0.8)' }}>
              {product.history}
            </Box>
          </Box>

          <Box>
            <Box sx={{ fontFamily: FONTS.doHyeon, fontSize: '14px', color: accentColor, mb: 0.5 }}>
              사이즈
            </Box>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px' }}>
              {product.sizes.join(' / ')}
            </Box>
          </Box>

          <Box>
            <Box sx={{ fontFamily: FONTS.doHyeon, fontSize: '14px', color: accentColor, mb: 0.5 }}>
              구성품
            </Box>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px' }}>
              {product.composition}
            </Box>
          </Box>

          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(23,23,23,0.1)' }}>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '12px', color: 'rgba(23,23,23,0.6)' }}>
              대여기간 {product.rentalPeriod}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
              <Box sx={{ fontFamily: FONTS.pretendard, fontWeight: 700, fontSize: '22px', color: COLORS.black }}>
                {product.price.toLocaleString()}원
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => addToCart(product)}
                aria-label="장바구니 담기"
                sx={{ cursor: 'pointer', color: COLORS.white, display: 'flex', alignItems: 'center', gap: 1, border: 0, bgcolor: accentColor, px: 2, py: 1, fontWeight: 800 }}
              >
                <ShoppingCartOutlinedIcon /> {cart.some((item) => item.id === product.id) ? '담긴 상품' : '장바구니'}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* right 60% images */}
        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            ml: { md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#F7F5F0',
            p: { xs: 2, md: 3 },
          }}
        >
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Box
              component="img"
              src={thumbs[activeImg]}
              alt={product.name}
              sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
            {thumbs.map((src, i) => (
              <Box
                key={src}
                component="button"
                type="button"
                onClick={() => setActiveImg(i)}
                sx={{
                  all: 'unset',
                  cursor: 'pointer',
                  width: 64,
                  height: 64,
                  overflow: 'hidden',
                  outline: i === activeImg ? `2px solid ${accentColor}` : '1px solid rgba(23,23,23,0.15)',
                }}
              >
                <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ProductModal;
