import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { COLORS, FONTS } from '../../theme/tokens';

/**
 * ReviewSection 컴포넌트
 * 실 착용 사진 인증 후기 섹션
 *
 * @param {string} title - 섹션 타이틀 [Optional, 기본값: '진짜로 입어봄']
 * @param {Array} reviews - 후기 데이터 배열 [Required]
 * @param {string} bgcolor - 섹션 배경색 [Optional, 기본값: white]
 *
 * Example usage:
 * <ReviewSection reviews={HANBOK_REVIEWS} />
 */
function ReviewSection({ title = '진짜로 입어봄', reviews, bgcolor = COLORS.white }) {
  return (
    <Box component="section" sx={{ width: '100%', bgcolor, py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          textAlign: 'center',
          fontFamily: FONTS.gmarket,
          fontSize: { xs: '20px', md: '30px' },
          color: COLORS.black,
          mb: { xs: 4, md: 6 },
        }}
      >
        {title}
      </Box>

      <Box
        sx={{
          width: '90%',
          maxWidth: '1800px',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: 2, lg: 1.5 },
        }}
      >
        {reviews.map((r) => (
          <Box key={r.id} sx={{ display: 'flex', flexDirection: 'column', border: '1px solid rgba(23,23,23,0.08)' }}>
            <Box sx={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden' }}>
              <Box component="img" src={r.photo} alt={r.product} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '13px', color: COLORS.black }}>{r.nickname}</Box>
                <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '11px', color: 'rgba(23,23,23,0.5)' }}>{r.date}</Box>
              </Box>
              <Rating value={r.rating} precision={0.5} size="small" readOnly sx={{ mb: 1 }} />
              <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px', lineHeight: 1.6, color: 'rgba(23,23,23,0.85)', mb: 1 }}>
                {r.text}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {r.tags.map((t) => (
                  <Box key={t} sx={{ fontFamily: FONTS.pretendard, fontSize: '11px', color: COLORS.purple }}>
                    {t}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ReviewSection;
