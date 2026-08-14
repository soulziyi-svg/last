import Box from '@mui/material/Box';
import { COLORS } from '../../theme/tokens';

/**
 * ContentSectionHeader 컴포넌트
 * 콘텐츠 섹션 공통 상단 (로고 + 타이틀 + 설명), 가운데 정렬
 *
 * @param {string} logo - 섹션 로고 이미지 경로 [Required]
 * @param {string} title - 섹션 타이틀 [Required]
 * @param {string} desc - 상세설명 (2줄) [Required]
 * @param {string} titleFont - 타이틀 폰트 패밀리 [Required]
 * @param {string} accentColor - 컨텐츠 테마 강조색 [Required]
 * @param {string|object} logoHeight - 로고 높이 [Optional, 기본값: '60px']
 * @param {string|object} titleSize - 타이틀 폰트 크기 [Optional, 기본값: { xs: '26px', md: '40px' }]
 * @param {string|object} descSize - 설명 폰트 크기 [Optional, 기본값: { xs: '14px', md: '20px' }]
 *
 * Example usage:
 * <ContentSectionHeader logo={logo} title={title} desc={desc} titleFont={FONTS.doHyeon} accentColor={COLORS.pink} />
 */
function ContentSectionHeader({
  logo,
  title,
  desc,
  titleFont,
  accentColor,
  logoHeight = '60px',
  titleSize = { xs: '26px', md: '40px' },
  descSize = { xs: '14px', md: '20px' },
}) {
  return (
    <Box sx={{ textAlign: 'center', maxWidth: '820px', mx: 'auto', px: 2 }}>
      <Box component="img" src={logo} alt={title} sx={{ height: logoHeight, width: 'auto', mx: 'auto', mb: 3 }} />
      <Box
        sx={{
          fontFamily: titleFont,
          fontSize: titleSize,
          color: COLORS.black,
          mb: 2,
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: descSize,
          lineHeight: 1.6,
          color: 'rgba(23,23,23,0.72)',
        }}
      >
        {desc}
      </Box>
      <Box sx={{ width: '48px', height: '3px', bgcolor: accentColor, mx: 'auto', mt: 3 }} />
    </Box>
  );
}

export default ContentSectionHeader;
