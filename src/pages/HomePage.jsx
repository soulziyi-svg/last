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
import { useStore } from '../store/StoreContext';

/**
 * HomePage 컴포넌트
 * 헤더 - 메인 - 콘텐츠1~4 - 후기 - 푸터 순서로 구성된 랜딩 페이지
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  const { setDialog } = useStore();
  return (
    <Box sx={{ width: '100%', bgcolor: COLORS.white }}>
      <Header />
      <HeroBanner />
      <RentalTimeline />
      <ContentHanbok />
      <ContentWorld />
      <ContentCosplay />
      <ContentStage />
      <Footer />
      <Box sx={{ position: 'fixed', right: { xs: 12, md: 24 }, bottom: { xs: 14, md: 24 }, zIndex: 90, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box component="button" onClick={() => setDialog('chat')} aria-label="챗봇 열기" sx={{ width: { xs: 58, md: 76 }, height: { xs: 58, md: 76 }, border: 0, bgcolor: 'transparent', p: 0, cursor: 'pointer' }}><Box component="img" src="/img/chatbot.png" alt="챗봇" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /></Box>
        <Box component="button" onClick={() => setDialog('consult')} aria-label="상담하기 열기" sx={{ width: { xs: 58, md: 76 }, height: { xs: 58, md: 76 }, border: 0, bgcolor: 'transparent', p: 0, cursor: 'pointer' }}><Box component="img" src="/img/상담하기.png" alt="상담하기" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /></Box>
      </Box>
    </Box>
  );
}

export default HomePage;
