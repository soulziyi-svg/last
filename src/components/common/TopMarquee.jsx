import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';
import { TOP_MARQUEE_ITEMS } from '../../data/menuData';

/**
 * TopMarquee 컴포넌트
 * 헤더 최상단 20pt 블랙 배경 / 화이트 텍스트 무한 롤링 배너
 *
 * Example usage:
 * <TopMarquee />
 */
function TopMarquee() {
  const loopItems = [...TOP_MARQUEE_ITEMS, ...TOP_MARQUEE_ITEMS];

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: COLORS.black,
        color: COLORS.white,
        overflow: 'hidden',
        py: '6px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee-scroll 32s linear infinite',
        }}
      >
        {loopItems.map((text, i) => (
          <Box
            key={i}
            component="span"
            sx={{
              fontFamily: FONTS.pretendard,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              px: 3,
              display: 'inline-flex',
              alignItems: 'center',
              '&::after': {
                content: '"●"',
                ml: 3,
                fontSize: '6px',
                color: COLORS.pink,
                verticalAlign: 'middle',
              },
            }}
          >
            {text}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TopMarquee;
