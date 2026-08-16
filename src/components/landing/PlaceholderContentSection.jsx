import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';
import ContentSectionHeader from './ContentSectionHeader';

function PlaceholderContentSection({ id, logo, title, desc, titleFont, accentColor, bgColor, groups, images = [] }) {
  const cards = groups.flatMap((group) =>
    group.items.map((name) => ({ group: group.title, name }))
  );
  const preview = cards.slice(0, 18).map((card, index) => ({ ...card, image: images[index] }));
  const remaining = cards.length - preview.length;

  return (
    <Box id={id} component="section" sx={{ width: '100%', bgcolor: bgColor, py: { xs: 8, md: 12 } }}>
      <ContentSectionHeader
        logo={logo}
        title={title}
        desc={desc}
        titleFont={titleFont}
        accentColor={accentColor}
        logoHeight="120px"
        titleSize={{ xs: '22px', md: '30px' }}
        descSize={{ xs: '13px', md: '15px' }}
      />

      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            width: 'fit-content',
            mx: 'auto',
            px: { xs: 3, md: 4 },
            py: { xs: 1, md: 1.2 },
            position: 'relative',
            fontFamily: FONTS.pretendard,
            fontWeight: 800,
            fontSize: { xs: '20px', md: '28px' },
            letterSpacing: '0.08em',
            color: COLORS.white,
            bgcolor: accentColor,
            border: '1px solid rgba(255,255,255,0.75)',
            borderRadius: '999px',
            boxShadow: '0 8px 22px rgba(23,23,23,0.18)',
            mb: { xs: 4, md: 5 },
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: { xs: '34px', md: '64px' },
              height: '1px',
              bgcolor: accentColor,
            },
            '&::before': { right: 'calc(100% + 12px)' },
            '&::after': { left: 'calc(100% + 12px)' },
          }}
        >
          인기 상품
        </Box>

        <Box
          sx={{
            width: '90%',
            maxWidth: '1800px',
            mx: 'auto',
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
              {card.image ? (
                <Box
                  component="img"
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    bgcolor: COLORS.white,
                    border: `1px solid ${accentColor}33`,
                    boxShadow: '0 8px 24px rgba(23,23,23,0.08)',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    minHeight: { xs: '180px', md: '260px' },
                    bgcolor: COLORS.white,
                    border: `1px solid ${accentColor}33`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 2,
                    boxShadow: '0 8px 24px rgba(23,23,23,0.06)',
                  }}
                >
                  <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '14px', lineHeight: 1.5, color: COLORS.black }}>
                    {card.name}
                  </Box>
                  <Box sx={{ mt: 1.2, fontFamily: FONTS.pretendard, fontSize: '11px', color: accentColor }}>
                    상품 이미지 준비 중
                  </Box>
                </Box>
              )}
              {card.image && (
                <Box sx={{ fontFamily: FONTS.gmarket, fontSize: '13px', lineHeight: 1.45, color: COLORS.black, mt: 1.2 }}>
                  {card.name}
                </Box>
              )}
              <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '11px', color: 'rgba(23,23,23,0.58)', mt: 1 }}>
                {card.group}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {remaining > 0 && (
        <Box sx={{ textAlign: 'center', mt: 5, fontFamily: FONTS.pretendard, fontSize: '13px', color: 'rgba(23,23,23,0.62)' }}>
          + {remaining}개 상품 추가 준비 중
        </Box>
      )}
    </Box>
  );
}

export default PlaceholderContentSection;
