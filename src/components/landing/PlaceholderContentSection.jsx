import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';
import ContentSectionHeader from './ContentSectionHeader';

/**
 * PlaceholderContentSection 컴포넌트
 * 이미지 자산이 아직 없는 콘텐츠(각 나라 전통의상 / 코스프레 / 공연의상) 섹션.
 * 실제 상품 이미지 대신 컬러 플레이스홀더 카드로 구성되며, 자산이 준비되면 교체된다.
 *
 * @param {string} id - 섹션 anchor id [Required]
 * @param {string} logo - 섹션 로고 이미지 [Required]
 * @param {string} title - 섹션 타이틀 [Required]
 * @param {string} desc - 섹션 설명 [Required]
 * @param {string} titleFont - 타이틀 폰트 [Required]
 * @param {string} accentColor - 테마 강조색 [Required]
 * @param {string} bgColor - 섹션 배경색 [Required]
 * @param {Array} groups - [{ title, items: string[] }] [Required]
 *
 * Example usage:
 * <PlaceholderContentSection id="content-world" logo={logo} title={title} desc={desc}
 *   titleFont={FONTS.paperlogy} accentColor={COLORS.yellow} bgColor="#FFF7DE" groups={WORLD_MENU} />
 */
function PlaceholderContentSection({ id, logo, title, desc, titleFont, accentColor, bgColor, groups }) {
  const cards = groups.flatMap((g) => g.items.map((item) => ({ group: g.title, name: item })));
  const preview = cards.slice(0, 18);
  const remaining = cards.length - preview.length;

  return (
    <Box id={id} component="section" sx={{ width: '100%', bgcolor: bgColor, py: { xs: 8, md: 12 } }}>
      <ContentSectionHeader logo={logo} title={title} desc={desc} titleFont={titleFont} accentColor={accentColor} />

      <Box
        sx={{
          width: '90%',
          maxWidth: '1400px',
          mx: 'auto',
          mt: { xs: 6, md: 8 },
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: FONTS.pretendard,
          fontSize: '13px',
          color: COLORS.black,
          bgcolor: 'rgba(23,23,23,0.06)',
          px: 2,
          py: 1,
        }}
      >
        📦 이미지 촬영 준비 중 — 곧 실제 상품 사진으로 만나보실 수 있어요.
      </Box>

      <Box
        sx={{
          width: '90%',
          maxWidth: '1400px',
          mx: 'auto',
          mt: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        {preview.map((card) => (
          <Box key={`${card.group}-${card.name}`} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                width: '100%',
                aspectRatio: '3 / 4',
                bgcolor: COLORS.white,
                border: `1px dashed ${accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 1.5,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  fontFamily: FONTS.pretendard,
                  fontSize: '10px',
                  color: COLORS.white,
                  bgcolor: accentColor,
                  px: '6px',
                  py: '2px',
                }}
              >
                준비중
              </Box>
              <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '14px', color: COLORS.black }}>{card.name}</Box>
            </Box>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '11px', color: 'rgba(23,23,23,0.55)', mt: 0.8 }}>
              {card.group}
            </Box>
          </Box>
        ))}
      </Box>

      {remaining > 0 && (
        <Box
          sx={{
            textAlign: 'center',
            mt: 4,
            fontFamily: FONTS.pretendard,
            fontSize: '13px',
            color: 'rgba(23,23,23,0.6)',
          }}
        >
          + {remaining}개 상품 추가 준비 중
        </Box>
      )}
    </Box>
  );
}

export default PlaceholderContentSection;
