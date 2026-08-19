import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { hanbokProducts } from '../data/hanbokProducts';
import { worldProducts } from '../data/worldProducts';
import { cosplayProducts } from '../data/cosplayProducts';
import { stageProducts } from '../data/stageProducts';
import { FONTS } from '../theme/tokens';
import useManagedProducts, { deleteManagedProduct, saveManagedProducts, resetManagedProducts } from '../hooks/useManagedProducts';
import DetailPageManager from '../components/admin/DetailPageManager';
import { readDetailPage, saveDetailPage } from '../hooks/useManagedDetailPage';
import { makeProductDetailDefaults } from '../data/nezukoDetailDefaults';

const allProducts = [...hanbokProducts, ...worldProducts, ...cosplayProducts, ...stageProducts];
const initialOrders = [
  { id: 'IB-260819-01', customer: '김봄', product: allProducts[0]?.name, date: '2026.08.19', amount: 89000, status: '배송 준비' },
  { id: 'IB-260818-07', customer: '이하늘', product: worldProducts[2]?.name, date: '2026.08.18', amount: 59000, status: '배송 중' },
  { id: 'IB-260818-03', customer: '박유진', product: cosplayProducts[0]?.name, date: '2026.08.18', amount: 79000, status: '대여 중' },
  { id: 'IB-260817-11', customer: '최서윤', product: stageProducts[0]?.name, date: '2026.08.17', amount: 69000, status: '반납 완료' },
];

const baseStats = [
  ['오늘 출고', '7건', LocalShippingOutlinedIcon, '#E9587C'],
  ['오늘 반납', '5건', RateReviewOutlinedIcon, '#E8A527'],
  ['이번 달 매출', '₩8,420,000', PaymentsOutlinedIcon, '#2D9D78'],
];

const calendarEvents = {
  3: [{ label: '달빛하얀소복', color: '#7C4DFF' }],
  5: [{ label: '사쿠라 후리소데', color: '#E9587C' }],
  8: [{ label: '젠이츠 코스프레', color: '#E8A527' }],
  12: [{ label: '곤룡포', color: '#2D9D78' }, { label: '무대 드레스', color: '#7C4DFF' }],
  16: [{ label: '치파오', color: '#E9587C' }],
  19: [{ label: '오늘 출고 7건', color: '#171717' }],
  21: [{ label: '반납 예정 4건', color: '#E8A527' }],
  25: [{ label: '공연의상 단체', color: '#2D9D78' }],
  28: [{ label: '한복 촬영 예약', color: '#7C4DFF' }],
};

function AdminPage({ readOnly = false }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState(initialOrders);
  const managedProducts = useManagedProducts(allProducts);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const products = useMemo(() => managedProducts.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query, managedProducts]);
  const stats = [['전체 상품', `${managedProducts.length}개`, Inventory2OutlinedIcon, '#7C4DFF'], ...baseStats];
  const openProductForm = (product) => {
    const value = product || { id: `custom-${Date.now()}`, contentKey: 'hanbok', category: '', name: '', thumbnail: '', images: [], description: '', shortDesc: '', composition: '', sizes: ['S', 'M', 'L'], rentalPeriod: '2박 3일', price: 39000, rating: 5, reviewCount: 0, hot: false };
    setEditing(product?.id || null);
    setForm({ ...value, imageUrl: value.thumbnail || '', wornImageUrl: value.images?.[1] || '' });
  };
  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const saveProduct = async () => {
    if (!form.name.trim() || !form.category.trim()) return;
    const product = { ...form, price: Number(form.price) || 0, thumbnail: form.imageUrl, images: [form.imageUrl, form.wornImageUrl || form.imageUrl].filter(Boolean), shortDesc: form.shortDesc || form.description, history: form.description, rating: Number(form.rating) || 5, reviewCount: Number(form.reviewCount) || 0 };
    delete product.imageUrl;
    delete product.wornImageUrl;
    try {
      await saveManagedProducts(editing ? managedProducts.map((item) => item.id === editing ? product : item) : [product, ...managedProducts], product);
      {
        const detail = readDetailPage(product.id, makeProductDetailDefaults(product));
        saveDetailPage(product.id, {
          ...detail,
          productName: product.name,
          category: product.category,
          price: Number(product.price) || 0,
          shortDescription: product.shortDesc || product.description || detail.shortDescription,
          description: product.description || detail.description,
          images: {
            ...detail.images,
            main: product.thumbnail || detail.images.main,
            thumbnail: product.thumbnail || detail.images.thumbnail,
            worn: product.images?.[1] || detail.images.worn,
          },
          rental: { ...detail.rental, sizes: product.sizes || detail.rental.sizes },
        });
      }
      setForm(null);
    } catch {
      window.alert('저장하지 못했습니다. 관리자 권한과 Supabase 연결을 확인해주세요.');
    }
  };
  const deleteProduct = async (id) => {
    if (!window.confirm('이 상품을 삭제할까요?')) return;
    try {
      await deleteManagedProduct(managedProducts.find((item) => item.id === id));
      await saveManagedProducts(managedProducts.filter((item) => item.id !== id));
    } catch {
      window.alert('삭제하지 못했습니다. 관리자 권한을 확인해주세요.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F6F8', fontFamily: FONTS.pretendard }}>
      <Box component="header" sx={{ height: { xs: 64, md: 76 }, px: { xs: 2, md: 5 }, bgcolor: '#171717', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => navigate('/')} sx={{ color: '#fff' }} aria-label="메인으로 돌아가기"><ArrowBackRoundedIcon /></IconButton>
          <Box><Box sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 } }}>IBUBOM ADMIN</Box><Box sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 11, color: 'rgba(255,255,255,.55)' }}>입어봄 운영 관리</Box></Box>
        </Box>
        <Chip label={readOnly ? '읽기 전용' : '관리자'} sx={{ bgcolor: '#fff', fontWeight: 800 }} />
      </Box>

      <Box sx={{ maxWidth: 1480, mx: 'auto', px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: 3 }}><Box sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 900 }}>대시보드</Box><Box sx={{ color: '#72757E', mt: .5 }}>입어봄의 상품과 주문 현황을 관리하세요.</Box></Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4,1fr)' }, gap: { xs: 1.5, md: 2.5 }, mb: 4 }}>
          {stats.map(([label, value, Icon, color]) => <Paper key={label} elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #E7E8EC' }}><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}><Box><Box sx={{ fontSize: { xs: 12, md: 14 }, color: '#777B85' }}>{label}</Box><Box sx={{ fontSize: { xs: 19, md: 27 }, fontWeight: 900, mt: 1 }}>{value}</Box></Box><Box sx={{ width: { xs: 36, md: 46 }, height: { xs: 36, md: 46 }, borderRadius: 2, bgcolor: `${color}18`, color, display: 'grid', placeItems: 'center' }}><Icon /></Box></Box></Paper>)}
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E7E8EC', overflow: 'hidden' }}>
          <Box sx={{ px: { xs: 2, md: 3 }, pt: 2, display: 'flex', gap: 1, overflowX: 'auto', borderBottom: '1px solid #ECEDEF' }}>
            {[['products','상품 관리'],['detail','상세페이지 관리'],['schedule','예약 달력'],['inventory','재고·사이즈'],['orders','주문 관리'],['reviews','후기 관리']].map(([key,label]) => <Button key={key} onClick={() => setTab(key)} sx={{ color: tab === key ? '#171717' : '#8A8D95', fontWeight: 800, whiteSpace: 'nowrap', borderRadius: 0, borderBottom: tab === key ? '3px solid #171717' : '3px solid transparent', px: 2, pb: 1.5 }}>{label}</Button>)}
          </Box>

          {tab === 'products' && <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 2.5 }}><TextField size="small" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="상품명 또는 카테고리 검색" sx={{ width: { xs: '100%', sm: 360 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} />{!readOnly && <Box sx={{ display: 'flex', gap: 1 }}><Button variant="outlined" onClick={() => { resetManagedProducts(); setQuery(''); }}>초기화</Button><Button variant="contained" onClick={() => openProductForm(null)} sx={{ bgcolor: '#171717', fontWeight: 800 }}>상품 등록</Button></Box>}</Box>
            <Box sx={{ overflowX: 'auto' }}><Box component="table" sx={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', '& th': { textAlign: 'left', color: '#7B7E86', fontSize: 12, py: 1.5, borderBottom: '1px solid #ECEDEF' }, '& td': { py: 1.4, borderBottom: '1px solid #F0F1F3', fontSize: 13 } }}><thead><tr><th>상품</th><th>카테고리</th><th>대여가</th><th>별점</th><th>상태</th>{!readOnly && <th>관리</th>}</tr></thead><tbody>{products.map((p) => <tr key={p.id}><td><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}><Box component="img" src={p.thumbnail} alt="" sx={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 1, bgcolor: '#f3f3f3' }} />{p.name}</Box></td><td>{p.category}</td><td>{p.price?.toLocaleString()}원</td><td>★ {p.rating}</td><td><Chip size="small" label="판매 중" color="success" variant="outlined" /></td>{!readOnly && <td><Button size="small" onClick={() => openProductForm(p)}>수정</Button><Button size="small" color="error" onClick={() => deleteProduct(p.id)}>삭제</Button></td>}</tr>)}</tbody></Box></Box>
          </Box>}

          {tab === 'detail' && <DetailPageManager readOnly={readOnly} managedProducts={managedProducts} />}

          {tab === 'schedule' && <Box sx={{ p: { xs: 2, md: 3 }, overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 20, fontWeight: 900 }}><CalendarMonthOutlinedIcon /> 2026년 8월</Box><Box sx={{ display: 'flex', gap: 1 }}><Chip size="small" label="대여" sx={{ color: '#7C4DFF' }} /><Chip size="small" label="반납" sx={{ color: '#E8A527' }} /></Box></Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(94px, 1fr))', minWidth: 720, borderTop: '1px solid #E5E6E9', borderLeft: '1px solid #E5E6E9' }}>
              {['일','월','화','수','목','금','토'].map((day) => <Box key={day} sx={{ py: 1.2, textAlign: 'center', fontWeight: 800, color: '#777B85', borderRight: '1px solid #E5E6E9', borderBottom: '1px solid #E5E6E9' }}>{day}</Box>)}
              {Array.from({ length: 35 }, (_, i) => i - 4).map((date, i) => <Box key={i} sx={{ minHeight: 105, p: 1, bgcolor: date === 19 ? '#FFF9EC' : '#fff', borderRight: '1px solid #E5E6E9', borderBottom: '1px solid #E5E6E9' }}><Box sx={{ fontSize: 12, fontWeight: date === 19 ? 900 : 600, color: date > 0 && date <= 31 ? '#25262A' : '#C5C6CA' }}>{date > 0 && date <= 31 ? date : ''}</Box>{(calendarEvents[date] || []).map((event) => <Box key={event.label} sx={{ mt: .6, px: .7, py: .45, borderRadius: 1, bgcolor: `${event.color}16`, color: event.color, fontSize: 10, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.label}</Box>)}</Box>)}
            </Box>
          </Box>}

          {tab === 'inventory' && <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 2, mb: 3 }}>
              {[['대여 가능','184벌','#2D9D78',CheckroomOutlinedIcon],['대여 중','32벌','#7C4DFF',Inventory2OutlinedIcon],['세탁·수선 중','9벌','#E9587C',WarningAmberRoundedIcon]].map(([label,value,color,Icon]) => <Box key={label} sx={{ p: 2.2, border: '1px solid #E7E8EC', borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: `${color}18`, color }}><Icon /></Box><Box><Box sx={{ color: '#777B85', fontSize: 12 }}>{label}</Box><Box sx={{ fontSize: 21, fontWeight: 900 }}>{value}</Box></Box></Box>)}
            </Box>
            <Box sx={{ overflowX: 'auto' }}><Box component="table" sx={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', '& th': { textAlign: 'left', color: '#7B7E86', fontSize: 12, py: 1.5, borderBottom: '1px solid #ECEDEF' }, '& td': { py: 1.5, borderBottom: '1px solid #F0F1F3', fontSize: 13 } }}><thead><tr><th>상품</th><th>S</th><th>M</th><th>L</th><th>대여 중</th><th>세탁 중</th><th>상태</th></tr></thead><tbody>{managedProducts.slice(0, 12).map((p, i) => { const low = i % 5 === 0; return <tr key={p.id}><td sx={{ fontWeight: 700 }}>{p.name}</td><td>{2 + (i % 3)}</td><td>{low ? 0 : 3 + (i % 2)}</td><td>{1 + (i % 4)}</td><td>{i % 3}</td><td>{i % 2}</td><td><Chip size="small" label={low ? '재고 부족' : '대여 가능'} color={low ? 'warning' : 'success'} variant="outlined" /></td></tr>; })}</tbody></Box></Box>
          </Box>}

          {tab === 'orders' && <Box sx={{ p: { xs: 2, md: 3 }, overflowX: 'auto' }}><Box component="table" sx={{ width: '100%', minWidth: 820, borderCollapse: 'collapse', '& th': { textAlign: 'left', color: '#7B7E86', fontSize: 12, py: 1.5, borderBottom: '1px solid #ECEDEF' }, '& td': { py: 2, borderBottom: '1px solid #F0F1F3', fontSize: 13 } }}><thead><tr><th>주문번호</th><th>고객</th><th>상품</th><th>주문일</th><th>결제금액</th><th>상태</th><th>상세</th></tr></thead><tbody>{orders.map((o, i) => <tr key={o.id}><td sx={{ fontWeight: 700 }}>{o.id}</td><td>{o.customer}</td><td>{o.product}</td><td>{o.date}</td><td>{o.amount.toLocaleString()}원</td><td>{readOnly ? <Chip size="small" label={o.status} /> : <Select size="small" value={o.status} onChange={(e) => setOrders((prev) => prev.map((x, idx) => idx === i ? { ...x, status: e.target.value } : x))}>{['배송 준비','배송 중','대여 중','반납 완료'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select>}</td><td><Button size="small" variant="outlined" onClick={() => setSelectedOrder(o)}>상세 보기</Button></td></tr>)}</tbody></Box></Box>}

          {tab === 'reviews' && <Box sx={{ p: { xs: 2, md: 3 } }}>{['왕이 된 기분이었어요. 사진도 정말 잘 나왔습니다!','배송이 빠르고 의상 상태가 깨끗했어요.','사이즈 상담이 친절해서 편하게 골랐어요.'].map((text, i) => <Box key={text} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, py: 2.5, borderBottom: '1px solid #ECEDEF' }}><Box><Box sx={{ color: '#F3A51F', mb: .5 }}>★★★★★</Box><Box sx={{ fontWeight: 700 }}>{text}</Box><Box sx={{ color: '#858890', fontSize: 12, mt: .7 }}>고객 {i + 1} · 2026.08.{18 - i}</Box></Box>{!readOnly && <Button variant="outlined" size="small" sx={{ alignSelf: { sm: 'center' }, whiteSpace: 'nowrap' }}>답변 작성</Button>}</Box>)}</Box>}
        </Paper>
      </Box>

      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>주문 상세 정보</DialogTitle>
        {selectedOrder && <DialogContent><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
          {[['주문번호',selectedOrder.id],['고객명',selectedOrder.customer],['상품',selectedOrder.product],['사이즈','M'],['대여 기간','2026.08.21 ~ 08.24'],['결제금액',`${selectedOrder.amount.toLocaleString()}원`],['연락처','010-****-4821'],['배송 상태',selectedOrder.status]].map(([label,value]) => <Box key={label} sx={{ p: 1.8, bgcolor: '#F7F7F8', borderRadius: 2 }}><Box sx={{ color: '#858890', fontSize: 11, mb: .6 }}>{label}</Box><Box sx={{ fontWeight: 800, fontSize: 14 }}>{value}</Box></Box>)}
          <Box sx={{ gridColumn: { sm: '1 / -1' }, p: 1.8, bgcolor: '#F7F7F8', borderRadius: 2 }}><Box sx={{ color: '#858890', fontSize: 11, mb: .6 }}>배송지</Box><Box sx={{ fontWeight: 800, fontSize: 14 }}>서울시 마포구 ****로 **, ***동 ***호</Box></Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' }, p: 1.8, border: '1px solid #F0C56A', bgcolor: '#FFF9EC', borderRadius: 2 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: .7, color: '#8A6200', fontWeight: 900 }}><WarningAmberRoundedIcon fontSize="small" /> 반납 확인</Box><Box sx={{ color: '#775F27', fontSize: 12, mt: .7 }}>반납 예정일 다음 날까지 수거 상태를 확인하세요.</Box></Box>
        </Box></DialogContent>}
        <DialogActions sx={{ p: 3 }}><Button variant="contained" onClick={() => setSelectedOrder(null)} sx={{ bgcolor: '#171717' }}>확인</Button></DialogActions>
      </Dialog>

      <Dialog open={Boolean(form)} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>{editing ? '상품 수정' : '새 상품 등록'}</DialogTitle>
        {form && <DialogContent sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: '12px !important' }}>
          <TextField select label="콘텐츠" value={form.contentKey} onChange={(e) => updateField('contentKey', e.target.value)}>{[['hanbok','전통한복'],['world','세계의상'],['cosplay','코스프레'],['stage','공연의상']].map(([value,label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</TextField>
          <TextField required label="카테고리" value={form.category} onChange={(e) => updateField('category', e.target.value)} />
          <TextField required label="상품명" value={form.name} onChange={(e) => updateField('name', e.target.value)} sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField label="대여 가격" type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
          <TextField label="별점" type="number" value={form.rating} onChange={(e) => updateField('rating', e.target.value)} inputProps={{ min: 0, max: 5, step: .1 }} />
          <TextField label="상품 이미지 주소" value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} sx={{ gridColumn: { sm: '1 / -1' } }} helperText="/img/... 경로 또는 https:// 이미지 주소" />
          <TextField label="착용 이미지 주소" value={form.wornImageUrl} onChange={(e) => updateField('wornImageUrl', e.target.value)} sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField label="짧은 설명" value={form.shortDesc || ''} onChange={(e) => updateField('shortDesc', e.target.value)} multiline minRows={2} sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField label="자세한 설명" value={form.description || ''} onChange={(e) => updateField('description', e.target.value)} multiline minRows={4} sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField label="구성품" value={form.composition || ''} onChange={(e) => updateField('composition', e.target.value)} sx={{ gridColumn: { sm: '1 / -1' } }} />
        </DialogContent>}
        <DialogActions sx={{ p: 3 }}><Button onClick={() => setForm(null)}>취소</Button><Button variant="contained" onClick={saveProduct} sx={{ bgcolor: '#171717' }}>저장하고 반영</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPage;
