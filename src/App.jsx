import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';
import SiteDialogs from './components/common/SiteDialogs';
import { StoreProvider } from './store/StoreContext';

/**
 * App 컴포넌트
 * 라우팅 루트 - 메인페이지 / 상품 상세 새창 페이지
 */
function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route
            path="/admin"
            element={<AdminPage readOnly={!['127.0.0.1', 'localhost'].includes(window.location.hostname)} />}
          />
        </Routes>
        <SiteDialogs />
      </HashRouter>
    </StoreProvider>
  );
}

export default App;
