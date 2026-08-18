import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { COLORS } from '../../theme/tokens';
import { MAIN_BANNERS } from '../../data/bannerData';

const AUTO_PLAY_MS = 4500;

/**
 * HeroBanner 컴포넌트
 * 메인페이지 좌우 양방향 무한루프 슬라이더 (10% - 80% - 10% 레이아웃)
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

  const prevIdx = (index - 1 + total) % total;
  const nextIdx = (index + 1) % total;

  const Slide = ({ item, variant = 'main', direction, onClick }) => (
    <Box
      component={variant === 'side' ? 'button' : 'div'}
      type={variant === 'side' ? 'button' : undefined}
      aria-label={variant === 'side' ? `${direction === 'left' ? '이전' : '다음'} 배너 보기` : undefined}
      onClick={onClick}
      sx={{
        ...(variant === 'side' && { all: 'unset', cursor: 'pointer' }),
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
          objectFit: 'cover',
          objectPosition:
            variant === 'main' ? 'center' : direction === 'left' ? 'right center' : 'left center',
          transform: variant === 'main' ? 'scale(1)' : 'scale(1.06)',
          filter: variant === 'main' ? 'none' : 'brightness(0.52) blur(2px)',
          transition: 'transform 0.3s ease, filter 0.3s ease',
        }}
      />
      {variant === 'side' && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(23,23,23,0.18)',
            transition: 'background-color 0.3s ease',
          }}
        />
      )}
    </Box>
  );

  return (
    <Box
      component="section"
      sx={{ width: '100%', bgcolor: COLORS.white, pt: { xs: '100px', md: '212px' }, pb: { xs: 2, md: 6 } }}
    >
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          display: 'flex',
          alignItems: 'stretch',
          position: 'relative',
          height: { xs: 'clamp(210px, 58vw, 330px)', sm: '380px', md: '520px' },
        }}
      >
        <Box
          sx={{
            width: '10%',
            height: '80%',
            alignSelf: 'center',
            display: { xs: 'none', md: 'block' },
            '&:hover img': { filter: 'brightness(0.78) blur(0)', transform: 'scale(1.1)' },
            '&:hover > button > div': { bgcolor: 'rgba(23,23,23,0.05)' },
          }}
        >
          <Slide item={MAIN_BANNERS[prevIdx]} variant="side" direction="left" onClick={() => go(-1)} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '80%' }, height: '100%', position: 'relative' }}>
          <Slide item={MAIN_BANNERS[index]} variant="main" />

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
              width: { xs: 34, md: 40 },
              height: { xs: 34, md: 40 },
              borderRadius: '50%',
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
              width: { xs: 34, md: 40 },
              height: { xs: 34, md: 40 },
              borderRadius: '50%',
              zIndex: 5,
            }}
          >
            <ChevronRightIcon />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: { xs: 14, md: 20 },
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              zIndex: 6,
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
                  width: i === index ? '12px' : '8px',
                  height: i === index ? '12px' : '8px',
                  borderRadius: '50%',
                  bgcolor: i === index ? COLORS.white : 'rgba(255,255,255,0.55)',
                  border: i === index ? '2px solid rgba(23,23,23,0.45)' : '1px solid rgba(23,23,23,0.25)',
                  boxShadow: '0 2px 8px rgba(23,23,23,0.3)',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            width: '10%',
            height: '80%',
            alignSelf: 'center',
            display: { xs: 'none', md: 'block' },
            '&:hover img': { filter: 'brightness(0.78) blur(0)', transform: 'scale(1.1)' },
            '&:hover > button > div': { bgcolor: 'rgba(23,23,23,0.05)' },
          }}
        >
          <Slide item={MAIN_BANNERS[nextIdx]} variant="side" direction="right" onClick={() => go(1)} />
        </Box>
      </Box>

    </Box>
  );
}

export default HeroBanner;
