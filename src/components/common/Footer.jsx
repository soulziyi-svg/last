import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';
import { asset } from '../../utils/asset';

const FOOTER_LINKS = ['이용약관', '개인정보처리방침', '대여안내', '자주묻는질문', '제휴문의'];

/**
 * Footer 컴포넌트
 * 브랜드 정보 / 링크 / 카피라이트로 구성된 블랙 배경 푸터
 *
 * Example usage:
 * <Footer />
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: COLORS.black,
        color: 'rgba(255,253,248,0.72)',
        pt: { xs: 6, md: 8 },
        pb: 4,
        px: { xs: 3, md: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: { xs: 4, md: 6 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ maxWidth: '420px' }}>
          <Box
            component="img"
            src={asset('/img/콘텐츠1/전통한복/01.png')}
            alt="입어봄 IBUBOM"
            sx={{ height: '54px', width: 'auto', mb: 2 }}
          />
          <Box
            sx={{
              fontFamily: FONTS.doHyeon,
              fontSize: '15px',
              color: COLORS.white,
              mb: 1,
            }}
          >
            다른 사람이 되어 하루를 빌린다. 새로운 경험을 하다.
          </Box>
          <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px', lineHeight: 1.8 }}>
            오늘만큼은 뭐든지 되어볼 수 있다 — 입어봄은 한 번뿐인 특별한 하루를 위한
            의상 대여 플랫폼입니다.
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 4, md: 10 }, flexWrap: 'wrap', justifyContent: { xs: 'space-between', md: 'flex-start' } }}>
          <Box>
            <Box
              sx={{
                fontFamily: FONTS.gmarket,
                fontSize: '14px',
                color: COLORS.white,
                mb: 1.5,
              }}
            >
              고객센터
            </Box>
            <Box sx={{ fontFamily: FONTS.pretendard, fontSize: '13px', lineHeight: 2 }}>
              1588-0000
              <br />
              평일 10:00 - 18:00 (주말·공휴일 휴무)
              <br />
              hello@ibubom.com
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                fontFamily: FONTS.gmarket,
                fontSize: '14px',
                color: COLORS.white,
                mb: 1.5,
              }}
            >
              안내
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FOOTER_LINKS.map((l) => (
                <Box
                  key={l}
                  component="a"
                  href="#"
                  sx={{
                    fontFamily: FONTS.pretendard,
                    fontSize: '13px',
                    color: 'inherit',
                    '&:hover': { color: COLORS.pink },
                  }}
                >
                  {l}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          mt: 6,
          pt: 3,
          borderTop: '1px solid rgba(255,253,248,0.15)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 1,
          fontFamily: FONTS.pretendard,
          fontSize: '12px',
          color: 'rgba(255,253,248,0.5)',
        }}
      >
        <Box>(주)입어봄 · 대표 김입봄 · 사업자등록번호 000-00-00000</Box>
        <Box>Copyright © IBUBOM. All Rights Reserved.</Box>
      </Box>
    </Box>
  );
}

export default Footer;
