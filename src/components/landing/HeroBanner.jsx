import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { COLORS } from '../../theme/tokens';
import { MAIN_BANNERS } from '../../data/bannerData';

const AUTO_PLAY_MS = 4500;

/**
 * HeroBanner 컴포넌트
 * 메인페이지 양방향 무한루프 슬라이더
 *
 * Example usage:
 * <HeroBanner />
 */
function HeroBanner() {
  const total = MAIN_BANNERS.length;
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const go = (delta) => {
    setIndex((prev) => (prev + delta + total) % total);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), AUTO_PLAY_MS);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const Slide = ({ item }) => (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={item.src}
        alt={item.alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />
    </Box>
  );

  return (
    <Box
      component="section"
      sx={{ width: '100%', bgcolor: COLORS.white, pt: { xs: '190px', md: '212px' }, pb: { xs: 4, md: 6 } }}
    >
      <Box
        sx={{
          width: '90%',
          mx: 'auto',
          display: 'flex',
          alignItems: 'stretch',
          position: 'relative',
          height: { xs: '260px', sm: '360px', md: '520px' },
        }}
      >
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
          <Slide item={MAIN_BANNERS[index]} />

          <Box
            component="button"
            type="button"
            aria-label="이전 배너"
            onClick={() => go(-1)}
            sx={{
              all: 'unset',
              cursor: 'pointer',
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: COLORS.white,
              bgcolor: 'rgba(23,23,23,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              zIndex: 5,
            }}
          >
            <ChevronLeftIcon />
          </Box>
          <Box
            component="button"
            type="button"
            aria-label="다음 배너"
            onClick={() => go(1)}
            sx={{
              all: 'unset',
              cursor: 'pointer',
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: COLORS.white,
              bgcolor: 'rgba(23,23,23,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              zIndex: 5,
            }}
          >
            <ChevronRightIcon />
          </Box>
        </Box>
      </Box>

      {/* progress bar nav */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          mt: 3,
        }}
      >
        {MAIN_BANNERS.map((item, i) => (
          <Box
            key={item.id}
            component="button"
            type="button"
            aria-label={`배너 ${i + 1}로 이동`}
            onClick={() => setIndex(i)}
            sx={{
              all: 'unset',
              cursor: 'pointer',
              width: i === index ? '32px' : '10px',
              height: '4px',
              bgcolor: i === index ? COLORS.purple : 'rgba(23,23,23,0.2)',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default HeroBanner;
