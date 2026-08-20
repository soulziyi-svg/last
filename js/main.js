/* ==========================================================
   IBUBOM / 입어봄 - main.js
   ========================================================== */
"use strict";

/* ---------------- 공용 유틸 ---------------- */
function won(n){ return n.toLocaleString("ko-KR") + "원"; }
function $(sel, root){ return (root||document).querySelector(sel); }
function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

function showToast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove("show"), 2200);
}

function openModal(id){ const m=$("#"+id); if(m){ m.hidden=false; } }
function closeModal(id){ const m=$("#"+id); if(m){ m.hidden=true; } }

document.addEventListener("click", (e)=>{
  const closeEl = e.target.closest("[data-close]");
  if(closeEl){ closeModal(closeEl.dataset.close); }
  const switchEl = e.target.closest("[data-switch]");
  if(switchEl){
    const overlay = switchEl.closest(".modal-overlay");
    if(overlay) overlay.hidden = true;
    openModal(switchEl.dataset.switch);
  }
  if(e.target.classList && e.target.classList.contains("modal-overlay") && !e.target.classList.contains("side")){
    e.target.hidden = true;
  }
});

/* ---------------- 헤더 스크롤 축소 ---------------- */
const header = $("#siteHeader");
window.addEventListener("scroll", ()=>{
  header.classList.toggle("scrolled", window.scrollY > 40);
}, { passive:true });

/* ---------------- 로그인 / 회원 상태 ---------------- */
const AUTH_KEY = "ibubom_auth";
function getAuth(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)); }catch(e){ return null; } }
function setAuth(v){ localStorage.setItem(AUTH_KEY, JSON.stringify(v)); }
function clearAuth(){ localStorage.removeItem(AUTH_KEY); }

function applyAuthUI(){
  const auth = getAuth();
  const welcomeText = $("#welcomeText");
  const loginBtn = $("#loginOpenBtn");
  const adminBtn = $("#adminBtn");
  if(auth && auth.email){
    welcomeText.hidden = false;
    welcomeText.textContent = `${auth.email.split("@")[0]}님 반갑습니다.`;
    loginBtn.classList.add("logged");
    loginBtn.querySelector(".front").textContent = "로그아웃";
    loginBtn.querySelector(".back").textContent = "LOG OUT";
    adminBtn.hidden = auth.email.toLowerCase() !== "heechic@naver.com";
  }else{
    welcomeText.hidden = true;
    loginBtn.classList.remove("logged");
    loginBtn.querySelector(".front").textContent = "로그인";
    loginBtn.querySelector(".back").textContent = "SIGN IN";
    adminBtn.hidden = true;
  }
}

$("#loginOpenBtn").addEventListener("click", ()=>{
  const auth = getAuth();
  if(auth && auth.email){
    clearAuth();
    applyAuthUI();
    showToast("로그아웃 되었습니다");
  }else{
    openModal("loginModal");
  }
});

$("#submitLogin").addEventListener("click", ()=>{
  const email = $("#liEmail").value.trim();
  const pw = $("#liPw").value.trim();
  if(!email || !pw){ showToast("이메일과 비밀번호를 입력해주세요"); return; }
  setAuth({ email });
  applyAuthUI();
  closeModal("loginModal");
  showToast("로그인 되었습니다");
  $("#liEmail").value = ""; $("#liPw").value = "";
});
$("#findAccountBtn").addEventListener("click", ()=> showToast("고객센터 02-000-0000 으로 문의해주세요"));

$("#signupOpenBtn").addEventListener("click", ()=> openModal("signupModal"));

/* 회원가입 STEP1 : 약관 */
const agreeAll = $("#agreeAll");
const agreeItems = $all(".agree-item");
const toStep2Btn = $("#toSignupStep2");
function syncAgree(){
  const allChecked = agreeItems.every(i=>i.checked);
  agreeAll.checked = allChecked;
  toStep2Btn.disabled = !allChecked;
}
agreeAll.addEventListener("change", ()=>{
  agreeItems.forEach(i=> i.checked = agreeAll.checked);
  syncAgree();
});
agreeItems.forEach(i=> i.addEventListener("change", syncAgree));
toStep2Btn.addEventListener("click", ()=>{
  $("#signupStep1").hidden = true;
  $("#signupStep2").hidden = false;
});
$("#submitSignup").addEventListener("click", ()=>{
  const email = $("#suEmail").value.trim();
  const pw = $("#suPw").value.trim();
  const pw2 = $("#suPw2").value.trim();
  if(!email || !pw){ showToast("이메일과 비밀번호를 입력해주세요"); return; }
  if(pw !== pw2){ showToast("비밀번호가 일치하지 않습니다"); return; }
  $("#signupStep2").hidden = true;
  $("#signupStep3").hidden = false;
});

/* ---------------- 메가메뉴 ---------------- */
const megaMenu = $("#megaMenu");
function buildMegaColumns(cat){
  const meta = CATEGORY_META[cat];
  const cols = meta.order.map(sub=>{
    const items = productsByCatSub(cat, sub);
    const links = items.map(p=>`<a href="#" data-pid="${p.id}">${p.name}</a>`).join("");
    return `<div class="mega-col"><h5>${sub}</h5>${links}</div>`;
  }).join("");
  return `<div class="mega-cols">${cols}</div>`;
}
let megaOpenTimer = null;
$all(".nav-logo-btn").forEach(btn=>{
  btn.addEventListener("mouseenter", ()=>{
    clearTimeout(megaOpenTimer);
    const cat = btn.dataset.cat;
    $all(".nav-logo-btn").forEach(b=>b.classList.toggle("active", b===btn));
    megaMenu.dataset.cat = cat;
    megaMenu.innerHTML = buildMegaColumns(cat);
    megaMenu.classList.add("open");
  });
});
$("#mainNav").addEventListener("mouseleave", ()=>{
  megaOpenTimer = setTimeout(()=>{
    megaMenu.classList.remove("open");
    $all(".nav-logo-btn").forEach(b=>b.classList.remove("active"));
  }, 150);
});
megaMenu.addEventListener("click",(e)=>{
  const a = e.target.closest("[data-pid]");
  if(a){ e.preventDefault(); megaMenu.classList.remove("open"); openQuickView(a.dataset.pid); }
});

/* ---------------- 검색 모달 ---------------- */
const searchCats = $("#searchCats");
const searchBody = $("#searchBody");
Object.values(CATEGORY_META).forEach((meta,i)=>{
  const b = document.createElement("button");
  b.textContent = meta.label; b.dataset.cat = meta.key;
  if(i===0) b.classList.add("active");
  searchCats.appendChild(b);
});
function renderSearchBody(cat, keyword){
  const meta = CATEGORY_META[cat];
  keyword = (keyword||"").trim();
  searchBody.innerHTML = meta.order.map(sub=>{
    let items = productsByCatSub(cat, sub);
    if(keyword) items = items.filter(p=>p.name.includes(keyword) || sub.includes(keyword));
    if(!items.length) return "";
    return `<div class="search-sub">
      <div class="search-sub-title" data-sub="${sub}">${sub} ▾</div>
      <div class="search-sub-list">${items.map(p=>`<a href="#" data-pid="${p.id}">${p.name}</a>`).join("")}</div>
    </div>`;
  }).join("");
}
searchCats.addEventListener("click",(e)=>{
  const b = e.target.closest("button"); if(!b) return;
  $all("button", searchCats).forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  renderSearchBody(b.dataset.cat, $("#searchInput").value);
});
$("#searchInput").addEventListener("input", ()=>{
  const activeCat = $(".search-cats button.active").dataset.cat;
  renderSearchBody(activeCat, $("#searchInput").value);
});
searchBody.addEventListener("click",(e)=>{
  const title = e.target.closest(".search-sub-title");
  if(title){ title.nextElementSibling.style.display = title.nextElementSibling.style.display==="none" ? "flex":"none"; }
  const a = e.target.closest("[data-pid]");
  if(a){ e.preventDefault(); closeModal("searchModal"); openQuickView(a.dataset.pid); }
});
$("#searchIconBtn").addEventListener("click", ()=>{
  openModal("searchModal");
  renderSearchBody("hanbok","");
});

/* ---------------- 장바구니 ---------------- */
const CART_KEY = "ibubom_cart";
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch(e){ return []; } }
function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
function updateCartBadge(){
  const c = getCart();
  const count = c.reduce((s,i)=>s+i.qty,0);
  const badge = $("#cartCount");
  badge.textContent = count;
  badge.hidden = count===0;
}
const PERIOD_RATE = { "1일":1, "1박2일":1.3, "2박3일":1.6 };
function periodPrice(base, period){ return Math.round(base*PERIOD_RATE[period]/100)*100; }

function addToCart(productId, opts){
  opts = opts || {};
  const p = getProduct(productId);
  const sizes = ["S","M","L"].filter(s=>p.stock[s]>0);
  const cart = getCart();
  const item = {
    cartId: "c"+Date.now()+Math.floor(Math.random()*999),
    productId,
    size: opts.size || sizes[0] || "M",
    accessories: [],
    period: "1일",
    qty: 1
  };
  cart.push(item);
  setCart(cart);
  showToast("✓ 장바구니가 추가되었습니다.");
}

function cartItemUnit(item){
  const p = getProduct(item.productId);
  const base = periodPrice(p.price, item.period);
  const accTotal = item.accessories.reduce((s,a)=>s+a.price,0);
  return base + accTotal;
}

function renderCart(){
  const cart = getCart();
  const wrap = $("#cartItems");
  const summary = $("#cartSummary");
  if(!cart.length){
    wrap.innerHTML = `<div class="cart-empty">아직 장바구니가 비어있어요.<br/>오늘은 어떤 모습이 되어볼까요?</div>`;
    summary.innerHTML = "";
    return;
  }
  wrap.innerHTML = cart.map(item=>{
    const p = getProduct(item.productId);
    const unit = cartItemUnit(item) * item.qty;
    const sizeBtns = ["S","M","L"].map(s=>{
      const stock = p.stock[s];
      const soldout = stock<=0;
      return `<label style="opacity:${soldout?0.4:1}">
        <input type="radio" name="size-${item.cartId}" value="${s}" ${item.size===s?"checked":""} ${soldout?"disabled":""}/> ${s}${soldout?"(품절)":""}
      </label>`;
    }).join("");
    const accRows = p.accessories.map(a=>{
      const checked = item.accessories.some(x=>x.name===a.name);
      return `<label><span><input type="checkbox" data-acc="${a.name}" data-price="${a.price}" ${checked?"checked":""}/> ${a.name}</span><span>+${a.price.toLocaleString()}원</span></label>`;
    }).join("");
    const periodRows = ["1일","1박2일","2박3일"].map(per=>{
      return `<label><input type="radio" name="period-${item.cartId}" value="${per}" ${item.period===per?"checked":""}/> ${per} <span style="color:#888;font-size:11px;">${won(periodPrice(p.price,per))}</span></label>`;
    }).join("");
    return `<div class="cart-item" data-cid="${item.cartId}">
      <img class="cart-item-img" src="${p.images[0]}" alt="${p.name}"/>
      <div class="cart-item-body">
        <div class="cart-item-top">
          <div>
            <div class="cart-item-name">${p.name}</div>
            <div style="font-size:12px;color:#888;">${p.sub}</div>
          </div>
          <button class="cart-item-remove" data-remove="${item.cartId}">삭제</button>
        </div>
        <div class="cart-size-row">${sizeBtns}</div>
        ${p.accessories.length? `<div class="cart-acc-title">추가 구성 (다중선택)</div><div class="cart-acc-row">${accRows}</div>`:""}
        <div class="cart-period-title">대여기간</div>
        <div class="cart-period-row">${periodRows}</div>
        <div class="cart-qty">
          수량
          <button data-qty="-1">−</button>
          <span>${item.qty}</span>
          <button data-qty="1">+</button>
        </div>
        <div class="cart-item-price">상품금액 ${won(unit)}</div>
      </div>
    </div>`;
  }).join("");

  const productTotal = cart.reduce((s,i)=>{ const p=getProduct(i.productId); return s+periodPrice(p.price,i.period)*i.qty; },0);
  const accTotal = cart.reduce((s,i)=> s + i.accessories.reduce((a,x)=>a+x.price,0)*i.qty, 0);
  summary.innerHTML = `
    <div class="cart-summary-row"><span>선택상품</span><span>${cart.length}개</span></div>
    <div class="cart-summary-row"><span>상품금액</span><span>${won(productTotal)}</span></div>
    <div class="cart-summary-row"><span>액세서리</span><span>${won(accTotal)}</span></div>
    <div class="cart-summary-total"><span>총 결제 예정금액</span><span>${won(productTotal+accTotal)}</span></div>
    <button class="cart-checkout-btn" id="checkoutBtn">선택 상품 대여하기</button>
    <a href="#" class="cart-continue" data-close="cartModal">쇼핑 계속하기 →</a>
  `;
}

$("#cartItems").addEventListener("click",(e)=>{
  const cid = e.target.closest("[data-cid]")?.dataset.cid;
  if(e.target.dataset.remove){
    setCart(getCart().filter(i=>i.cartId!==e.target.dataset.remove));
    renderCart(); return;
  }
  if(e.target.dataset.qty && cid){
    const cart = getCart();
    const item = cart.find(i=>i.cartId===cid);
    item.qty = Math.max(1, item.qty + Number(e.target.dataset.qty));
    setCart(cart); renderCart(); return;
  }
});
$("#cartItems").addEventListener("change",(e)=>{
  const cid = e.target.closest("[data-cid]")?.dataset.cid;
  if(!cid) return;
  const cart = getCart();
  const item = cart.find(i=>i.cartId===cid);
  const p = getProduct(item.productId);
  if(e.target.name === `size-${cid}`) item.size = e.target.value;
  if(e.target.name === `period-${cid}`) item.period = e.target.value;
  if(e.target.dataset.acc){
    const name = e.target.dataset.acc, price = Number(e.target.dataset.price);
    if(e.target.checked) item.accessories.push({name, price});
    else item.accessories = item.accessories.filter(a=>a.name!==name);
  }
  setCart(cart); renderCart();
});
$("#cartModal").addEventListener("click",(e)=>{
  if(e.target.id === "checkoutBtn"){
    setCart([]);
    renderCart();
    closeModal("cartModal");
    showToast("대여 신청이 접수되었습니다. 감사합니다!");
  }
});
$("#cartIconBtn").addEventListener("click", ()=>{ openModal("cartModal"); renderCart(); });

/* ---------------- 배송조회 모달 ---------------- */
$("#trackingIconBtn").addEventListener("click", ()=>{
  $("#trackingBody").innerHTML = `
    <p class="track-product">달빛 하얀 소복</p>
    <p class="track-order-no">주문번호 IBUBOM-20260818-001</p>
    <p class="track-courier">천리마 퀵서비스 / 1234-5678-9012</p>
    <div class="track-steps">
      ${["done","done","current","","","",""].map((s,i)=>{
        const dot = `<div class="track-step-dot ${s?'done':''}"></div>`;
        const line = i<6 ? `<div class="track-step-line ${i<2?'done':''}"></div>` : "";
        return dot+line;
      }).join("")}
    </div>
    <div class="track-labels"><span>주문완료</span><span>상품준비중</span><span>배송중</span><span>배송완료</span><span>대여중</span><span>반납배송중</span><span>반납완료</span></div>
    <div class="track-log">08.18 09:20 &nbsp; 상품 준비중</div>
    <div class="track-eta">예상 도착일 <b>8월 18일 오후 예정</b></div>
    <div class="track-return">반납 예정일 2026.08.22</div>
  `;
  openModal("trackingModal");
});

/* ---------------- 배너 슬라이더 (coverflow) ---------------- */
const bannerTrack = $("#bannerTrack");
const bannerDots = $("#bannerDots");
let bannerIdx = 0;
BANNER_IMAGES.forEach((src,i)=>{
  const d = document.createElement("div");
  d.className = "banner-slide";
  d.style.backgroundImage = `url('${src}')`;
  d.dataset.i = i;
  bannerTrack.appendChild(d);
  const dot = document.createElement("div");
  dot.className = "banner-dot";
  dot.addEventListener("click", ()=>{ bannerIdx=i; renderBanner(); });
  bannerDots.appendChild(dot);
});
function renderBanner(){
  const slides = $all(".banner-slide", bannerTrack);
  const n = slides.length;
  slides.forEach((s,i)=>{
    s.classList.remove("active","prev","next","far");
    const diff = (i - bannerIdx + n) % n;
    if(diff===0) s.classList.add("active");
    else if(diff===1) s.classList.add("next");
    else if(diff===n-1) s.classList.add("prev");
    else s.classList.add("far");
  });
  $all(".banner-dot", bannerDots).forEach((d,i)=> d.classList.toggle("active", i===bannerIdx));
}
bannerTrack.addEventListener("click",(e)=>{
  const slide = e.target.closest(".banner-slide"); if(!slide) return;
  if(slide.classList.contains("prev")){ bannerIdx = (bannerIdx-1+BANNER_IMAGES.length)%BANNER_IMAGES.length; renderBanner(); }
  else if(slide.classList.contains("next")){ bannerIdx = (bannerIdx+1)%BANNER_IMAGES.length; renderBanner(); }
});
$("#bannerPrev").addEventListener("click", ()=>{ bannerIdx=(bannerIdx-1+BANNER_IMAGES.length)%BANNER_IMAGES.length; renderBanner(); });
$("#bannerNext").addEventListener("click", ()=>{ bannerIdx=(bannerIdx+1)%BANNER_IMAGES.length; renderBanner(); });
renderBanner();
setInterval(()=>{ bannerIdx=(bannerIdx+1)%BANNER_IMAGES.length; renderBanner(); }, 5000);

/* ---------------- 콘텐츠 섹션 렌더링 ---------------- */
function sizeBadges(stock){
  return ["S","M","L"].map(s=>{
    const v = stock[s];
    return `<span class="pcard-size ${v<=0?'soldout':''}">${s} · ${v<=0?'품절':v+'벌'}</span>`;
  }).join("");
}
function productCardHTML(p, catMeta){
  const flag = p.country ? (WORLD_FLAGS[p.country].startsWith("img/")
    ? `<img class="pcard-flag" src="${WORLD_FLAGS[p.country]}" alt="${p.country}"/>`
    : `<span class="pcard-flag-emoji">${WORLD_FLAGS[p.country]}</span>`) : "";
  const catBadge = !p.country ? `<span class="pcard-badge">${p.sub}</span>` : "";
  return `<div class="product-card" data-pid="${p.id}">
    <div class="pcard-img-wrap">
      <img class="pcard-img" src="${p.images[0]}" alt="${p.name}"/>
      <img class="pcard-img worn" src="${p.worn}" alt="${p.name} 착용컷"/>
      ${flag}${catBadge}
      ${p.hot ? `<span class="pcard-hot">HOT</span>`:""}
      <button class="pcard-cart" data-addcart="${p.id}" title="장바구니 담기">🛒</button>
    </div>
    <div class="pcard-body">
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-desc">${p.desc.join(" ")}</div>
      <div class="pcard-rating">★ ${p.rating} (${p.reviewCount})</div>
      <div class="pcard-meta">
        <span>2박3일 <b class="pcard-price">${won(p.price)}</b></span>
        ${p.popular?`<span class="pcard-popular">인기상품</span>`:""}
      </div>
      <div class="pcard-sizes">${sizeBadges(p.stock)}</div>
    </div>
  </div>`;
}

function renderContentSection(cat){
  const meta = CATEGORY_META[cat];
  const root = $(`#content-${cat}`);
  root.classList.add(meta.bgClass);

  const logoHTML = meta.logo
    ? `<img class="content-logo" src="${meta.logo}" alt="${meta.label} 로고"/>`
    : `<h2 class="content-logo-text" style="color:${meta.color}">${meta.label}</h2>`;

  const popularItems = randomPick(productsByCat(cat), 12);
  const popularHTML = popularItems.concat(popularItems).map(p=>`
    <div class="popular-card" style="background-image:url('${p.images[0]}')" data-pid="${p.id}">
      <div class="pc-info">
        <div class="pc-name">${p.name}</div>
        <div class="pc-desc">${p.desc[0]}</div>
        <div class="pc-more">자세히 보기 →</div>
      </div>
    </div>`).join("");

  const filterBtns = meta.order.map((sub,i)=>`<button class="cat-filter-btn" data-sub="${sub}" ${i===0?'':''}>${sub}</button>`).join("");

  const reviewHTML = REVIEW_IMAGES.map((img,i)=>{
    const tags = REVIEW_TAGS[cat];
    const t1 = tags[i%tags.length], t2=tags[(i+1)%tags.length], t3=tags[(i+2)%tags.length];
    return `<div class="review-card">
      <img class="review-photo" src="${img}" alt="후기 사진"/>
      <div class="review-stars">${"★".repeat(4)}${i%2?"★":"☆"} ${(4.5+ (i%2)*0.4).toFixed(1)}</div>
      <div class="review-name">${REVIEW_NAMES[i%REVIEW_NAMES.length]}</div>
      <div class="review-date">2026.0${(i%9)+1}.1${i%9}</div>
      <div class="review-text">"졸업사진 찍으려고 친구들이랑 같이 빌렸어요. 좋은 추억 입어보고 갑니다."</div>
      <div class="review-tags">${t1} ${t2} ${t3}</div>
    </div>`;
  }).join("");

  root.innerHTML = `
    <div class="content-inner">
      ${logoHTML}
      <h3 class="content-hero-title" style="${meta.key!=='cosplay'?`color:${meta.color==='#FFD84D'?'#C9A400':meta.color}`:''}">${meta.heroTitle}</h3>
      <p class="content-hero-desc">${meta.heroDesc}</p>

      <div class="popular-badge">인기상품</div>
      <div class="popular-slider"><div class="popular-track">${popularHTML}</div></div>

      <div class="cat-filter-row" data-cat="${cat}">${filterBtns}</div>
      <div class="sub-panel-list" id="subPanel-${cat}"></div>

      <div class="review-section">
        <h3 class="review-title"><span class="accent">${meta.label}</span>, 진짜로 입어봄</h3>
        <div class="review-grid">${reviewHTML}</div>
      </div>
    </div>
  `;

  const filterRow = $(`.cat-filter-row[data-cat="${cat}"]`, root);
  filterRow.addEventListener("click",(e)=>{
    const btn = e.target.closest(".cat-filter-btn"); if(!btn) return;
    $all(".cat-filter-btn", filterRow).forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderSubPanel(cat, btn.dataset.sub, meta, false);
  });
  // 첫 서브카테고리 기본 오픈
  filterRow.firstElementChild.classList.add("active");
  renderSubPanel(cat, meta.order[0], meta, false);

  root.addEventListener("click",(e)=>{
    const addBtn = e.target.closest("[data-addcart]");
    if(addBtn){ e.stopPropagation(); addToCart(addBtn.dataset.addcart); return; }
    const card = e.target.closest("[data-pid]");
    if(card){ openQuickView(card.dataset.pid); }
  });
}

function renderSubPanel(cat, sub, meta, showAll){
  const wrap = $(`#subPanel-${cat}`);
  const items = productsByCatSub(cat, sub);
  const visible = showAll ? items : items.slice(0,5);
  wrap.innerHTML = `<div class="sub-panel">
    <div class="sub-panel-grid">${visible.map(p=>productCardHTML(p, meta)).join("")}</div>
    ${items.length>5 ? `<div class="more-btn-wrap"><button class="more-btn" data-more="${showAll?'less':'more'}">${showAll?'접기':'더보기 (전체 '+items.length+'개)'}</button></div>`:""}
  </div>`;
  const moreBtn = $(".more-btn", wrap);
  if(moreBtn){
    moreBtn.addEventListener("click", ()=> renderSubPanel(cat, sub, meta, !showAll));
  }
}

["hanbok","world","cosplay","stage"].forEach(renderContentSection);

/* ---------------- 상품 퀵뷰 (상세페이지는 다음 단계에서 별도 구현 예정) ---------------- */
function openQuickView(pid){
  const p = getProduct(pid);
  if(!p) return;
  const meta = CATEGORY_META[p.cat];
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal" style="width:640px;max-width:92vw;">
    <button class="modal-close" data-qv-close>&times;</button>
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <img src="${p.images[0]}" alt="${p.name}" style="width:260px;height:340px;object-fit:cover;"/>
      <div style="flex:1;min-width:220px;">
        <div style="font-size:12px;color:#888;">${meta.label} · ${p.sub}</div>
        <h3 style="margin:6px 0;font-family:var(--font-friendly);">${p.name}</h3>
        <div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:10px;">${p.desc.join("<br/>")}</div>
        <div style="color:#C9A400;font-size:13px;margin-bottom:10px;">★ ${p.rating} (${p.reviewCount})</div>
        <div style="font-weight:800;font-size:20px;color:${meta.color};margin-bottom:14px;">${won(p.price)} <span style="font-size:12px;color:#999;">/ 1일</span></div>
        <div class="pcard-sizes" style="margin-bottom:16px;">${sizeBadges(p.stock)}</div>
        <button class="primary-btn" data-qv-add="${p.id}">장바구니 담기</button>
        <p style="font-size:11px;color:#aaa;margin-top:10px;">* 상품 상세페이지는 다음 단계에서 별도로 구현됩니다. 지금은 요약 정보만 보여드려요.</p>
      </div>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click",(e)=>{
    if(e.target===overlay || e.target.closest("[data-qv-close]")){ overlay.remove(); }
    if(e.target.closest("[data-qv-add]")){ addToCart(p.id); overlay.remove(); }
  });
}

/* ---------------- 챗봇 (목업 응답, GPT 연동은 추후) ---------------- */
const CHAT_KEYWORDS = [
  { label:"대여 방법안내", reply:"입어봄은 온라인에서 원하는 의상을 선택하고, 사이즈와 대여기간을 정한 뒤 결제하면 대여가 시작돼요. 대여 후에는 문 앞에 두기만 하면 반납이 완료됩니다." },
  { label:"배송/반납 안내", reply:"오늘 주문하시면 오늘 도착이 원칙이에요. 반납은 정해진 반납일에 문 앞에 놓아두시면 저희가 직접 수거해갑니다." },
  { label:"교환 안내", reply:"사이즈가 맞지 않는 경우 수령 후 3시간 이내 채팅 또는 전화로 알려주시면 빠르게 교환해드려요." },
  { label:"사이즈 가이드", reply:"각 상품 상세페이지 하단에서 가슴/허리/총장 실측 사이즈표를 확인하실 수 있어요. S/M/L 표준 사이즈로 제공됩니다." },
  { label:"대여 기간 안내", reply:"대여 기간은 1일 / 1박2일 / 2박3일 중 선택 가능하며, 기간이 길수록 요금이 할증됩니다 (1박2일 +30%, 2박3일 +60%)." }
];
const chatbotFab = $("#chatbotFab");
const chatbotKeywords = $("#chatbotKeywords");
const chatbotMessages = $("#chatbotMessages");
CHAT_KEYWORDS.forEach(k=>{
  const b = document.createElement("button");
  b.textContent = k.label;
  b.addEventListener("click", ()=>{ addChatMsg("user", k.label); setTimeout(()=>addChatMsg("bot", k.reply), 300); });
  chatbotKeywords.appendChild(b);
});
function addChatMsg(role, text){
  const d = document.createElement("div");
  d.className = "chat-msg " + role;
  d.textContent = text;
  chatbotMessages.appendChild(d);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
addChatMsg("bot", "안녕하세요! 입어봄 AI 상담원입니다. 궁금하신 점을 키워드로 선택하거나 자유롭게 입력해주세요 :)");

function mockBotReply(text){
  const lower = text.toLowerCase();
  if(text.includes("네즈코")){
    return "네즈코 코스프레 의상은 현재 대여 가능한 재고가 있습니다. 원하는 사이즈와 대여 날짜를 선택하면 해당 기간의 정확한 재고를 확인할 수 있어요. 가발과 대나무 소품 등 포함 구성도 상세페이지에서 확인할 수 있습니다.";
  }
  if(text.includes("사이즈") || text.includes("재고")){
    return "안녕하세요 고객님. 원하시는 상품명을 알려주시면 S/M/L 사이즈별 재고를 바로 확인해드릴게요.";
  }
  if(text.includes("가격") || text.includes("할인")){
    return "대여 가격은 상품마다 다르며, 단체 대여 시 추가 할인이 적용됩니다. 원하시는 상품을 알려주시면 정확한 견적을 안내해드릴게요.";
  }
  if(text.includes("배송") || text.includes("반납") || text.includes("세탁")){
    return "오늘 주문시 오늘 도착이 기본이며, 반납은 문 앞에 두시면 저희가 직접 수거합니다. 모든 의상은 100% 세탁 및 고온살균 처리 후 발송돼요.";
  }
  return "문의 감사합니다! 상품명, 사이즈, 대여 날짜를 함께 알려주시면 더 정확하게 안내해드릴 수 있어요. (현재는 목업 데모 응답이며, 실제 GPT API 연동은 이후 단계에서 진행됩니다.)";
}
const chatbotInput = $("#chatbotInput");
function sendChat(){
  const text = chatbotInput.value.trim();
  if(!text) return;
  addChatMsg("user", text);
  chatbotInput.value = "";
  chatbotInput.style.height = "auto";
  setTimeout(()=> addChatMsg("bot", mockBotReply(text)), 400);
}
$("#chatbotSend").addEventListener("click", sendChat);
chatbotInput.addEventListener("keydown",(e)=>{
  if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendChat(); }
});
chatbotInput.addEventListener("input", ()=>{
  chatbotInput.style.height="auto";
  chatbotInput.style.height = Math.min(120, chatbotInput.scrollHeight)+"px";
});
chatbotFab.addEventListener("click", ()=> openModal("chatbotModal"));

/* ---------------- 상담하기 (AI 맞춤추천 목업 플로우) ---------------- */
const consultFab = $("#consultFab");
const consultBody = $("#consultBody");
const consultProgress = $("#consultProgress");
const CONSULT_STEPS = ["성별","연령","목적","취향","추천"];
let consultState = { step:0, gender:"", age:"", purpose:"", picks:[] };

function renderProgress(){
  consultProgress.innerHTML = CONSULT_STEPS.map((s,i)=>`<span>${String(i+1).padStart(2,"0")} ${i<=consultState.step?`<b>${s}</b>`:s}</span>`).join(" — ");
}
function goStep(n){ consultState.step = n; renderConsult(); }

function renderConsult(){
  renderProgress();
  const step = consultState.step;
  let html = "";
  if(step===0){
    html = `<div class="consult-step"><p style="color:#888;">반갑습니다. 고객님!</p>
      <div class="consult-q">고객님의 성별을 알려주세요.</div>
      <div class="consult-choices">
        <button data-pick="gender" data-val="여자">여자</button>
        <button data-pick="gender" data-val="남자">남자</button>
      </div></div>`;
  }else if(step===1){
    html = `<div class="consult-step"><div class="consult-q">고객님의 연령대를 알려주세요.</div>
      <div class="consult-choices">
        ${["10대","20~30대","40대","50대","60대 이상"].map(a=>`<button data-pick="age" data-val="${a}">${a}</button>`).join("")}
      </div></div>`;
  }else if(step===2){
    html = `<div class="consult-step"><div class="consult-q">대여 목적은 무엇인가요?</div>
      <div class="consult-choices">
        ${["졸업사진","가족사진","여행","코스프레","공연"].map(a=>`<button data-pick="purpose" data-val="${a}">${a}</button>`).join("")}
      </div></div>`;
  }else if(step===3){
    if(!consultState.pool){ consultState.pool = randomPick(PRODUCTS, 50); }
    html = `<div class="consult-step"><div class="consult-q">마음에 드시는 의상을 모두 골라주세요</div>
      <div class="consult-outfit-grid">
        ${consultState.pool.map(p=>`<div class="consult-outfit-card ${consultState.picks.includes(p.id)?'selected':''}" data-pid="${p.id}">
          <img src="${p.images[0]}" alt="${p.name}"/><span>${p.name}</span>
        </div>`).join("")}
      </div>
      <button class="consult-next-btn" id="toResultBtn" ${consultState.picks.length? "":"disabled"}>다음</button>
    </div>`;
  }else if(step===4){
    const picks = consultState.picks.map(getProduct).filter(Boolean);
    const best = picks[0] || randomPick(PRODUCTS,1)[0];
    const others = (picks.slice(1,4).length? picks.slice(1,4) : randomPick(PRODUCTS,3));
    const pcts = [94,91,88];
    html = `<div class="consult-step">
      <div class="consult-q">고객님 취향을 분석했어요!</div>
      <div class="consult-result-head">선택하신 정보를 기준으로 잘 어울릴 만한 의상을 골라봤어요.<br/>
      ${consultState.gender} · ${consultState.age} · ${consultState.purpose} 선호</div>
      <div class="consult-best">
        <div class="consult-best-badge">BEST MATCH 96%</div>
        <img src="${best.images[0]}" alt="${best.name}"/>
        <div class="consult-best-name">${best.name}</div>
        <p style="font-size:13px;color:#888;">고객님의 선택과 가장 잘 맞는 의상이에요</p>
        <div class="consult-best-price">1일 대여 ${won(best.price)}</div>
        <div class="consult-best-actions">
          <button class="more-btn" data-view="${best.id}">상품 자세히 보기 →</button>
          <button class="primary-btn" style="width:auto;margin:0;" data-addcart="${best.id}">장바구니 담기</button>
        </div>
      </div>
      <div class="consult-more-title">이런 의상도 좋아하실 것 같아요</div>
      <div class="consult-more-grid">
        ${others.map((p,i)=>`<div data-pid="${p.id}"><img src="${p.images[0]}" alt="${p.name}"/><div class="pct">${pcts[i]}%</div><div class="nm">${p.name}</div></div>`).join("")}
      </div>
    </div>`;
  }
  consultBody.innerHTML = html;
}

consultBody.addEventListener("click",(e)=>{
  const pick = e.target.closest("[data-pick]");
  if(pick){
    consultState[pick.dataset.pick] = pick.dataset.val;
    goStep(consultState.step+1);
    return;
  }
  const card = e.target.closest(".consult-outfit-card");
  if(card){
    const id = card.dataset.pid;
    const idx = consultState.picks.indexOf(id);
    if(idx>-1) consultState.picks.splice(idx,1); else consultState.picks.push(id);
    renderConsult();
    return;
  }
  if(e.target.id==="toResultBtn"){ goStep(4); return; }
  const view = e.target.closest("[data-view]");
  if(view){ openQuickView(view.dataset.view); return; }
  const add = e.target.closest("[data-addcart]");
  if(add){ addToCart(add.dataset.addcart); return; }
  const more = e.target.closest(".consult-more-grid [data-pid]");
  if(more){ openQuickView(more.dataset.pid); }
});
consultFab.addEventListener("click", ()=>{
  consultState = { step:0, gender:"", age:"", purpose:"", picks:[] };
  openModal("consultModal");
  renderConsult();
});

/* ---------------- 초기화 ---------------- */
applyAuthUI();
updateCartBadge();
