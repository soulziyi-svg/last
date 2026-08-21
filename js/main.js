/* ==========================================================
   IBUBOM / 입어봄 - main.js (홈페이지 전용)
   공용 로직(인증/장바구니/검색/배송조회 등)은 js/common.js 참고
   ========================================================== */
"use strict";

/* ---------------- 메가메뉴 (홈 헤더 전용) ---------------- */
const megaMenu = $("#megaMenu");
function buildMegaColumns(cat){
  const meta = CATEGORY_META[cat];
  const cols = meta.order.map(sub=>{
    const items = productsByCatSub(cat, sub);
    const links = items.map(p=>`<a href="product.html?id=${p.id}">${p.name}</a>`).join("");
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

/* ---------------- 배너 슬라이더 (coverflow + 홍보문구) ---------------- */
const bannerTrack = $("#bannerTrack");
const bannerDots = $("#bannerDots");
let bannerIdx = 0;
BANNER_IMAGES.forEach((src,i)=>{
  const d = document.createElement("div");
  d.className = "banner-slide";
  d.style.backgroundImage = `url('${src}')`;
  d.dataset.i = i;
  const text = BANNER_TEXTS[i] || {};
  d.innerHTML = `<div class="banner-copy">
    <h3>${text.title||""}</h3>
    <p>${text.desc||""}</p>
  </div>`;
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

/* ---------------- 메인 태그라인 (관리자 문구 반영) ---------------- */
const siteTextHome = getSiteText();
$(".main-tagline").textContent = siteTextHome.mainTagline;
$(".footer-brand").innerHTML = siteTextHome.footerBrand.split("\n").join("<br/>");

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
  const siteText = getSiteText();
  const heroTitle = siteText.heroTitle[cat] || meta.heroTitle;
  const heroDesc = siteText.heroDesc[cat] || meta.heroDesc;
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
      <h3 class="content-hero-title" style="${meta.key!=='cosplay'?`color:${meta.color==='#FFD84D'?'#C9A400':meta.color}`:''}">${heroTitle}</h3>
      <p class="content-hero-desc">${heroDesc}</p>

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
  filterRow.firstElementChild.classList.add("active");
  renderSubPanel(cat, meta.order[0], meta, false);

  root.addEventListener("click",(e)=>{
    const addBtn = e.target.closest("[data-addcart]");
    if(addBtn){ e.stopPropagation(); addToCart(addBtn.dataset.addcart); return; }
    const card = e.target.closest("[data-pid]");
    if(card){ window.location.href = `product.html?id=${card.dataset.pid}`; }
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

/* ---------------- 챗봇 (키워드 목업 + GPT API 연동, js/chatbot-config.js에서 키 설정) ---------------- */
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
  return d;
}
addChatMsg("bot", getSiteText().chatbotGreeting);

function localBotReply(text){
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
  return null;
}

/* GPT API 연동 : window.IBUBOM_OPENAI_KEY 에 키가 설정되어 있을 때만 실제 호출.
   공개되는 정적 사이트 특성상 코드에 키를 직접 하드코딩하지 않고,
   관리자페이지 > 챗봇 설정에서 저장한 값을 브라우저 localStorage에서 읽어 사용한다. */
async function callChatGPT(userText, history){
  const key = localStorage.getItem("ibubom_openai_key");
  if(!key){
    return localBotReply(userText) || "문의 감사합니다! 상품명, 사이즈, 대여 날짜를 함께 알려주시면 더 정확하게 안내해드릴 수 있어요.\n(현재 챗봇은 목업 응답이며, 관리자페이지에서 OpenAI API 키를 설정하면 실제 GPT 응답으로 전환됩니다.)";
  }
  try{
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role:"system", content:"너는 의상 대여 쇼핑몰 '입어봄(IBUBOM)'의 상담원이야. 한복/각국 전통의상/코스프레/공연의상 대여 관련 질문에 친절하고 간결한 한국어 존댓말로 답해줘." },
          ...history.slice(-6),
          { role:"user", content:userText }
        ],
        max_tokens: 300
      })
    });
    if(!res.ok){
      if(res.status===429) return "지금 요청이 많아 응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.";
      if(res.status===401) return "챗봇 연동 키가 유효하지 않습니다. 관리자페이지에서 API 키를 다시 확인해주세요.";
      return "일시적인 오류로 답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.";
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "죄송해요, 답변을 생성하지 못했어요. 다시 질문해주시겠어요?";
  }catch(err){
    return "네트워크 오류로 응답을 받지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요.";
  }
}

const chatbotInput = $("#chatbotInput");
const chatHistory = [];
let chatPending = false;
async function sendChat(){
  const text = chatbotInput.value.trim();
  if(!text || chatPending) return;
  addChatMsg("user", text);
  chatHistory.push({ role:"user", content:text });
  chatbotInput.value = "";
  chatbotInput.style.height = "auto";
  chatPending = true;
  const pendingEl = addChatMsg("bot", "입력 중...");
  pendingEl.classList.add("pending");
  const reply = await callChatGPT(text, chatHistory);
  pendingEl.remove();
  addChatMsg("bot", reply);
  chatHistory.push({ role:"assistant", content:reply });
  chatPending = false;
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

/* ---------------- 상담하기 (AI 맞춤추천 플로우) ---------------- */
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
    html = `<div class="consult-step"><p style="color:#888;">${getSiteText().consultGreeting}</p>
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
          <a class="more-btn" href="product.html?id=${best.id}">상품 자세히 보기 →</a>
          <button class="primary-btn" style="width:auto;margin:0;" data-addcart="${best.id}">장바구니 담기</button>
        </div>
      </div>
      <div class="consult-more-title">이런 의상도 좋아하실 것 같아요</div>
      <div class="consult-more-grid">
        ${others.map((p,i)=>`<a href="product.html?id=${p.id}"><img src="${p.images[0]}" alt="${p.name}"/><div class="pct">${pcts[i]}%</div><div class="nm">${p.name}</div></a>`).join("")}
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
  const add = e.target.closest("[data-addcart]");
  if(add){ addToCart(add.dataset.addcart); return; }
});
consultFab.addEventListener("click", ()=>{
  consultState = { step:0, gender:"", age:"", purpose:"", picks:[] };
  openModal("consultModal");
  renderConsult();
});

/* ---------------- 초기화 ---------------- */
applyAuthUI();
updateCartBadge();
