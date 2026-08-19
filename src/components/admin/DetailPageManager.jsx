import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { nezukoDetailDefaults } from '../../data/nezukoDetailDefaults';
import { readDetailPage, resetDetailPage, saveDetailPage } from '../../hooks/useManagedDetailPage';

const groupSx = { p:{xs:2,md:3}, border:'1px solid #E7E8EC', borderRadius:3, bgcolor:'#fff' };
const gridSx = { display:'grid', gridTemplateColumns:{xs:'1fr',md:'1fr 1fr'}, gap:2 };
const titles = { detail:'상세 설명', worn:'착용 사진', video:'영상', reviews:'후기' };

export default function DetailPageManager({ readOnly=false }) {
  const [form,setForm] = useState(readDetailPage);
  const set = (key,value) => setForm((p)=>({ ...p,[key]:value }));
  const nested = (group,key,value) => setForm((p)=>({ ...p,[group]:{...p[group],[key]:value} }));
  const save = () => { saveDetailPage(form); window.alert('저장했습니다. 실제 상세페이지에 바로 반영됩니다.'); };
  const reset = () => { resetDetailPage(); setForm(nezukoDetailDefaults); };
  const updateReview = (i,key,value) => setForm((p)=>({ ...p,reviews:p.reviews.map((r,n)=>n===i?{...r,[key]:value}:r) }));
  return <Box sx={{p:{xs:2,md:3}, bgcolor:'#F8F8FA'}}>
    <Box sx={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',gap:2,mb:3}}><Box><Box sx={{fontSize:24,fontWeight:900}}>네즈코 상세페이지 관리</Box><Box sx={{color:'#737780',mt:.5}}>수정한 내용은 같은 브라우저의 상품 상세페이지에 즉시 반영됩니다.</Box></Box><Box sx={{display:'flex',gap:1}}><Button variant="outlined" onClick={()=>window.open(`${import.meta.env.BASE_URL}#/product/cosplay-38`,'_blank')}>미리보기</Button>{!readOnly&&<><Button variant="outlined" color="inherit" onClick={reset}>초기화</Button><Button variant="contained" onClick={save} sx={{bgcolor:'#171717'}}>저장하고 반영</Button></>}</Box></Box>
    <Box sx={{display:'grid',gap:2.5}}>
      <Paper elevation={0} sx={groupSx}><h3>기본 정보</h3><Box sx={gridSx}><TextField label="상품명" value={form.productName} onChange={e=>set('productName',e.target.value)}/><TextField label="카테고리" value={form.category} onChange={e=>set('category',e.target.value)}/><TextField type="number" label="가격" value={form.price} onChange={e=>set('price',Number(e.target.value))}/><TextField type="number" label="할인율 (%)" value={form.discountRate} onChange={e=>set('discountRate',Number(e.target.value))}/><TextField select label="재고 상태" value={form.stockStatus} onChange={e=>set('stockStatus',e.target.value)}>{['판매 중','재고 부족','품절'].map(x=><MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField></Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>이미지 관리</h3><Box sx={gridSx}>{[['main','대표 이미지'],['thumbnail','썸네일'],['worn','착용 사진'],['accessories','구성품·악세사리 사진']].map(([k,l])=><TextField key={k} label={l} value={form.images[k]} onChange={e=>nested('images',k,e.target.value)} helperText="/img/... 경로 또는 https:// 주소"/>)}</Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>상품 설명</h3><Box sx={gridSx}><TextField label="한 줄 소개" value={form.shortDescription} onChange={e=>set('shortDescription',e.target.value)} sx={{gridColumn:{md:'1/-1'}}}/><TextField multiline minRows={4} label="자세한 설명" value={form.description} onChange={e=>set('description',e.target.value)} sx={{gridColumn:{md:'1/-1'}}}/>{form.features.map((x,i)=><TextField key={i} label={`특징 ${i+1}`} value={x} onChange={e=>set('features',form.features.map((v,n)=>n===i?e.target.value:v))}/>)}</Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>대여 옵션·구성품</h3><Box sx={gridSx}><TextField label="사이즈 (쉼표 구분)" value={form.rental.sizes.join(', ')} onChange={e=>nested('rental','sizes',e.target.value.split(',').map(x=>x.trim()).filter(Boolean))}/><TextField type="number" label="전체 수량" value={form.rental.quantity} onChange={e=>nested('rental','quantity',Number(e.target.value))}/>{['S','M','L'].map(s=><TextField key={s} type="number" label={`${s} 사이즈 재고`} value={form.rental.sizeStock[s]||0} onChange={e=>nested('rental','sizeStock',{...form.rental.sizeStock,[s]:Number(e.target.value)})}/>) }<TextField label="대여 기간 (쉼표 구분)" value={form.rental.periods.join(', ')} onChange={e=>nested('rental','periods',e.target.value.split(',').map(x=>x.trim()).filter(Boolean))}/></Box><Box sx={{mt:2}}>{[['costume','의상 포함'],['wig','가발 포함'],['props','소품 포함']].map(([k,l])=><FormControlLabel key={k} control={<Checkbox checked={form.inclusions[k]} onChange={e=>nested('inclusions',k,e.target.checked)}/>} label={l}/>)}</Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>사이즈표</h3><Box sx={{overflowX:'auto'}}>{form.sizeTable.map((row,i)=><Box key={row.size} sx={{display:'grid',gridTemplateColumns:'80px repeat(3,minmax(130px,1fr))',gap:1,mb:1,minWidth:560}}>{[['size','사이즈'],['chest','가슴'],['waist','허리'],['length','총장']].map(([k,l])=><TextField key={k} size="small" label={l} value={row[k]} onChange={e=>set('sizeTable',form.sizeTable.map((r,n)=>n===i?{...r,[k]:e.target.value}:r))}/>)}</Box>)}</Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>배송·반납 / 관리 방법</h3><Box sx={gridSx}>{[['delivery','fee','배송비'],['delivery','arrival','도착 예정일'],['delivery','returnMethod','반납 방법'],['delivery','exchange','교환 안내'],['care','material','소재'],['care','washing','세탁법'],['care','caution','착용 주의사항']].map(([g,k,l])=><TextField key={`${g}${k}`} label={l} value={form[g][k]} onChange={e=>nested(g,k,e.target.value)} multiline={k==='returnMethod'||k==='exchange'||k==='caution'}/>)}</Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>후기 관리</h3><Box sx={{display:'grid',gap:2}}>{form.reviews.map((r,i)=><Box key={i} sx={{p:2,border:'1px solid #ECEDEF',borderRadius:2,...gridSx}}><FormControlLabel control={<Checkbox checked={r.visible} onChange={e=>updateReview(i,'visible',e.target.checked)}/>} label={`후기 ${i+1} 노출`}/><TextField label="작성자" value={r.author} onChange={e=>updateReview(i,'author',e.target.value)}/><TextField label="후기 이미지" value={r.image} onChange={e=>updateReview(i,'image',e.target.value)} sx={{gridColumn:{md:'1/-1'}}}/><TextField type="number" label="별점" value={r.rating} inputProps={{min:0,max:5,step:.5}} onChange={e=>updateReview(i,'rating',Number(e.target.value))}/><TextField multiline label="후기 내용" value={r.text} onChange={e=>updateReview(i,'text',e.target.value)}/></Box>)}</Box></Paper>
      <Paper elevation={0} sx={groupSx}><h3>화면 순서·공개 설정</h3><Box sx={gridSx}>{form.sectionOrder.map((value,i)=><TextField key={i} select label={`${i+1}번째 영역`} value={value} onChange={e=>set('sectionOrder',form.sectionOrder.map((v,n)=>n===i?e.target.value:v))}>{Object.entries(titles).map(([k,l])=><MenuItem key={k} value={k} disabled={form.sectionOrder.includes(k)&&k!==value}>{l}</MenuItem>)}</TextField>)}<TextField select label="공개 설정" value={form.visibility} onChange={e=>set('visibility',e.target.value)}>{['작성 중','공개','품절','숨김'].map(x=><MenuItem key={x} value={x}>{x}</MenuItem>)}</TextField></Box></Paper>
    </Box>
  </Box>;
}
