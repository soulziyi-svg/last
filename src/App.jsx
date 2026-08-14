import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';

/**
 * App 컴포넌트
 * 라우팅 루트 - 메인페이지 / 상품 상세 새창 페이지
 */
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
