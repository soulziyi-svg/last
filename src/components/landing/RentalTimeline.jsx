import Box from '@mui/material/Box';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { COLORS, FONTS } from '../../theme/tokens';
import { RENTAL_TIMELINE } from '../../data/bannerData';

const ICONS = [CheckroomIcon, EventAvailableIcon, LocalShippingIcon, EmojiEmotionsIcon, AssignmentReturnIcon];

/**
 * RentalTimeline 컴포넌트
 * 메인 슬로건 + 대여 5단계 타임라인
 *
 * Example usage:
 * <RentalTimeline />
 */
function RentalTimeline() {
  return (
    <Box component="section" sx={{ width: '100%', bgcolor: COLORS.white, pb: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          textAlign: 'center',
          fontFamily: FONTS.blackHan,
          fontSize: { xs: '22px', md: '30px' },
          color: COLORS.black,
          mb: { xs: 5, md: 8 },
        }}
      >
        하루를 빌리고, 추억은 가져가세요
      </Box>

      <Box
        sx={{
          width: '90%',
          mx: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 4, md: 2 },
        }}
      >
        {RENTAL_TIMELINE.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <Box
              key={item.step}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: { xs: '120px', md: '160px' },
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: `2px solid ${COLORS.purple}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.purple,
                    mb: 1.5,
                  }}
                >
                  <Icon fontSize="medium" />
                </Box>
                <Box
                  sx={{
                    fontFamily: FONTS.doHyeon,
                    fontSize: '12px',
                    color: COLORS.purple,
                    mb: 0.5,
                  }}
                >
                  {item.step}
                </Box>
                <Box
                  sx={{
                    fontFamily: FONTS.gmarket,
                    fontSize: '15px',
                    color: COLORS.black,
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Box>
                <Box
                  sx={{
                    fontFamily: FONTS.pretendard,
                    fontSize: '12px',
                    color: 'rgba(23,23,23,0.6)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </Box>
              </Box>
              {i < RENTAL_TIMELINE.length - 1 && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    width: '32px',
                    height: '2px',
                    bgcolor: 'rgba(23,23,23,0.15)',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default RentalTimeline;
