import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { hanbokProducts } from '../../data/hanbokProducts';
import { worldProducts } from '../../data/worldProducts';
import { cosplayProducts } from '../../data/cosplayProducts';
import { stageProducts } from '../../data/stageProducts';
import { useStore } from '../../store/StoreContext';
import { FONTS } from '../../theme/tokens';
import useManagedProducts from '../../hooks/useManagedProducts';

const ALL_PRODUCTS = [...hanbokProducts, ...worldProducts, ...cosplayProducts, ...stageProducts];
const periods = { '1일': 1, '1박 2일': 1.3, '2박 3일': 1.55 };
const panelSx = { '& .MuiPaper-root': { bgcolor: '#FFFDF8', backgroundImage: 'none' } };

function SearchDialog() {
  const { dialog, setDialog } = useStore();
  const navigate = useNavigate();
  const products = useManagedProducts(ALL_PRODUCTS);
  const [query, setQuery] = useState('');
  const results = useMemo(() => query.trim() ? products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12) : products.slice(0, 8), [query, products]);
  return <Dialog open={dialog === 'search'} onClose={() => setDialog(null)} fullWidth maxWidth="md" sx={panelSx}>
    <DialogTitle sx={{ fontFamily: FONTS.gmarket, fontSize: 26 }}>어떤 하루를 입어볼까요?</DialogTitle>
    <DialogContent><TextField autoFocus fullWidth placeholder="의상명·카테고리 검색" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ my: 2 }} />
      <Box sx={{ borderTop: '2px solid #171717' }}>{results.map((p) => <Box key={p.id} component="button" onClick={() => { setDialog(null); navigate(`/product/${encodeURIComponent(p.id)}`); }} sx={{ width: '100%', border: 0, borderBottom: '1px solid #E5E2DC', bgcolor: 'transparent', px: { xs: 1, sm: 2 }, py: 2, display: 'grid', gridTemplateColumns: { xs: '82px 1fr', sm: '120px 1fr auto' }, alignItems: 'center', gap: 1.5, textAlign: 'left', cursor: 'pointer', transition: 'background-color .15s ease, color .15s ease', '&:hover': { bgcolor: '#F6F2FF', color: '#7C4DFF' } }}><Box sx={{ fontSize: 12, fontWeight: 800, color: '#777' }}>{p.category}</Box><Box><Box sx={{ fontWeight: 900, fontSize: { xs: 15, sm: 17 } }}>{p.name}</Box><Box sx={{ mt: .4, color: '#777', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.shortDesc || p.description}</Box></Box><Box sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 900, whiteSpace: 'nowrap' }}>{p.price.toLocaleString()}원 →</Box></Box>)}</Box>
    </DialogContent>
  </Dialog>;
}

function AccountDialog() {
  const { dialog, setDialog, setUser, setToast } = useStore();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [address, setAddress] = useState(''); const [all, setAll] = useState(false);
  const signup = dialog === 'signup';
  const submit = () => {
    if (!email || !password || (signup && (!all || password !== confirm))) return setToast('입력 내용과 필수 동의를 확인해주세요.');
    setUser({ email }); setDialog(null); setToast(signup ? '회원가입이 완료되었습니다.' : '로그인 되었습니다.');
  };
  return <Dialog open={dialog === 'login' || signup} onClose={() => setDialog(null)} fullWidth maxWidth="xs" sx={panelSx}>
    <DialogTitle sx={{ fontFamily: FONTS.gmarket }}>{signup ? '입어봄 회원가입' : '다시 만나 반가워요'}</DialogTitle>
    <DialogContent sx={{ display: 'grid', gap: 2, pt: '12px !important' }}>
      {signup && <Box sx={{ bgcolor: '#F6F2FF', p: 2 }}><Box sx={{ fontWeight: 900, mb: 1 }}>STEP 1. 이용약관에 동의해주세요.</Box><FormControlLabel control={<Checkbox checked={all} onChange={(e) => setAll(e.target.checked)} />} label="전체동의" /><Box sx={{ fontSize: 12 }}>서비스 통합이용약관 동의 <b style={{ color: '#FF5C8A' }}>(필수)</b><br />위치정보 수집 및 이용 동의</Box></Box>}
      <TextField label="아이디(이메일)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {signup && <><TextField label="비밀번호 확인" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /><TextField label="기본주소" value={address} onChange={(e) => setAddress(e.target.value)} /></>}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, display: 'grid', gap: 1 }}><Button fullWidth variant="contained" disabled={signup && !all} onClick={submit} sx={{ bgcolor: '#171717', py: 1.4 }}>{signup ? '본인인증하고 가입 완료하기' : '로그인하기'}</Button><Button onClick={() => setDialog(signup ? 'login' : 'signup')}>{signup ? '로그인으로 돌아가기' : '회원가입'}</Button>{!signup && <Button size="small">아이디/비밀번호 찾기</Button>}</DialogActions>
  </Dialog>;
}

function CartDialog() {
  const { dialog, setDialog, cart, updateCart, removeFromCart, setToast } = useStore();
  const managedProducts = useManagedProducts(ALL_PRODUCTS);
  const currentCart = cart.map((item) => ({ ...item, ...(managedProducts.find((product) => product.id === item.id) || {}) }));
  const total = currentCart.reduce((sum, p) => sum + Math.round(p.price * (periods[p.period] || 1)) * p.qty, 0);
  return <Dialog open={dialog === 'cart'} onClose={() => setDialog(null)} fullWidth maxWidth="md" sx={panelSx}><DialogTitle sx={{ fontFamily: FONTS.gmarket }}>장바구니 <Box component="span" sx={{ color: '#FF5C8A' }}>{cart.length}</Box></DialogTitle><DialogContent>
    {!cart.length && <Box sx={{ py: 8, textAlign: 'center', color: '#777' }}>아직 담은 의상이 없습니다.</Box>}
    {currentCart.map((p) => <Box key={p.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '90px 1fr', sm: '150px 1fr auto' }, gap: 2, py: 2.5, borderBottom: '1px solid #ddd' }}><Box component="img" src={p.thumbnail} alt="" sx={{ width: '100%', aspectRatio: '4/5', objectFit: 'contain', bgcolor: '#fff' }} /><Box><Box sx={{ fontWeight: 900, fontSize: 18 }}>{p.name}</Box><Box sx={{ my: 1 }}>{['S','M','L'].map((s) => <Button key={s} size="small" variant={p.size === s ? 'contained' : 'outlined'} onClick={() => updateCart(p.id,{ size:s })} sx={{ minWidth: 38, mr:.5, bgcolor: p.size === s ? '#171717' : undefined }}>{s}</Button>)}</Box><Select size="small" value={p.period} onChange={(e) => updateCart(p.id,{ period:e.target.value })}>{Object.keys(periods).map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}</Select><Box sx={{ display:'inline-flex', ml:1, alignItems:'center' }}><Button onClick={() => updateCart(p.id,{ qty:Math.max(1,p.qty-1) })}>−</Button>{p.qty}<Button onClick={() => updateCart(p.id,{ qty:p.qty+1 })}>＋</Button></Box></Box><Box sx={{ textAlign:'right' }}><IconButton onClick={() => removeFromCart(p.id)}><DeleteOutlineRoundedIcon /></IconButton><Box sx={{ fontWeight:900, color:'#E23B3B' }}>{(Math.round(p.price*(periods[p.period]||1))*p.qty).toLocaleString()}원</Box></Box></Box>)}
    <Box sx={{ textAlign:'right', pt:3 }}><Box>선택상품 {cart.length}개</Box><Box sx={{ fontSize:28, fontWeight:900, color:'#E23B3B' }}>총 {total.toLocaleString()}원</Box></Box>
  </DialogContent><DialogActions sx={{p:3}}><Button onClick={() => setDialog(null)}>쇼핑 계속하기</Button><Button variant="contained" disabled={!cart.length} onClick={() => setToast('대여 신청이 접수되었습니다.')} sx={{bgcolor:'#171717',px:4}}>선택 상품 대여하기</Button></DialogActions></Dialog>;
}

function TrackingDialog() {
  const { dialog, setDialog } = useStore();
  return <Dialog open={dialog === 'tracking'} onClose={() => setDialog(null)} fullWidth maxWidth="sm" sx={panelSx}><DialogTitle sx={{fontFamily:FONTS.gmarket}}>배송조회</DialogTitle><DialogContent><Box sx={{fontWeight:900,fontSize:20}}>달빛 하얀 소복</Box><Box sx={{color:'#777',my:1}}>주문번호 IBUBOM-20260818-001 · 천리마 퀵서비스</Box><Box sx={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',mt:4,gap:.5}}>{['주문완료','상품준비중','배송중','배송완료','대여중','반납배송중','반납완료'].map((s,i)=><Box key={s} sx={{textAlign:'center',fontSize:10,fontWeight:i===1?900:500,color:i<=1?'#7C4DFF':'#aaa'}}><Box sx={{height:5,bgcolor:i<=1?'#7C4DFF':'#ddd',mb:1}} />{s}</Box>)}</Box><Box sx={{bgcolor:'#F6F2FF',p:2.5,mt:4}}><b>현재 상품 준비중</b><br/>예상 도착일 8월 18일 오후 예정<br/>반납 예정일 2026.08.22</Box></DialogContent><DialogActions><Button onClick={()=>setDialog(null)}>닫기</Button></DialogActions></Dialog>;
}

const quickAnswers = { '대여 방법안내':'의상을 고르고 사이즈와 날짜를 선택하면 문 앞으로 배송해드려요.', '배송/반납 안내':'오늘 배송이 가능하며, 사용 후 문 앞에 두면 수거해드려요.', '교환 안내':'착용 전 사이즈 문제가 확인되면 고객센터로 바로 문의해주세요.', '사이즈 가이드':'상품별 S·M·L 실측표를 확인하고 평소 사이즈보다 여유 있게 선택하세요.', '대여 기간 안내':'1일, 1박 2일, 2박 3일 중 선택할 수 있어요.' };
function ChatDrawer() {
  const { dialog, setDialog } = useStore(); const [messages,setMessages]=useState([{from:'bot',text:'안녕하세요! 입어봄 AI 도우미예요. 무엇을 도와드릴까요?'}]); const [input,setInput]=useState('');
  const send=(text)=>{if(!text.trim())return; const answer=quickAnswers[text] || '문의하신 내용을 확인했어요. 현재 데모에서는 상품별 재고 안내를 제공하며, 실제 GPT 답변은 안전한 서버 API 연결 후 사용할 수 있습니다.'; setMessages((m)=>[...m,{from:'user',text},{from:'bot',text:answer}]);setInput('');};
  return <Drawer anchor="right" open={dialog==='chat'} onClose={()=>setDialog(null)} sx={panelSx} slotProps={{paper:{sx:{width:{xs:'100%',sm:460},p:0}}}}><Box sx={{bgcolor:'#7C4DFF',color:'#fff',p:2.5,display:'flex',justifyContent:'space-between'}}><Box><b>입어봄 AI 챗봇</b><Box sx={{fontSize:12,opacity:.8}}>대여부터 반납까지 물어보세요</Box></Box><IconButton onClick={()=>setDialog(null)} sx={{color:'#fff'}}><CloseRoundedIcon/></IconButton></Box><Box sx={{p:2,display:'flex',gap:1,flexWrap:'wrap'}}>{Object.keys(quickAnswers).map((q)=><Button key={q} size="small" variant="outlined" onClick={()=>send(q)}>{q}</Button>)}</Box><Box sx={{p:2,height:'calc(100vh - 230px)',overflowY:'auto',bgcolor:'#F7F5FB'}}>{messages.map((m,i)=><Box key={i} sx={{maxWidth:'82%',ml:m.from==='user'?'auto':0,mb:1.2,p:1.4,bgcolor:m.from==='user'?'#171717':'#fff',color:m.from==='user'?'#fff':'#171717',borderRadius:m.from==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px'}}>{m.text}</Box>)}</Box><Box sx={{p:2,display:'flex',gap:1}}><TextField fullWidth multiline maxRows={4} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input);}}} placeholder="질문을 입력하세요"/><IconButton onClick={()=>send(input)}><SendRoundedIcon/></IconButton></Box></Drawer>;
}

function ConsultDrawer(){const {dialog,setDialog,addToCart}=useStore();const products=useManagedProducts(ALL_PRODUCTS);const [step,setStep]=useState(0);const [answers,setAnswers]=useState({});const choices=[['성별',['남자','여자']],['연령',['10대','20~30대','40대','50대','60대 이상']],['목적',['졸업사진','가족사진','여행','코스프레','공연']]];const best=products[(Object.values(answers).join('').length*7)%products.length]||products[0];return <Drawer anchor="right" open={dialog==='consult'} onClose={()=>setDialog(null)} sx={panelSx} slotProps={{paper:{sx:{width:{xs:'100%',sm:560},p:3}}}}><Box sx={{display:'flex',justifyContent:'space-between'}}><Box sx={{fontFamily:FONTS.gmarket,fontSize:24}}>AI 맞춤 의상 추천</Box><IconButton onClick={()=>setDialog(null)}><CloseRoundedIcon/></IconButton></Box><Box sx={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:1,my:3}}>{['01 성별','02 연령','03 목적','04 취향','05 추천'].map((s,i)=><Box key={s} sx={{height:5,bgcolor:i<=step?'#49D6B4':'#ddd'}} title={s}/>)}</Box>{step<3&&<Box><Box sx={{fontSize:25,fontWeight:900,mb:1}}>반갑습니다, 고객님!</Box><Box sx={{fontSize:18,mb:3}}>{choices[step][0]}을(를) 알려주세요.</Box>{choices[step][1].map(c=><Button key={c} variant="outlined" onClick={()=>{setAnswers(a=>({...a,[choices[step][0]]:c}));setStep(step+1)}} sx={{m:.7,p:2}}>{c}</Button>)}</Box>}{step===3&&<Box><Box sx={{fontSize:20,fontWeight:900,mb:2}}>마음에 드는 의상을 골라주세요.</Box><Box sx={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1}}>{products.slice(0,15).map(p=><Box key={p.id} component="button" onClick={()=>setStep(4)} sx={{border:'1px solid #ddd',bgcolor:'#fff',p:.5,cursor:'pointer'}}><Box component="img" src={p.thumbnail} alt="" sx={{aspectRatio:'4/5',objectFit:'contain'}}/><Box sx={{fontSize:11,fontWeight:800}}>{p.name}</Box></Box>)}</Box></Box>}{step===4&&best&&<Box sx={{textAlign:'center'}}><Box sx={{fontSize:26,fontWeight:900}}>고객님 취향을 분석했어요!</Box><Box sx={{color:'#7C4DFF',fontSize:14,mt:1}}>BEST MATCH · 96%</Box><Box component="img" src={best.thumbnail} alt="" sx={{width:260,height:330,objectFit:'contain',mx:'auto',my:2,bgcolor:'#fff'}}/><Box sx={{fontSize:24,fontWeight:900}}>{best.name}</Box><Box sx={{color:'#777',my:1}}>고객님의 선택과 가장 잘 맞는 의상이에요.</Box><Box sx={{fontSize:22,fontWeight:900}}>{best.price.toLocaleString()}원</Box><Button variant="contained" onClick={()=>addToCart(best)} sx={{bgcolor:'#171717',mt:2}}>장바구니 담기</Button></Box>}</Drawer>}

export default function SiteDialogs(){const {toast,setToast}=useStore();return <><SearchDialog/><AccountDialog/><CartDialog/><TrackingDialog/><ChatDrawer/><ConsultDrawer/><Snackbar open={Boolean(toast)} message={toast} onClose={()=>setToast('')} anchorOrigin={{vertical:'bottom',horizontal:'center'}}/></>}
