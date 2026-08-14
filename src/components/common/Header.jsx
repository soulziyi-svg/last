import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { COLORS, FONTS } from '../../theme/tokens';
import { NAV_CATEGORIES, MENU_BY_KEY } from '../../data/menuData';
import { hanbokCategories, getHanbokProductsByCategory } from '../../data/hanbokProducts';
import useHeaderScrolled from '../../hooks/useHeaderScrolled';
import TopMarquee from './TopMarquee';
import MegaMenu from './MegaMenu';

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
          height: isScrolled ? '78px' : '176px',
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
          sx={{ position: 'relative' }}
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
                onMouseEnter={() => setOpenKey(cat.key)}
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
                  sx={{
                    height: isScrolled ? '42px' : '100px',
                    width: 'auto',
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
                right: { xs: 16, md: 32 },
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: '10px', md: '18px' },
              }}
            >
              {[SearchIcon, PersonOutlineIcon, ShoppingBagOutlinedIcon].map(
                (Icon, i) => (
                  <Box
                    key={i}
                    component="button"
                    type="button"
                    aria-label="icon"
                    sx={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      color: COLORS.black,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: isScrolled ? '20px' : '26px',
                        transition: 'font-size 0.25s ease',
                      }}
                    />
                  </Box>
                )
              )}
            </Box>
          </Box>

          <MegaMenu
            columns={openKey ? columnsByKey[openKey] : []}
            isOpen={Boolean(openKey)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
