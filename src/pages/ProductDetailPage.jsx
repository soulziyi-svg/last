import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { COLORS, FONTS, CONTENT_THEME } from '../theme/tokens';
import { hanbokProducts } from '../data/hanbokProducts';
import { worldProducts } from '../data/worldProducts';
import { cosplayProducts } from '../data/cosplayProducts';
import { stageProducts } from '../data/stageProducts';
import useManagedProducts from '../hooks/useManagedProducts';

const ALL_PRODUCTS = [...hanbokProducts, ...worldProducts, ...cosplayProducts, ...stageProducts];
import Footer from '../components/common/Footer';
import { asset } from '../utils/asset';

const BRAND_LOGO = asset('/img/콘텐츠1/전통한복/logo02.png');

/**
 * ProductDetailPage 컴포넌트
 * 서브메뉴 상품 그리드에서 새창으로 열리는 상품 상세 페이지
 *
 * Example usage:
 * <Route path="/product/:id" element={<ProductDetailPage />} />
 */
function ProductDetailPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  const products = useManagedProducts(ALL_PRODUCTS);
  const product = products.find((item) => item.id === decodedId);
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const accent = product ? (CONTENT_THEME[product.contentKey]?.accent || CONTENT_THEME.hanbok.accent) : CONTENT_THEME.hanbok.accent;

  if (!product) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', fontFamily: FONTS.pretendard }}>
        상품을 찾을 수 없습니다. <Link to="/">홈으로 돌아가기</Link>
      </Box>
    );
  }

  const thumbs = [...product.images, ...product.accessories.map((a) => a.src)].slice(0, 5);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: COLORS.white, display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid rgba(23,23,23,0.08)',
          py: 2,
          px: { xs: 3, md: 6 },
        }}
      >
        <Link to="/">
          <Box component="img" src={BRAND_LOGO} alt="입어봄 IBUBOM" sx={{ height: '40px', width: 'auto' }} />
        </Link>
      </Box>

      <Box
        sx={{
          flex: 1,
          width: '90%',
          maxWidth: '1200px',
          mx: 'auto',
          py: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '55%' } }}>
          <Box sx={{ width: '100%', aspectRatio: '4 / 5', bgcolor: '#F7F5F0', overflow: 'hidden', mb: 2 }}>
            <Box component="img" src={thumbs[activeImg]} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {thumbs.map((src, i) => (
              <Box
                key={src}
                component="button"
                type="button"
                onClick={() => setActiveImg(i)}
                sx={{
                  all: 'unset',
                  cursor: 'pointer',
                  width: 72,
                  height: 72,
                  overflow: 'hidden',
                  outline: i === activeImg ? `2px solid ${accent}` : '1px solid rgba(23,23,23,0.15)',
                }}
              >
                <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '45%' } }}>
          <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px', color: accent, mb: 1 }}>
            {{ hanbok: '전통한복', world: '세계 전통의상', cosplay: '코스프레', stage: '공연의상' }[product.contentKey]} · {product.category}
          </Box>
          <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '30px', color: COLORS.black, mb: 1.5 }}>
            {product.name}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 3 }}>
            <Rating value={product.rating} precision={0.5} size="small" readOnly />
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px', color: 'rgba(23,23,23,0.55)' }}>
              {product.rating} ({product.reviewCount}개 후기)
            </Box>
          </Box>

          <Box sx={{ fontFamily: FONTS.pretendard, fontWeight: 700, fontSize: '28px', color: COLORS.black, mb: 3 }}>
            {product.price.toLocaleString()}원
            <Box component="span" sx={{ fontSize: '14px', fontWeight: 400, color: 'rgba(23,23,23,0.55)', ml: 1 }}>
              / {product.rentalPeriod}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ fontFamily: FONTS.doHyeon, fontSize: '15px', color: accent, mb: 0.8 }}>역사와 배경</Box>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '14px', lineHeight: 1.8, color: 'rgba(23,23,23,0.8)' }}>
              {product.history}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 6, mb: 4 }}>
            <Box>
              <Box sx={{ fontFamily: FONTS.doHyeon, fontSize: '15px', color: accent, mb: 0.8 }}>사이즈</Box>
              <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '14px' }}>{product.sizes.join(' / ')}</Box>
            </Box>
            <Box>
              <Box sx={{ fontFamily: FONTS.doHyeon, fontSize: '15px', color: accent, mb: 0.8 }}>구성품</Box>
              <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '14px' }}>{product.composition}</Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              component="button"
              type="button"
              sx={{
                flex: 1,
                py: 1.6,
                bgcolor: COLORS.black,
                color: COLORS.white,
                fontFamily: FONTS.gmarket,
                fontSize: '15px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              대여 신청하기
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => setWished((w) => !w)}
              aria-label="찜하기"
              sx={{
                width: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${accent}`,
                color: accent,
                bgcolor: 'transparent',
                cursor: 'pointer',
              }}
            >
              {wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

export default ProductDetailPage;
