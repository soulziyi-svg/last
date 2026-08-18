import { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import Footer from '../components/common/Footer';
import { useStore } from '../store/StoreContext';
import { asset } from '../utils/asset';
import { FONTS } from '../theme/tokens';

const ACCESSORIES = asset('/img/content-cosplay/nezuko-accessories.png');
const REVIEWS = [
  { name: '김하린', date: '2026.08.12', size: 'S', score: 5, image: asset('/img/reviews/review-01.png'), text: '졸업사진 촬영에 입었는데 색감이 정말 예쁘게 나왔어요. 가발과 대나무 소품까지 한 번에 받아서 준비가 편했습니다.', tags: ['#졸업사진', '#네즈코', '#코스프레'] },
  { name: '이서윤', date: '2026.08.04', size: 'M', score: 5, image: asset('/img/reviews/review-07.png'), text: '친구들과 촬영할 때 대여했어요. 옷의 기하학 무늬가 선명하고 하오리 핏도 좋아서 실제 사진에서 존재감이 컸습니다.', tags: ['#우정촬영', '#귀멸의칼날', '#프로필'] },
  { name: '박지민', date: '2026.07.28', size: 'M', score: 4.5, image: asset('/img/reviews/review-10.png'), text: '구성품이 깨끗하게 포장되어 왔고 사이즈 안내도 정확했어요. 다음 행사에도 다른 캐릭터를 빌려보고 싶어요.', tags: ['#행사코스프레', '#대여후기', '#입어봄'] },
];

const sectionSx = { width: 'min(1180px, 90%)', mx: 'auto', py: { xs: 7, md: 11 } };

export default function NezukoDetailPage({ product }) {
  const { addToCart, setDialog, cart } = useStore();
  const gallery = [product.images[1], product.thumbnail, ACCESSORIES, asset('/img/reviews/review-04.png'), asset('/img/reviews/review-08.png')];
  const [active, setActive] = useState(0);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('detail');
  const inCart = cart.some((item) => item.id === product.id);

  return <Box sx={{ bgcolor: '#FFFDF8', color: '#171717', fontFamily: FONTS.pretendard }}>
    <Box component="header" sx={{ height: 76, px: { xs: 2, md: 6 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E6E0D8', bgcolor: 'rgba(255,253,248,.96)', position: 'sticky', top: 0, zIndex: 30 }}>
      <Link to="/"><Box sx={{ fontFamily: FONTS.gmarket, fontSize: 22, letterSpacing: '.08em' }}>IBUBOM</Box></Link>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, fontWeight: 700 }}><Link to="/#content-hanbok">전통한복</Link><Link to="/#content-world">세계전통의상</Link><Link to="/#content-cosplay">코스프레</Link><Link to="/#content-stage">공연의상</Link></Box>
      <Button onClick={() => setDialog('cart')} startIcon={<ShoppingBagOutlinedIcon />} sx={{ color: '#171717', fontWeight: 800 }}>장바구니 {cart.length}</Button>
    </Box>

    <Box sx={{ width: 'min(1320px, 92%)', mx: 'auto', py: 3, color: '#756F68', fontSize: 13 }}>홈 〉 코스프레 〉 귀멸의 칼날 〉 <b>네즈코 코스프레</b></Box>

    <Box sx={{ width: 'min(1320px, 92%)', mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.15fr .85fr' }, gap: { xs: 4, lg: 8 }, pb: 10 }}>
      <Box><Box sx={{ position: 'relative', bgcolor: '#F2ECE6', overflow: 'hidden' }}><Box component="img" src={gallery[active]} alt="네즈코 코스프레 상품 갤러리" sx={{ width: '100%', aspectRatio: '4/5', objectFit: 'contain' }} /><Box sx={{ position: 'absolute', right: 16, bottom: 14, bgcolor: 'rgba(23,23,23,.75)', color: '#fff', px: 1.5, py: .6, fontSize: 12 }}>{active + 1} / {gallery.length}</Box></Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${gallery.length},1fr)`, gap: 1, mt: 1 }}>{gallery.map((src, i) => <Box key={src} component="button" onClick={() => setActive(i)} sx={{ border: i === active ? '2px solid #7C4DFF' : '1px solid #DED8D1', bgcolor: '#fff', p: 0, cursor: 'pointer' }}><Box component="img" src={src} alt="" sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} /></Box>)}</Box>
      </Box>

      <Box sx={{ pt: { lg: 3 } }}><Box sx={{ color: '#7C4DFF', fontWeight: 900, letterSpacing: '.12em', fontSize: 12 }}>IBUBOM · DEMON SLAYER COLLECTION</Box><Box component="h1" sx={{ fontFamily: FONTS.gmarket, fontSize: { xs: 34, md: 48 }, lineHeight: 1.15, mt: 2, mb: 2 }}>네즈코 코스프레</Box><Box sx={{ color: '#6E6862', fontSize: 16, lineHeight: 1.8 }}>연분홍 기하학 무늬 기모노와 짙은 하오리, 오비와 대나무 소품까지 갖춘 완성형 코스프레 대여 세트입니다.</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 3 }}><Rating value={4.9} precision={.5} readOnly /><b>4.9</b><Box sx={{ color: '#777' }}>(128개의 대여 후기)</Box></Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}><Box sx={{ fontSize: 34, fontWeight: 900 }}>{product.price.toLocaleString()}원</Box><Box sx={{ textDecoration: 'line-through', color: '#999' }}>{Math.round(product.price * 1.25).toLocaleString()}원</Box><Box sx={{ color: '#FF5C8A', fontWeight: 900 }}>20%</Box></Box>
        <Box sx={{ borderTop: '1px solid #DDD6CE', pt: 3 }}><Box sx={{ fontWeight: 900, mb: 1.5 }}>사이즈 선택</Box><Box sx={{ display: 'flex', gap: 1 }}>{['S','M','L'].map((s) => <Button key={s} variant={size === s ? 'contained' : 'outlined'} onClick={() => setSize(s)} sx={{ minWidth: 66, py: 1.2, bgcolor: size === s ? '#171717' : '#fff', color: size === s ? '#fff' : '#171717', borderColor: '#171717' }}>{s}</Button>)}</Box><Box sx={{ fontSize: 12, color: '#777', mt: 1.5 }}>S 2벌 · M 4벌 · L 1벌 / 신축성 없는 기모노 기준</Box></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 3, mt: 3, borderTop: '1px solid #DDD6CE', borderBottom: '1px solid #DDD6CE' }}><b>수량</b><Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #CCC' }}><Button onClick={() => setQty(Math.max(1, qty - 1))}>−</Button><Box sx={{ px: 2 }}>{qty}</Box><Button onClick={() => setQty(qty + 1)}>＋</Button></Box></Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3, fontSize: 18 }}><span>총 대여금액</span><b style={{ fontSize: 28 }}>{(product.price * qty).toLocaleString()}원</b></Box>
        <Button fullWidth variant="contained" onClick={() => addToCart({ ...product, size, qty })} sx={{ bgcolor: '#171717', py: 1.8, fontSize: 17, mb: 1.5 }}>{inCart ? '장바구니에 담긴 상품' : '장바구니 담기'}</Button><Button fullWidth variant="outlined" sx={{ borderColor: '#7C4DFF', color: '#7C4DFF', py: 1.8, fontSize: 17 }}>바로 대여하기</Button>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', mt: 4, borderTop: '1px solid #DDD6CE', borderBottom: '1px solid #DDD6CE' }}>{[[LocalShippingOutlinedIcon,'오늘 출고','오후 2시 이전'],[ReplayRoundedIcon,'간편 반납','문 앞 수거'],[VerifiedOutlinedIcon,'살균 완료','100% 고온 세탁']].map(([Icon,title,desc]) => <Box key={title} sx={{ textAlign: 'center', py: 2.5, borderRight: '1px solid #DDD6CE', '&:last-child': { borderRight: 0 } }}><Icon/><Box sx={{ fontWeight: 900, mt: .5 }}>{title}</Box><Box sx={{ fontSize: 11, color: '#777' }}>{desc}</Box></Box>)}</Box>
      </Box>
    </Box>

    <Box sx={{ bgcolor: '#F2ECE6' }}><Box sx={sectionSx}><Box sx={{ textAlign: 'center', color: '#7C4DFF', fontWeight: 900, letterSpacing: '.12em' }}>NEZUKO STYLE GALLERY</Box><Box component="h2" sx={{ textAlign: 'center', fontFamily: FONTS.gmarket, fontSize: { xs: 28, md: 42 }, mt: 1 }}>의상부터 악세사리까지 한 번에</Box><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.35fr .65fr' }, gap: 2, mt: 5 }}><Box component="img" src={product.images[1]} alt="네즈코 코스프레 착용 사진" sx={{ width: '100%', height: { xs: 480, md: 760 }, objectFit: 'cover' }} /><Box sx={{ display: 'grid', gap: 2 }}><Box component="img" src={product.thumbnail} alt="네즈코 의상 단독 사진" sx={{ width: '100%', height: { xs: 430, md: 370 }, objectFit: 'contain', bgcolor: '#fff' }} /><Box component="img" src={ACCESSORIES} alt="네즈코 악세사리 세트" sx={{ width: '100%', height: { xs: 430, md: 370 }, objectFit: 'cover' }} /></Box></Box></Box></Box>

    <Box sx={sectionSx}><Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, borderBottom: '1px solid #D9D4CE', mb: 6 }}>{[['detail','상세 정보'],['care','소재 · 세탁'],['delivery','배송 · 교환']].map(([key,label]) => <Button key={key} onClick={() => setTab(key)} sx={{ color: tab === key ? '#7C4DFF' : '#777', fontWeight: 900, px: 4, py: 2, borderBottom: tab === key ? '3px solid #7C4DFF' : '3px solid transparent', borderRadius: 0 }}>{label}</Button>)}</Box>
      {tab === 'detail' && <><Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}><Box sx={{ color: '#7C4DFF', fontWeight: 900 }}>“오늘만큼은, 내가 좋아한 캐릭터가 되어봄”</Box><Box sx={{ lineHeight: 2, mt: 2, color: '#625D57' }}>분홍 기모노의 선명한 기하학 패턴과 짙은 갈색 하오리의 대비를 그대로 살렸습니다. 촬영에서 실루엣이 잘 보이도록 넉넉한 소매와 오비의 형태를 정돈하고, 피부에 닿는 안감은 편안한 소재로 마감했습니다.</Box></Box><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 4, mt: 7 }}>{[['01','완성형 7종 세트','기모노, 하오리, 오비, 가발, 리본, 다리 장식, 대나무 소품이 모두 포함됩니다.'],['02','사진에 선명한 패턴','실내 조명과 야외 촬영 모두에서 분홍빛 기하학 무늬가 또렷하게 표현됩니다.'],['03','움직임을 고려한 설계','졸업사진과 행사에서 걷고 포즈를 취하기 편하도록 활동 여유를 확보했습니다.']].map(([n,t,d]) => <Box key={n} sx={{ borderTop: '2px solid #171717', pt: 2 }}><Box sx={{ color: '#7C4DFF', fontWeight: 900 }}>{n}</Box><Box sx={{ fontSize: 21, fontWeight: 900, my: 1 }}>{t}</Box><Box sx={{ color: '#777', lineHeight: 1.8 }}>{d}</Box></Box>)}</Box></>}
      {tab === 'care' && <Box sx={{ maxWidth: 760, mx: 'auto', lineHeight: 2 }}><b>소재</b><br/>폴리에스터 기모노 원단, 인조모 가발, EVA 대나무 소품으로 구성됩니다.<br/><br/><b>세탁</b><br/>모든 의상은 반납 후 전문 세탁과 고온 살균을 거쳐 개별 포장됩니다. 고객님이 직접 세탁하지 마세요.</Box>}
      {tab === 'delivery' && <Box sx={{ maxWidth: 760, mx: 'auto', lineHeight: 2 }}><b>배송</b><br/>선택한 대여 시작일 하루 전까지 도착하도록 출고합니다.<br/><br/><b>교환</b><br/>착용 전 사이즈 이상이 확인되면 수령 당일 고객센터로 문의해주세요. 사용 후에는 동봉된 가방에 넣어 문 앞에 두면 반납이 완료됩니다.</Box>}
    </Box>

    <Box sx={{ bgcolor: '#171717', color: '#fff' }}><Box sx={sectionSx}><Box sx={{ color: '#FF9DB8', fontWeight: 900 }}>STYLE FILM</Box><Box component="h2" sx={{ fontFamily: FONTS.gmarket, fontSize: { xs: 28, md: 40 } }}>네즈코 코스프레 — 착용 가이드</Box><Box sx={{ position: 'relative', mt: 4 }}><Box component="img" src={product.images[1]} alt="네즈코 스타일 영상 썸네일" sx={{ width: '100%', maxHeight: 650, objectFit: 'cover', opacity: .75 }} /><Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><Button aria-label="영상 재생" sx={{ minWidth: 84, width: 84, height: 84, borderRadius: '50%', bgcolor: '#fff', color: '#171717' }}><PlayArrowRoundedIcon sx={{ fontSize: 48 }} /></Button></Box></Box><Box sx={{ mt: 2, color: '#C9C4BE' }}>가발 착용 · 오비 매듭 · 소품 연출 가이드</Box></Box></Box>

    <Box sx={sectionSx}><Box sx={{ color: '#7C4DFF', fontWeight: 900 }}>REAL REVIEW</Box><Box component="h2" sx={{ fontFamily: FONTS.gmarket, fontSize: { xs: 28, md: 40 } }}>네즈코를 진짜로 입어봄</Box><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3, mt: 4 }}>{REVIEWS.map((review) => <Box key={review.name} sx={{ borderTop: '2px solid #171717', pt: 2 }}><Rating value={review.score} precision={.5} readOnly size="small"/><Box component="img" src={review.image} alt="후기 사진" sx={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', my: 2 }} /><Box sx={{ fontWeight: 900 }}>{review.name} · {review.date}</Box><Box sx={{ fontSize: 12, color: '#777', mt: .4 }}>대여 사이즈 {review.size}</Box><Box sx={{ lineHeight: 1.75, my: 1.5 }}>{review.text}</Box><Box sx={{ color: '#7C4DFF', fontSize: 12 }}>{review.tags.join(' ')}</Box></Box>)}</Box></Box>
    <Footer />
  </Box>;
}
