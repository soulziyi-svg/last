import Box from '@mui/material/Box';
import { COLORS, FONTS } from '../../theme/tokens';
import { asset } from '../../utils/asset';

const RENTAL_STEPS = [
  { number: '01', title: '의상 선택', description: '졸업사진·여행·행사에 맞는 의상을 골라보세요.' },
  { number: '02', title: '사이즈 / 날짜 선택', description: '내 사이즈와 필요한 날짜를 선택해 예약하세요.' },
  { number: '03', title: '배송받기', description: '예약한 날짜에 맞춰 깨끗하게 포장된 의상을 받아보세요.' },
  { number: '04', title: '신나게 입기', description: '준비한 의상을 입고 특별한 하루와 사진을 즐기세요.' },
  { number: '05', title: '문 앞에 두면 반납 완료', description: '다시 포장해 문 앞에 두면 수거부터 반납까지 완료됩니다.' },
];

/**
 * RentalTimeline 컴포넌트
 * 메인 슬로건 + 대여 5단계 타임라인
 *
 * Example usage:
 * <RentalTimeline />
 */
function RentalTimeline() {
  return (
    <Box component="section" sx={{ width: '100%', bgcolor: '#FCF5EE', pt: { xs: 5, md: 7 }, pb: { xs: 7, md: 11 } }}>
      <Box
        sx={{
          textAlign: 'center',
          fontFamily: FONTS.blackHan,
          fontSize: { xs: '22px', md: '30pt' },
          color: COLORS.black,
          mb: { xs: 3, md: 4 },
        }}
      >
        하루를 빌리고, 추억은 가져가세요
      </Box>

      <Box sx={{ width: { xs: '94%', md: '80%' }, maxWidth: '1600px', mx: 'auto', overflowX: { xs: 'auto', md: 'visible' } }}>
        <Box sx={{ minWidth: { xs: 720, md: 0 } }}>
        <Box
          component="img"
          src={asset('/img/time.png?v=20260817')}
          alt="의상 선택, 사이즈와 날짜 선택, 배송받기, 신나게 입기, 문 앞 반납으로 이어지는 입어봄 대여 방법"
          sx={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            width: '100%',
            mt: '-7.5%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {RENTAL_STEPS.map((step) => (
            <Box
              key={step.number}
              sx={{
                minWidth: 0,
                px: { xs: 0.5, md: 1.5 },
                textAlign: 'center',
                fontFamily: FONTS.pretendard,
              }}
            >
              <Box sx={{ color: '#A67BC7', fontWeight: 900, fontSize: { xs: '11px', md: '15px' }, letterSpacing: '0.08em', mb: 0.5 }}>
                {step.number}
              </Box>
              <Box sx={{ color: COLORS.black, fontWeight: 800, fontSize: { xs: '10px', sm: '12px', md: '17px' }, lineHeight: 1.35, mb: { xs: 0.5, md: 0.8 }, wordBreak: 'keep-all' }}>
                {step.title}
              </Box>
              <Box sx={{ color: 'rgba(23,23,23,0.62)', fontSize: { xs: '8px', sm: '10px', md: '13px' }, lineHeight: 1.55, wordBreak: 'keep-all' }}>
                {step.description}
              </Box>
            </Box>
          ))}
        </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default RentalTimeline;
