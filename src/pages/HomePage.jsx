import Box from '@mui/material/Box';
import { COLORS } from '../theme/tokens';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HeroBanner from '../components/landing/HeroBanner';
import RentalTimeline from '../components/landing/RentalTimeline';
import ContentHanbok from '../components/landing/ContentHanbok';
import ContentWorld from '../components/landing/ContentWorld';
import ContentCosplay from '../components/landing/ContentCosplay';
import ContentStage from '../components/landing/ContentStage';
import ReviewSection from '../components/landing/ReviewSection';
import { HANBOK_REVIEWS } from '../data/reviewData';

/**
 * HomePage 컴포넌트
 * 헤더 - 메인 - 콘텐츠1~4 - 후기 - 푸터 순서로 구성된 랜딩 페이지
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  return (
    <Box sx={{ width: '100%', bgcolor: COLORS.white }}>
      <Header />
      <HeroBanner />
      <RentalTimeline />
      <ContentHanbok />
      <ContentWorld />
      <ContentCosplay />
      <ContentStage />
      <ReviewSection title="입어봄, 진짜 후기" reviews={HANBOK_REVIEWS} bgcolor={COLORS.white} />
      <Footer />
    </Box>
  );
}

export default HomePage;
