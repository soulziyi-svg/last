/* ==========================================================
   IBUBOM / 입어봄 - admin.js (관리자페이지)
   전부 localStorage 기반으로 동작하며, 여기서 저장한 값은
   js/data.js 의 loadOverrides()/getSiteText() 를 통해
   index.html · product.html 전체에 그대로 반영됩니다.
   ========================================================== */
"use strict";

function $(sel, root){ return (root||document).querySelector(sel); }
function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
function won(n){ return Number(n||0).toLocaleString("ko-KR") + "원"; }
function showToast(msg){
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove("show"), 2200);
}
function openModal(id){ $("#"+id).hidden = false; }
function closeModal(id){ $("#"+id).hidden = true; }
document.addEventListener("click",(e)=>{
  const c = e.target.closest("[data-close]");
  if(c) closeModal(c.dataset.close);
});

/* 주문/달력 데모 기준일 (시드 데이터가 2026년 8월 기준으로 생성됨) */
const REFERENCE_TODAY = "2026-08-18";

/* ---------------- 관리자 인증 가드 ---------------- */
const AUTH_KEY = "ibubom_auth";
function getAuth(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)); }catch(e){ return null; } }
function setAuth(v){ localStorage.setItem(AUTH_KEY, JSON.stringify(v)); }
function isAdmin(){ const a = getAuth(); return a && a.email && a.email.toLowerCase()==="heechic@naver.com"; }

function checkAuthGuard(){
  const guard = $("#adminGuard");
  const content = $("#adminContent");
  if(isAdmin()){
    guard.hidden = true;
    content.hidden = false;
    $("#adminWho").textContent = getAuth().email + " 님";
  }else{
    guard.hidden = false;
    content.hidden = true;
  }
}
$("#devAdminLogin").addEventListener("click", ()=>{
  setAuth({ email: "heechic@naver.com" });
  checkAuthGuard();
  goPage("dashboard");
});
$("#adminLogout").addEventListener("click", ()=>{
  localStorage.removeItem(AUTH_KEY);
  checkAuthGuard();
});

/* ---------------- 페이지 라우팅 ---------------- */
const PAGE_TITLES = {
  dashboard:"대시보드", mainpage:"메인페이지 관리", products:"상품관리",
  calendar:"예약달력", stock:"재고·사이즈", orders:"주문관리", reviews:"후기관리",
  settings:"챗봇 / API 설정"
};
const PAGE_RENDER = {
  dashboard: renderDashboard, mainpage: renderMainPage, products: renderProducts,
  calendar: renderCalendar, stock: renderStock, orders: renderOrders, reviews: renderReviews,
  settings: renderSettings
};
function goPage(page){
  $all(".admin-gnb-btn").forEach(b=> b.classList.toggle("active", b.dataset.page===page));
  $("#pageTitle").textContent = PAGE_TITLES[page];
  PAGE_RENDER[page]();
}
$("#adminGnb").addEventListener("click",(e)=>{
  const b = e.target.closest(".admin-gnb-btn"); if(!b) return;
  goPage(b.dataset.page);
});

/* ---------------- 대시보드 ---------------- */
function renderDashboard(){
  const orders = getOrders();
  const totalProducts = PRODUCTS.length;
  const visibleProducts = PRODUCTS.filter(p=>!p.hidden).length;
  const todayShip = orders.filter(o=>o.date===REFERENCE_TODAY).length;
  const todayReturn = orders.filter(o=>o.dueDate===REFERENCE_TODAY).length;
  const todaySales = orders.filter(o=>o.date===REFERENCE_TODAY).reduce((s,o)=>s+o.amount,0);
  const monthSales = orders.filter(o=>o.date.startsWith("2026-08")).reduce((s,o)=>s+o.amount,0);
  const lowStock = PRODUCTS.filter(p=> !p.hidden && (p.stock.S+p.stock.M+p.stock.L) <= 2);

  $("#pageBody").innerHTML = `
    <div class="dash-grid">
      <div class="dash-tile"><span>전체 상품 수량</span><b>${totalProducts}개</b><small>공개중 ${visibleProducts}개</small></div>
      <div class="dash-tile"><span>오늘 출고 수량</span><b>${todayShip}건</b><small>${REFERENCE_TODAY} 기준</small></div>
      <div class="dash-tile"><span>오늘 반납예정 수량</span><b>${todayReturn}건</b><small>${REFERENCE_TODAY} 기준</small></div>
      <div class="dash-tile accent"><span>오늘의 매출</span><b>${won(todaySales)}</b><small>${REFERENCE_TODAY} 기준</small></div>
      <div class="dash-tile accent"><span>이번달 매출</span><b>${won(monthSales)}</b><small>2026년 8월</small></div>
      <div class="dash-tile warn"><span>재고 부족 상품</span><b>${lowStock.length}개</b><small>합계 재고 2벌 이하</small></div>
    </div>

    <h3 class="admin-subtitle">최근 주문 ${orders.length}건 중 최신 8건</h3>
    <table class="admin-table">
      <thead><tr><th>주문번호</th><th>고객명</th><th>상품명</th><th>주문일</th><th>결제금액</th><th>상태</th></tr></thead>
      <tbody>
        ${orders.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map(o=>`
          <tr><td>${o.orderNo}</td><td>${o.customer}</td><td>${o.productName}</td><td>${o.date}</td><td>${won(o.amount)}</td><td><span class="status-badge s-${o.status}">${o.status}</span></td></tr>
        `).join("")}
      </tbody>
    </table>

    ${lowStock.length ? `<h3 class="admin-subtitle">재고 부족 상품</h3>
    <table class="admin-table">
      <thead><tr><th>상품명</th><th>카테고리</th><th>S</th><th>M</th><th>L</th></tr></thead>
      <tbody>${lowStock.map(p=>`<tr><td>${p.name}</td><td>${CATEGORY_META[p.cat].label}</td><td>${p.stock.S}</td><td>${p.stock.M}</td><td>${p.stock.L}</td></tr>`).join("")}</tbody>
    </table>` : ""}
  `;
}

/* ---------------- 메인페이지 관리 ---------------- */
function renderMainPage(){
  const t = getSiteText();
  $("#pageBody").innerHTML = `
    <div class="admin-form-card">
      <h3 class="admin-subtitle">공통 문구</h3>
      <label class="admin-field">메인 태그라인<input type="text" id="mpTagline" value="${t.mainTagline}"/></label>
      <label class="admin-field">상단 배너(탑배너) 문구<input type="text" id="mpTopBanner" value="${t.topBanner}"/></label>
      <label class="admin-field">챗봇 첫 인사말<textarea id="mpChat" rows="2">${t.chatbotGreeting}</textarea></label>
      <label class="admin-field">상담하기 첫 인사말<textarea id="mpConsult" rows="2">${t.consultGreeting}</textarea></label>
      <label class="admin-field">푸터 브랜드 문구(줄바꿈 가능)<textarea id="mpFooter" rows="2">${t.footerBrand}</textarea></label>

      <h3 class="admin-subtitle">콘텐츠별 문구</h3>
      ${["hanbok","world","cosplay","stage"].map(cat=>{
        const meta = CATEGORY_META[cat];
        return `<div class="admin-content-block">
          <h4>${meta.label}</h4>
          <label class="admin-field">타이틀<input type="text" data-hero-title="${cat}" value="${t.heroTitle[cat] || meta.heroTitle}"/></label>
          <label class="admin-field">상세설명<textarea rows="3" data-hero-desc="${cat}">${t.heroDesc[cat] || meta.heroDesc}</textarea></label>
        </div>`;
      }).join("")}
      <button type="button" class="primary-btn" id="mpSave" style="width:auto;">저장하고 사이트에 반영</button>
    </div>
  `;
  $("#mpSave").addEventListener("click", ()=>{
    const heroTitle = {}, heroDesc = {};
    $all("[data-hero-title]").forEach(el=> heroTitle[el.dataset.heroTitle] = el.value);
    $all("[data-hero-desc]").forEach(el=> heroDesc[el.dataset.heroDesc] = el.value);
    saveSiteText({
      mainTagline: $("#mpTagline").value,
      topBanner: $("#mpTopBanner").value,
      chatbotGreeting: $("#mpChat").value,
      consultGreeting: $("#mpConsult").value,
      footerBrand: $("#mpFooter").value,
      heroTitle, heroDesc
    });
    showToast("저장되었습니다. 사이트에 즉시 반영됩니다.");
  });
}

/* ---------------- 상품관리 ---------------- */
let productSearchKeyword = "";
function renderProducts(){
  $("#pageBody").innerHTML = `
    <div class="admin-toolbar">
      <input type="text" id="productSearch" placeholder="상품명 / 카테고리로 검색" value="${productSearchKeyword}"/>
      <button type="button" class="primary-btn" id="productAddBtn" style="width:auto;">+ 상품등록</button>
    </div>
    <table class="admin-table" id="productTable">
      <thead><tr><th>이미지</th><th>카테고리</th><th>분류</th><th>상품명</th><th>가격</th><th>재고(S/M/L)</th><th>상태</th><th></th></tr></thead>
      <tbody id="productTableBody"></tbody>
    </table>
  `;
  renderProductRows();
  $("#productSearch").addEventListener("input", (e)=>{ productSearchKeyword = e.target.value; renderProductRows(); });
  $("#productAddBtn").addEventListener("click", ()=> openProductEditor(null));
  $("#productTableBody").addEventListener("click",(e)=>{
    const editBtn = e.target.closest("[data-edit]");
    const delBtn = e.target.closest("[data-del]");
    if(editBtn) openProductEditor(editBtn.dataset.edit);
    if(delBtn){
      const p = getProduct(delBtn.dataset.del);
      if(!p) return;
      if(!confirm(`'${p.name}' 상품을 목록에서 숨기시겠습니까? (삭제 대신 숨김 처리되며 관리자페이지에서 다시 공개할 수 있습니다)`)) return;
      saveProductOverride(p.id, { hidden:true });
      p.hidden = true;
      renderProductRows();
      showToast("상품이 숨김 처리되었습니다.");
    }
  });
}
function renderProductRows(){
  const kw = productSearchKeyword.trim();
  let list = PRODUCTS.filter(p=>{
    if(!kw) return true;
    return p.name.includes(kw) || p.sub.includes(kw) || CATEGORY_META[p.cat].label.includes(kw);
  });
  $("#productTableBody").innerHTML = list.map(p=>`
    <tr>
      <td><img class="admin-thumb" src="${p.images[0]}" alt="${p.name}"/></td>
      <td>${CATEGORY_META[p.cat].label}</td>
      <td>${p.sub}</td>
      <td>${p.name}${p.hidden?' <span class="tag-hidden">숨김</span>':''}</td>
      <td>${won(p.price)}</td>
      <td>${p.stock.S}/${p.stock.M}/${p.stock.L}</td>
      <td>${p.hidden ? '숨김' : (p.stock.S+p.stock.M+p.stock.L<=0 ? '품절' : '공개')}</td>
      <td class="admin-row-actions">
        <button type="button" data-edit="${p.id}">수정</button>
        <button type="button" data-del="${p.id}" class="danger">${p.hidden?'숨김중':'삭제'}</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="8" style="text-align:center;color:#999;padding:30px;">검색 결과가 없습니다.</td></tr>`;
}

function openProductEditor(id){
  const editing = !!id;
  const p = editing ? getProduct(id) : null;
  $("#productEditTitle").textContent = editing ? `상품 수정 - ${p.name}` : "새 상품 등록";
  $("#peCat").value = p ? p.cat : "hanbok";
  $("#peSub").value = p ? p.sub : "";
  $("#peName").value = p ? p.name : "";
  $("#pePrice").value = p ? p.price : 24000;
  $("#peImages").value = p ? p.images.join(", ") : "";
  $("#peWorn").value = p ? (p.worn||"") : "";
  $("#peDesc").value = p ? (Array.isArray(p.desc)?p.desc.join("\n"):p.desc) : "";
  $("#peStockS").value = p ? p.stock.S : 5;
  $("#peStockM").value = p ? p.stock.M : 5;
  $("#peStockL").value = p ? p.stock.L : 5;
  $("#peVisible").value = p && p.hidden ? "hidden" : "visible";
  $("#peHot").checked = !!(p && p.hot);
  $("#pePopular").checked = !!(p && p.popular);
  const previewLink = $("#pePreviewLink");
  if(editing){ previewLink.href = `product.html?id=${id}`; previewLink.style.display=""; }
  else previewLink.style.display = "none";

  $("#peSave").onclick = ()=>{
    const images = $("#peImages").value.split(",").map(s=>s.trim()).filter(Boolean);
    const patch = {
      cat: $("#peCat").value,
      sub: $("#peSub").value.trim() || "기타",
      name: $("#peName").value.trim() || "이름없는 상품",
      price: Number($("#pePrice").value) || 0,
      images: images.length ? images : ["img/베너/000.png"],
      worn: $("#peWorn").value.trim() || images[0] || "img/베너/000.png",
      thumbs: images.length ? images : ["img/베너/000.png"],
      desc: $("#peDesc").value.split("\n").map(s=>s.trim()).filter(Boolean),
      stock: { S:Number($("#peStockS").value)||0, M:Number($("#peStockM").value)||0, L:Number($("#peStockL").value)||0 },
      hidden: $("#peVisible").value === "hidden",
      hot: $("#peHot").checked,
      popular: $("#pePopular").checked
    };
    if(editing){
      saveProductOverride(id, patch);
      Object.assign(p, patch);
      showToast("상품 정보가 저장되어 사이트에 반영되었습니다.");
    }else{
      const newId = "custom" + Date.now();
      const newProduct = Object.assign({
        id: newId, rating:"4.8", reviewCount:0, accessories:[], country: patch.cat==="world"?patch.sub:null
      }, patch);
      addCustomProduct(newProduct);
      PRODUCTS.push(newProduct);
      showToast("새 상품이 등록되어 사이트에 반영되었습니다.");
    }
    closeModal("productEditModal");
    renderProductRows();
  };
  openModal("productEditModal");
}

/* ---------------- 예약달력 ---------------- */
function renderCalendar(){
  const orders = getOrders();
  const [y,m,d] = REFERENCE_TODAY.split("-").map(Number);
  const firstDay = new Date(y, m-1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const startWeekday = firstDay.getDay();

  const byDate = {};
  orders.forEach(o=>{
    byDate[o.date] = byDate[o.date] || { ship:0, ret:0 };
    byDate[o.date].ship++;
    byDate[o.dueDate] = byDate[o.dueDate] || { ship:0, ret:0 };
    byDate[o.dueDate].ret++;
  });

  let cells = "";
  for(let i=0;i<startWeekday;i++) cells += `<div class="cal-cell empty"></div>`;
  for(let day=1; day<=daysInMonth; day++){
    const dateStr = `${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const info = byDate[dateStr];
    const isToday = dateStr === REFERENCE_TODAY;
    cells += `<div class="cal-cell ${isToday?'today':''}">
      <div class="cal-day">${day}</div>
      ${info?.ship ? `<div class="cal-tag ship">출고 ${info.ship}</div>`:""}
      ${info?.ret ? `<div class="cal-tag ret">반납 ${info.ret}</div>`:""}
    </div>`;
  }

  const renting = orders.filter(o=> o.date<=REFERENCE_TODAY && o.dueDate>=REFERENCE_TODAY);
  const returned = orders.filter(o=> o.dueDate < REFERENCE_TODAY);

  $("#pageBody").innerHTML = `
    <p class="admin-hint">기준일 ${REFERENCE_TODAY} (데모 데이터 기준)</p>
    <div class="cal-weekdays">${["일","월","화","수","목","금","토"].map(w=>`<div>${w}</div>`).join("")}</div>
    <div class="cal-grid">${cells}</div>

    <h3 class="admin-subtitle">대여중 (${renting.length}건)</h3>
    <table class="admin-table">
      <thead><tr><th>주문번호</th><th>고객명</th><th>상품명</th><th>대여일</th><th>반납예정일</th></tr></thead>
      <tbody>${renting.map(o=>`<tr><td>${o.orderNo}</td><td>${o.customer}</td><td>${o.productName}</td><td>${o.date}</td><td>${o.dueDate}</td></tr>`).join("") || `<tr><td colspan="5" style="text-align:center;color:#999;">없음</td></tr>`}</tbody>
    </table>

    <h3 class="admin-subtitle">반납완료 (${returned.length}건)</h3>
    <table class="admin-table">
      <thead><tr><th>주문번호</th><th>고객명</th><th>상품명</th><th>반납일</th></tr></thead>
      <tbody>${returned.map(o=>`<tr><td>${o.orderNo}</td><td>${o.customer}</td><td>${o.productName}</td><td>${o.dueDate}</td></tr>`).join("") || `<tr><td colspan="4" style="text-align:center;color:#999;">없음</td></tr>`}</tbody>
    </table>
  `;
}

/* ---------------- 재고·사이즈 ---------------- */
function renderStock(){
  $("#pageBody").innerHTML = `
    <div class="admin-toolbar">
      <select id="stockCatFilter">
        <option value="">전체 카테고리</option>
        ${Object.values(CATEGORY_META).map(m=>`<option value="${m.key}">${m.label}</option>`).join("")}
      </select>
    </div>
    <table class="admin-table">
      <thead><tr><th>상품명</th><th>카테고리</th><th>분류</th><th>S 재고</th><th>M 재고</th><th>L 재고</th></tr></thead>
      <tbody id="stockTableBody"></tbody>
    </table>
  `;
  function draw(){
    const cat = $("#stockCatFilter").value;
    const list = PRODUCTS.filter(p=>!p.hidden && (!cat || p.cat===cat));
    $("#stockTableBody").innerHTML = list.map(p=>`
      <tr data-pid="${p.id}">
        <td>${p.name}</td><td>${CATEGORY_META[p.cat].label}</td><td>${p.sub}</td>
        <td><input type="number" min="0" class="stock-input" data-size="S" value="${p.stock.S}"/></td>
        <td><input type="number" min="0" class="stock-input" data-size="M" value="${p.stock.M}"/></td>
        <td><input type="number" min="0" class="stock-input" data-size="L" value="${p.stock.L}"/></td>
      </tr>
    `).join("");
  }
  draw();
  $("#stockCatFilter").addEventListener("change", draw);
}

/* ---------------- 주문관리 ---------------- */
function renderOrders(){
  const orders = getOrders();
  $("#pageBody").innerHTML = `
    <table class="admin-table">
      <thead><tr><th>주문번호</th><th>고객명</th><th>주문상품</th><th>주문일</th><th>결제금액</th><th>상태</th><th></th></tr></thead>
      <tbody id="orderTableBody">
        ${orders.map((o,i)=>`
        <tr data-i="${i}">
          <td>${o.orderNo}</td><td>${o.customer}</td><td>${o.productName}</td><td>${o.date}</td><td>${won(o.amount)}</td>
          <td>
            <select class="order-status" data-i="${i}">
              ${["배송준비","배송중","배송완료"].map(s=>`<option value="${s}" ${o.status===s?"selected":""}>${s}</option>`).join("")}
            </select>
          </td>
          <td><button type="button" class="order-detail-btn" data-i="${i}">상세보기</button></td>
        </tr>
        <tr class="order-detail-row" data-detail="${i}" hidden><td colspan="7">
          반납예정일 : ${o.dueDate} &nbsp;·&nbsp; 상품ID : ${o.productId}
        </td></tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

/* ---------------- 후기관리 ---------------- */
function renderReviews(){
  const reviews = getReviews();
  $("#pageBody").innerHTML = `
    <table class="admin-table review-admin-table">
      <thead><tr><th>사진</th><th>상품명</th><th>작성자</th><th>별점</th><th>내용</th><th>노출</th><th>관리자 답변</th><th></th></tr></thead>
      <tbody>
        ${reviews.map((r,i)=>`
        <tr data-i="${i}">
          <td><img class="admin-thumb" src="${r.image}" alt="후기"/></td>
          <td>${r.productName}</td>
          <td>${r.name}<br/><small>${r.date}</small></td>
          <td>★ ${r.rating}</td>
          <td class="review-text-cell">${r.text}</td>
          <td><input type="checkbox" class="review-visible" data-i="${i}" ${r.visible?"checked":""}/></td>
          <td><textarea class="review-reply" data-i="${i}" rows="2" placeholder="답변을 입력해주세요">${r.reply||""}</textarea></td>
          <td><button type="button" class="review-save-btn" data-i="${i}">저장</button></td>
        </tr>`).join("")}
      </tbody>
    </table>
  `;
}

/* ---------------- 챗봇 / API 설정 ---------------- */
function renderSettings(){
  const key = localStorage.getItem("ibubom_openai_key") || "";
  $("#pageBody").innerHTML = `
    <div class="admin-form-card">
      <h3 class="admin-subtitle">OpenAI API 연동</h3>
      <p class="admin-hint">
        정적 사이트로 배포되는 특성상 API 키는 서버가 아닌 브라우저(localStorage)에만 저장되며,
        코드/깃 저장소에는 포함되지 않습니다. 실제 운영 시에는 키를 백엔드(서버리스 함수 등)로
        감추는 구조로 전환하는 것을 권장합니다.
      </p>
      <label class="admin-field">OpenAI API Key
        <input type="password" id="openaiKeyInput" placeholder="sk-..." value="${key}"/>
      </label>
      <button type="button" class="primary-btn" id="saveKeyBtn" style="width:auto;">저장</button>
      <button type="button" class="more-btn" id="clearKeyBtn" style="margin-left:10px;">키 삭제(목업 응답으로 전환)</button>
    </div>
  `;
  $("#saveKeyBtn").addEventListener("click", ()=>{
    localStorage.setItem("ibubom_openai_key", $("#openaiKeyInput").value.trim());
    showToast("저장되었습니다.");
  });
  $("#clearKeyBtn").addEventListener("click", ()=>{
    localStorage.removeItem("ibubom_openai_key");
    $("#openaiKeyInput").value = "";
    showToast("API 키가 삭제되었습니다. 챗봇은 목업 응답으로 동작합니다.");
  });
}

/* ---------------- 페이지 공통 위임 이벤트 (#pageBody 는 재사용되는 고정 엘리먼트이므로
   render 함수 안이 아니라 여기서 한 번만 등록한다) ---------------- */
$("#pageBody").addEventListener("change",(e)=>{
  if(e.target.classList.contains("stock-input")){
    const tr = e.target.closest("tr");
    const p = getProduct(tr.dataset.pid);
    p.stock[e.target.dataset.size] = Math.max(0, Number(e.target.value)||0);
    saveProductOverride(p.id, { stock: p.stock });
    showToast(`${p.name} ${e.target.dataset.size} 재고가 저장되었습니다.`);
    return;
  }
  if(e.target.classList.contains("order-status")){
    const i = Number(e.target.dataset.i);
    const list = getOrders();
    list[i].status = e.target.value;
    saveOrders(list);
    showToast("주문 상태가 저장되었습니다.");
  }
});
$("#pageBody").addEventListener("click",(e)=>{
  const detailBtn = e.target.closest(".order-detail-btn");
  if(detailBtn){
    const row = $(`.order-detail-row[data-detail="${detailBtn.dataset.i}"]`);
    row.hidden = !row.hidden;
    return;
  }
  const reviewSaveBtn = e.target.closest(".review-save-btn");
  if(reviewSaveBtn){
    const i = Number(reviewSaveBtn.dataset.i);
    const list = getReviews();
    const row = $(`tr[data-i="${i}"]`);
    list[i].reply = row.querySelector(".review-reply").value;
    list[i].visible = row.querySelector(".review-visible").checked;
    saveReviews(list);
    showToast("후기 답변이 저장되었습니다.");
  }
});

/* ---------------- 초기화 ---------------- */
checkAuthGuard();
if(isAdmin()) goPage("dashboard");
