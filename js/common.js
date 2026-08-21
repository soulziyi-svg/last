/* ==========================================================
   IBUBOM / 입어봄 - common.js
   헤더/모달/인증/장바구니/검색/배송조회/떠다니는 아이콘 등
   index.html, product.html 양쪽에서 공유하는 로직
   ========================================================== */
"use strict";

/* ---------------- 공용 유틸 ---------------- */
function won(n){ return n.toLocaleString("ko-KR") + "원"; }
function $(sel, root){ return (root||document).querySelector(sel); }
function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

function showToast(msg){
  const t = $("#toast");
  if(!t) return;
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

/* ---------------- 헤더 스크롤 축소 (홈페이지 전용, 있을 때만 동작) ---------------- */
const header = $("#siteHeader");
if(header && header.classList.contains("shrink-on-scroll")){
  window.addEventListener("scroll", ()=>{
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive:true });
}

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
  if(!welcomeText || !loginBtn) return;
  if(auth && auth.email){
    welcomeText.hidden = false;
    welcomeText.textContent = `${auth.email.split("@")[0]}님 반갑습니다.`;
    loginBtn.classList.add("logged");
    loginBtn.querySelector(".front").textContent = "로그아웃";
    loginBtn.querySelector(".back").textContent = "LOG OUT";
    if(adminBtn) adminBtn.hidden = auth.email.toLowerCase() !== "heechic@naver.com";
  }else{
    welcomeText.hidden = true;
    loginBtn.classList.remove("logged");
    loginBtn.querySelector(".front").textContent = "로그인";
    loginBtn.querySelector(".back").textContent = "SIGN IN";
    if(adminBtn) adminBtn.hidden = true;
  }
}

if($("#loginOpenBtn")){
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
}

/* ---------------- 검색 모달 ---------------- */
if($("#searchIconBtn")){
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
        <div class="search-sub-list">${items.map(p=>`<a href="product.html?id=${p.id}">${p.name}</a>`).join("")}</div>
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
  $("#searchIconBtn").addEventListener("click", ()=>{
    openModal("searchModal");
    renderSearchBody("hanbok","");
  });
}

/* ---------------- 장바구니 ---------------- */
const CART_KEY = "ibubom_cart";
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch(e){ return []; } }
function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
function updateCartBadge(){
  const c = getCart();
  const count = c.reduce((s,i)=>s+i.qty,0);
  const badge = $("#cartCount");
  if(!badge) return;
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
  if(!wrap) return;
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
      <a href="product.html?id=${p.id}"><img class="cart-item-img" src="${p.images[0]}" alt="${p.name}"/></a>
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

if($("#cartItems")){
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
}

/* ---------------- 배송조회 모달 ---------------- */
if($("#trackingIconBtn")){
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
}

/* ---------------- 떠다니는 인터랙션 아이콘 + 영상 이스터에그 ---------------- */
(function floatingIcon(){
  const wrap = $("#floatIconWrap");
  const toggle = $("#floatIconToggle");
  if(!wrap || !toggle) return;

  const ICON_SIZE = 50;
  let x = Math.random()*(window.innerWidth-ICON_SIZE);
  let y = Math.random()*(window.innerHeight-ICON_SIZE)*0.6 + 120;
  let vx = (Math.random()<0.5?-1:1) * (0.4+Math.random()*0.5);
  let vy = (Math.random()<0.5?-1:1) * (0.4+Math.random()*0.5);
  let raf = null;
  let running = false;

  const LS_TOGGLE_KEY = "ibubom_float_icon_on";

  function setImgDirection(){
    wrap.style.backgroundImage = `url('${vx < 0 ? "img/좌.gif" : "img/우.gif"}')`;
  }

  function step(){
    x += vx; y += vy;
    const maxX = window.innerWidth-ICON_SIZE;
    const maxY = window.innerHeight-ICON_SIZE;
    let bounced = false;
    if(x<=0){ x=0; vx=Math.abs(vx); bounced=true; }
    if(x>=maxX){ x=maxX; vx=-Math.abs(vx); bounced=true; }
    if(y<=90){ y=90; vy=Math.abs(vy); }
    if(y>=maxY){ y=maxY; vy=-Math.abs(vy); }
    if(Math.random()<0.01){ vy = (Math.random()<0.5?-1:1) * (0.3+Math.random()*0.6); }
    if(bounced) setImgDirection();
    wrap.style.transform = `translate(${x}px,${y}px)`;
    raf = requestAnimationFrame(step);
  }
  function start(){
    if(running) return;
    running = true;
    wrap.hidden = false;
    setImgDirection();
    raf = requestAnimationFrame(step);
  }
  function stop(){
    running = false;
    wrap.hidden = true;
    if(raf) cancelAnimationFrame(raf);
  }

  const saved = localStorage.getItem(LS_TOGGLE_KEY);
  const on = saved === null ? true : saved === "1";
  toggle.checked = on;
  if(on) start();

  toggle.addEventListener("change", ()=>{
    localStorage.setItem(LS_TOGGLE_KEY, toggle.checked ? "1":"0");
    if(toggle.checked) start(); else stop();
  });

  const videoOverlay = $("#easterEggOverlay");
  const video = $("#easterEggVideo");
  let videoTimer = null;
  wrap.addEventListener("click", (e)=>{
    e.stopPropagation();
    if(!videoOverlay || !video) return;
    videoOverlay.hidden = false;
    videoOverlay.classList.remove("show");
    void videoOverlay.offsetWidth;
    videoOverlay.classList.add("show");
    video.currentTime = 0;
    video.play().catch(()=>{});
    clearTimeout(videoTimer);
    videoTimer = setTimeout(()=>{
      videoOverlay.classList.remove("show");
      videoOverlay.classList.add("hide");
      setTimeout(()=>{
        videoOverlay.hidden = true;
        videoOverlay.classList.remove("hide");
        video.pause();
      }, 400);
    }, 5000);
  });
})();
