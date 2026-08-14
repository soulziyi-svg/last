import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';

/**
 * MegaMenu 컴포넌트
 * 헤더 카테고리 hover 시 노출되는 메가메뉴 패널
 *
 * @param {Array} columns - [{ title: string, items: [{ label, onClick }] }] [Required]
 * @param {boolean} isOpen - 패널 노출 여부 [Required]
 *
 * Example usage:
 * <MegaMenu columns={columns} isOpen={isOpen} />
 */
function MegaMenu({ columns, isOpen, isScrolled = false, onMouseLeave }) {
  if (!isOpen) return null;

  return (
    <Box
      onMouseLeave={onMouseLeave}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        bgcolor: COLORS.white,
        borderTop: `1px solid ${COLORS.black}`,
        borderBottom: `1px solid rgba(23,23,23,0.15)`,
        animation: 'slide-down 0.2s ease',
        zIndex: 30,
        maxHeight: isScrolled ? 'calc(100vh - 110px)' : 'calc(100vh - 210px)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px 40px',
          px: { xs: 3, md: 6 },
          py: 4,
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {columns.map((col) => (
          <Box key={col.title} sx={{ minWidth: '120px' }}>
            <Box
              sx={{
                fontFamily: FONTS.gmarket,
                fontSize: '15px',
                color: COLORS.black,
                whiteSpace: 'nowrap',
                pb: 1.2,
                mb: 1.2,
                borderBottom: `2px solid ${COLORS.black}`,
              }}
            >
              {col.title}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {col.items.map((item) => (
                <Box
                  key={item.label}
                  component="button"
                  type="button"
                  onClick={item.onClick}
                  sx={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontFamily: FONTS.pretendard,
                    fontSize: '13px',
                    color: COLORS.black,
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s ease, transform 0.15s ease',
                    transformOrigin: 'left center',
                    '&:hover': {
                      color: '#E23B3B',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MegaMenu;
