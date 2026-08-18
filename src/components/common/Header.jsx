import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Badge from '@mui/material/Badge';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Drawer from '@mui/material/Drawer';
import { COLORS, FONTS } from '../../theme/tokens';
import { NAV_CATEGORIES, MENU_BY_KEY } from '../../data/menuData';
import { hanbokCategories, getHanbokProductsByCategory } from '../../data/hanbokProducts';
import useHeaderScrolled from '../../hooks/useHeaderScrolled';
import TopMarquee from './TopMarquee';
import MegaMenu from './MegaMenu';
import { useStore } from '../../store/StoreContext';

const scrollToAnchor = (anchor) => {
  document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Header 컴포넌트
 * 탑 마퀴 + 로고/아이콘 + 4개 카테고리 메가메뉴로 구성된 사이트 헤더
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const navigate = useNavigate();
  const isScrolled = useHeaderScrolled(40);
  const [openKey, setOpenKey] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { cart, user, setDialog, setUser, setToast } = useStore();

  const columnsByKey = useMemo(() => {
    const hanbokColumns = hanbokCategories.map((cat) => ({
      title: cat,
      items: getHanbokProductsByCategory(cat).map((p) => ({
        label: p.name,
        onClick: () => {
          setOpenKey(null);
          navigate(`/product/${encodeURIComponent(p.id)}`);
        },
      })),
    }));

    const textColumns = (key, anchor) =>
      (MENU_BY_KEY[key] || []).map((col) => ({
        title: col.title,
        items: col.items.map((label) => ({
          label,
          onClick: () => {
            setOpenKey(null);
            scrollToAnchor(anchor);
          },
        })),
      }));

    return {
      hanbok: hanbokColumns,
      world: textColumns('world', '#content-world'),
      cosplay: textColumns('cosplay', '#content-cosplay'),
      stage: textColumns('stage', '#content-stage'),
    };
  }, [navigate]);

  return (
    <Box
      component="header"
      sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}
    >
      <TopMarquee />
      <Box
        sx={{
          width: '100%',
          bgcolor: COLORS.white,
          height: { xs: '68px', md: isScrolled ? '78px' : '176px' },
          transition: 'height 0.25s ease',
          borderBottom: `1px solid rgba(23,23,23,0.08)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        {/* category nav + icons + mega menu */}
        <Box
          sx={{ position: 'relative', display: { xs: 'none', md: 'block' } }}
          onMouseLeave={() => setOpenKey(null)}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: '18px', md: '48px' },
              flexWrap: 'nowrap',
              overflowX: 'auto',
              px: { xs: 2, md: 4 },
            }}
          >
            {NAV_CATEGORIES.map((cat) => (
              <Box
                key={cat.key}
                component="button"
                type="button"
                onClick={() => scrollToAnchor(cat.anchor)}
                sx={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'transform 0.15s ease, color 0.15s ease',
                  color: openKey === cat.key ? '#E23B3B' : COLORS.black,
                  transform: openKey === cat.key ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <Box
                  component="img"
                  src={cat.logo}
                  alt={cat.label}
                  onMouseEnter={() => setOpenKey(cat.key)}
                  sx={{
                    height: isScrolled ? '42px' : '80pt',
                    width: 'auto',
                    display: 'block',
                    bgcolor: 'transparent',
                    transition: 'height 0.25s ease',
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    fontFamily: FONTS.gmarket,
                    fontSize: isScrolled ? '11px' : '13px',
                    whiteSpace: 'nowrap',
                    transition: 'font-size 0.25s ease',
                  }}
                >
                  {cat.label}
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                position: 'absolute',
                right: { md: 24, lg: 32 },
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: { md: 0.75, lg: 1.25 },
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={() => setOpenKey(null)}
            >
              <Box
                component="button"
                type="button"
                aria-label="검색"
                onClick={() => setDialog('search')}
                sx={{
                  width: 40,
                  height: 40,
                  border: 0,
                  borderRadius: '50%',
                  bgcolor: 'transparent',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: COLORS.black,
                  '&:hover': { bgcolor: '#F3F0F8' },
                }}
              >
                <SearchIcon sx={{ fontSize: 24 }} />
              </Box>

              <Box
                component="button"
                type="button"
                onClick={() => setDialog('signup')}
                sx={{
                  height: 40,
                  px: { md: 1.5, lg: 2.25 },
                  border: 0,
                  borderRadius: '999px',
                  bgcolor: '#A995E8',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 5px 14px rgba(135, 109, 210, .25)',
                  '&:hover': { bgcolor: '#927DD6' },
                }}
              >
                회원가입
              </Box>

              <Box
                component="button"
                type="button"
                onClick={() => setDialog('login')}
                sx={{
                  height: 40,
                  px: { md: 1.5, lg: 2.25 },
                  border: '1px solid #D7D0E5',
                  borderRadius: '999px',
                  bgcolor: '#fff',
                  color: COLORS.black,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F8F5FC', borderColor: '#A995E8' },
                }}
              >
                로그인
              </Box>

              <Box
                component="button"
                type="button"
                onClick={() => setDialog('cart')}
                sx={{ all: 'unset', height: 40, px: { md: 0.5, lg: 1 }, display: 'flex', alignItems: 'center', gap: 0.6, cursor: 'pointer', fontSize: 14, fontWeight: 800 }}
              >
                <Badge badgeContent={cart.length} color="error"><ShoppingBagOutlinedIcon sx={{ fontSize: 23 }} /></Badge>
                <Box component="span" sx={{ display: { md: 'none', lg: 'inline' } }}>장바구니</Box>
              </Box>

              <Box
                component="button"
                type="button"
                onClick={() => setDialog('tracking')}
                sx={{ all: 'unset', height: 40, px: { md: 0.5, lg: 1 }, display: 'flex', alignItems: 'center', gap: 0.6, cursor: 'pointer', fontSize: 14, fontWeight: 800 }}
              >
                <LocalShippingOutlinedIcon sx={{ fontSize: 23 }} />
                <Box component="span" sx={{ display: { md: 'none', lg: 'inline' } }}>배송조회</Box>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                display: 'none',
                right: { xs: 16, md: 32 },
                top: '50%',
                transform: 'translateY(-50%)',
                alignItems: 'center',
                gap: { xs: '10px', md: '18px' },
              }}
              onMouseEnter={() => setOpenKey(null)}
            >
              {user && <Box sx={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>{user.email.split('@')[0]}님 반갑습니다.</Box>}
              {[
                [SearchIcon, '검색', 'search'],
                [PersonOutlineIcon, '회원 메뉴', 'account'],
                [ShoppingBagOutlinedIcon, '장바구니', 'cart'],
                [LocalShippingOutlinedIcon, '배송조회', 'tracking'],
              ].map(([Icon, label, action]) => (
                  <Box
                    key={action}
                    component="button"
                    type="button"
                    aria-label={label}
                    onClick={() => action === 'account' ? setAccountOpen((v) => !v) : setDialog(action)}
                    onMouseEnter={() => action === 'account' && setAccountOpen(true)}
                    sx={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      color: COLORS.black,
                    }}
                  >
                    <Badge badgeContent={action === 'cart' ? cart.length : 0} color="error">
                    <Icon
                      sx={{
                        fontSize: isScrolled ? '20px' : '26px',
                        transition: 'font-size 0.25s ease',
                      }}
                    /></Badge>
                  </Box>
              ))}
              {accountOpen && <Box onMouseLeave={() => setAccountOpen(false)} sx={{ position: 'absolute', right: 48, top: 32, width: 170, bgcolor: '#fff', border: '1px solid #ddd', p: 1, animation: 'slide-down .2s ease' }}>{user ? <Box component="button" onClick={() => { setUser(null); setAccountOpen(false); setToast('로그아웃 되었습니다.'); }} sx={{ width:'100%', border:0, bgcolor:'#fff', p:1.2, textAlign:'left', cursor:'pointer' }}>로그아웃</Box> : <><Box component="button" onClick={() => {setDialog('signup');setAccountOpen(false)}} sx={{width:'100%',border:0,bgcolor:'#fff',p:1.2,textAlign:'left'}}>회원가입</Box><Box component="button" onClick={() => {setDialog('login');setAccountOpen(false)}} sx={{width:'100%',border:0,bgcolor:'#fff',p:1.2,textAlign:'left'}}>로그인</Box></>}<Box component="button" onClick={() => {setDialog('chat');setAccountOpen(false)}} sx={{width:'100%',border:0,bgcolor:'#fff',p:1.2,textAlign:'left'}}>1:1 문의 (챗봇)</Box><Box component="button" onClick={() => {setDialog('consult');setAccountOpen(false)}} sx={{width:'100%',border:0,bgcolor:'#fff',p:1.2,textAlign:'left'}}>상담하기</Box></Box>}
            </Box>
          </Box>

          <MegaMenu
            columns={openKey ? columnsByKey[openKey] : []}
            isOpen={Boolean(openKey)}
            isScrolled={isScrolled}
            onMouseLeave={() => setOpenKey(null)}
          />
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 2 }}>
          <Box component="button" type="button" onClick={() => navigate('/')} sx={{ all: 'unset', cursor: 'pointer', fontFamily: FONTS.gmarket, fontSize: 20, fontWeight: 900, letterSpacing: '.08em' }}>IBUBOM</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
            <Box component="button" type="button" aria-label="검색" onClick={() => setDialog('search')} sx={{ all: 'unset', display: 'flex', p: 1 }}><SearchIcon /></Box>
            <Box component="button" type="button" aria-label="장바구니" onClick={() => setDialog('cart')} sx={{ all: 'unset', display: 'flex', p: 1 }}><Badge badgeContent={cart.length} color="error"><ShoppingBagOutlinedIcon /></Badge></Box>
            <Box component="button" type="button" aria-label="메뉴 열기" onClick={() => setMobileOpen(true)} sx={{ all: 'unset', display: 'flex', p: 1 }}><MenuRoundedIcon /></Box>
          </Box>
        </Box>
      </Box>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ paper: { sx: { width: 'min(86vw, 360px)', p: 2.5, bgcolor: '#FFFDF8' } } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}><Box sx={{ fontFamily: FONTS.gmarket, fontSize: 20 }}>IBUBOM</Box><Box component="button" type="button" aria-label="메뉴 닫기" onClick={() => setMobileOpen(false)} sx={{ all: 'unset', display: 'flex', p: 1 }}><CloseRoundedIcon /></Box></Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2.5 }}>
          <Box component="button" type="button" onClick={() => { setMobileOpen(false); setDialog('signup'); }} sx={{ height: 40, border: 0, borderRadius: '999px', bgcolor: '#A995E8', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>회원가입</Box>
          <Box component="button" type="button" onClick={() => { setMobileOpen(false); setDialog('login'); }} sx={{ height: 40, border: '1px solid #D7D0E5', borderRadius: '999px', bgcolor: '#fff', fontWeight: 800, cursor: 'pointer' }}>로그인</Box>
          <Box component="button" type="button" onClick={() => { setMobileOpen(false); setDialog('cart'); }} sx={{ height: 40, border: '1px solid #E5E0EA', borderRadius: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 800 }}><ShoppingBagOutlinedIcon fontSize="small" />장바구니</Box>
          <Box component="button" type="button" onClick={() => { setMobileOpen(false); setDialog('tracking'); }} sx={{ height: 40, border: '1px solid #E5E0EA', borderRadius: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 800 }}><LocalShippingOutlinedIcon fontSize="small" />배송조회</Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NAV_CATEGORIES.map((cat) => <Box key={cat.key} component="button" type="button" onClick={() => { setMobileOpen(false); setTimeout(() => scrollToAnchor(cat.anchor), 100); }} sx={{ border: 0, bgcolor: '#fff', borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', gap: 2, textAlign: 'left', cursor: 'pointer' }}><Box component="img" src={cat.logo} alt="" sx={{ width: 54, height: 42, objectFit: 'contain' }} /><Box sx={{ fontFamily: FONTS.gmarket, fontSize: 15 }}>{cat.label}</Box></Box>)}
        </Box>
      </Drawer>
    </Box>
  );
}

export default Header;
