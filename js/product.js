/* ==========================================================
   IBUBOM / 입어봄 - product.js (상품 상세페이지 전용)
   공용 로직(인증/장바구니/검색/배송조회 등)은 js/common.js 참고
   ========================================================== */
"use strict";

const params = new URLSearchParams(location.search);
const PID = params.get("id");
const product = getProduct(PID);
const main = $("#productMain");

/* ---------------- 상세페이지 전용 텍스트 내비 + 아코디언 서브메뉴 ---------------- */
function renderDetailNav(){
  const nav = $("#detailNav");
  const catOrder = ["hanbok","world","cosplay","stage"];
  nav.innerHTML = catOrder.map(cat=>{
    const meta = CATEGORY_META[cat];
    const cols = meta.order.map(sub=>{
      const items = productsByCatSub(cat, sub);
      const links = items.map(p=>`<a href="product.html?id=${p.id}">${p.name}</a>`).join("");
      return `<div class="accordion-item" data-sub="${sub}">
        <button type="button" class="accordion-head">${sub}</button>
        <div class="accordion-body">${links}</div>
      </div>`;
    }).join("");
    return `<div class="detail-nav-item" data-cat="${cat}">
      <span class="detail-nav-label">${meta.label}</span>
      <div class="detail-submenu">${cols}</div>
    </div>`;
  }).join("");

  nav.addEventListener("click",(e)=>{
    const head = e.target.closest(".accordion-head");
    if(head){
      const item = head.closest(".accordion-item");
      const wasOpen = item.classList.contains("open");
      $all(".accordion-item", item.closest(".detail-submenu")).forEach(i=>i.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    }
  });
}

/* ---------------- 경로(브레드크럼) ---------------- */
function renderBreadcrumb(){
  $("#breadcrumb").innerHTML = `홈 - ${product.sub} - ${product.name}`;
}

/* ---------------- 사이즈 실측표 (상품별 고정 의사난수) ---------------- */
function sizeTable(p){
  const seed = p.id.replace(/\D/g,"") || 1;
  const base = { 가슴: 82, 허리: 64, 총장: 128 };
  return ["S","M","L"].map((s,i)=>({
    size: s,
    가슴: `${base.가슴 + i*3}~${base.가슴 + i*3 + 3}cm`,
    허리: `${base.허리 + i*3}~${base.허리 + i*3 + 4}cm`,
    총장: `${base.총장 + i*2}cm`
  }));
}

const DETAIL_FEATURES = {
  hanbok: [
    ["완성도 높은 올인원 세트", "저고리·치마(또는 포)부터 필요한 구성까지 한 번에 대여할 수 있도록 구성했습니다."],
    ["사진에 선명한 색감과 디테일", "촬영 시 또렷하게 드러나는 자수와 배색으로 어떤 배경에서도 존재감이 살아납니다."],
    ["촬영과 행사에 편안한 착용감", "장시간 촬영·이동에도 부담이 적도록 소재와 재단을 신경 써서 준비했습니다."]
  ],
  world: [
    ["현지 전통을 살린 디테일", "자수·색감·실루엣을 현지 전통 그대로 재현해 이색적인 촬영 컨셉을 완성합니다."],
    ["행사·촬영에 어울리는 완성도", "여행 스냅부터 문화 행사까지 다양한 장면에 자연스럽게 녹아듭니다."],
    ["사이즈 실측 기반의 편안한 착용", "실측 사이즈표를 참고해 내 몸에 맞는 사이즈를 정확히 고를 수 있어요."]
  ],
  cosplay: [
    ["캐릭터 싱크로율 높은 디테일", "원작의 실루엣과 색감을 최대한 살려 완성도 높은 코스프레를 완성합니다."],
    ["가발·소품까지 옵션 구성", "필요한 구성만 골라 담아 촬영·행사 어디서든 바로 투입 가능합니다."],
    ["행사·촬영·쇼츠 어디에나", "짧은 촬영부터 긴 행사까지 활동성과 완성도를 함께 챙겼습니다."]
  ],
  stage: [
    ["무대 조명 아래 선명한 컬러", "조명 아래에서 가장 선명하게 보이는 소재와 컬러로 제작했습니다."],
    ["단체 대여 시 추가 할인", "팀 단위 공연·행사 의상도 급하게 준비해야 할 때 빠르게 대응합니다."],
    ["활동성을 고려한 재단", "안무·동선이 많은 무대에서도 불편함 없이 움직일 수 있습니다."]
  ]
};

const MATERIAL_INFO = {
  hanbok: { material:"겉감 실크 혼방 / 안감 순면 혼방", wash:"드라이클리닝 권장 (물세탁 시 변형 위험)", caution:"금속 장식 부위는 강하게 잡아당기지 마시고, 착용 후 서늘한 곳에 보관해주세요." },
  world: { material:"폴리에스터 혼방 원단 (국가별 상이)", wash:"드라이클리닝 권장", caution:"자수·비즈 장식 부위는 물이 닿지 않도록 주의해주세요." },
  cosplay: { material:"폴리에스터·인조가죽 혼방", wash:"드라이클리닝 권장, 소품류는 물세탁 금지", caution:"가발은 빗질 시 모류 방향대로 부드럽게 빗어주세요." },
  stage: { material:"스판덱스 혼방 (신축성 원단)", wash:"드라이클리닝 권장", caution:"과도한 스트레칭 동작 시 봉제선에 무리가 가지 않도록 주의해주세요." }
};

const DELIVERY_INFO = {
  fee: "3,000원 (5만원 이상 대여 시 무료)",
  arrival: "오늘 오후 2시 이전 주문 시 당일 도착",
  returnMethod: "반납 예정일에 받으신 포장 그대로 문 앞에 놓아두시면 자동 수거됩니다.",
  exchange: "수령 후 3시간 이내 사이즈 교환 요청 시 무료로 교환해드립니다."
};

const WEAR_GUIDE_STEPS = {
  hanbok: ["한복 속옷 착용하기", "저고리 입는 법", "치마(또는 포) 입는 법", "액세서리 착용하는 법"],
  world: ["기본 이너 착용하기", "메인 의상 착용하기", "허리·어깨 라인 정리하기", "액세서리·소품 착용하기"],
  cosplay: ["기본 의상 착용하기", "가발 착용하고 정리하기", "소품 장착하기", "전체 실루엣 점검하기"],
  stage: ["기본 의상 착용하기", "포인트 아이템 착용하기", "헤어·메이크업 포인트 정리하기", "무대화 착용하고 동선 점검하기"]
};

/* ---------------- 메인 렌더 ---------------- */
function renderProduct(){
  const meta = CATEGORY_META[product.cat];
  document.title = `${product.name} - 입어봄 IBUBOM`;
  document.body.style.setProperty("--detail-accent", meta.color);
  document.body.classList.add(`detail-${product.cat}`);

  const images = product.images && product.images.length ? product.images : [product.images?.[0]].filter(Boolean);
  const hasGuideVideo = /nezuko/i.test((product.images||[]).join("")) || product.name === "네즈코";

  main.innerHTML = `
    <div class="product-top">
      <div class="product-gallery">
        <div class="gallery-main">
          <img id="galleryMainImg" src="${images[0]}" alt="${product.name}" />
          <div class="gallery-progress" id="galleryProgress">1/${images.length}</div>
        </div>
        <div class="gallery-thumbs" id="galleryThumbs">
          ${images.map((src,i)=>`<button type="button" class="gallery-thumb ${i===0?'active':''}" data-i="${i}"><img src="${src}" alt="썸네일 ${i+1}"/></button>`).join("")}
        </div>
      </div>

      <div class="product-info">
        <div class="product-path">IBUBOM - ${product.sub} - ${product.name}</div>
        <h1 class="product-name">${product.name}</h1>
        <p class="product-desc">${product.desc.join("<br/>")}<br/>${DETAIL_FEATURES[product.cat][0][1]}</p>
        <div class="product-rating">★ ${product.rating} <span>(${product.reviewCount}건의 대여 후기)</span></div>
        <div class="product-price">${won(product.price)} <span>/ 1일</span></div>

        <div class="option-block">
          <div class="option-label">사이즈 선택</div>
          <div class="size-picker" id="sizePicker">
            ${["S","M","L"].map(s=>{
              const soldout = product.stock[s]<=0;
              return `<button type="button" class="size-btn ${soldout?'soldout':''}" data-size="${s}" ${soldout?'disabled':''}>${s}${soldout?' (품절)':''}</button>`;
            }).join("")}
          </div>
        </div>

        ${product.accessories.length ? `
        <div class="option-block">
          <div class="option-label">추가 대여 옵션</div>
          <div class="acc-picker" id="accPicker">
            ${product.accessories.map(a=>`<label class="acc-row">
              <span><input type="checkbox" data-acc="${a.name}" data-price="${a.price}"/> ${a.name}</span>
              <span>+${a.price.toLocaleString()}원</span>
            </label>`).join("")}
          </div>
        </div>` : ""}

        <div class="option-block">
          <div class="option-label">대여기간</div>
          <div class="period-picker" id="periodPicker">
            <button type="button" class="period-btn active" data-period="1일">1박<br/><b>${won(product.price)}</b></button>
            <button type="button" class="period-btn" data-period="1박2일">1박2일<br/><b>+30%</b></button>
            <button type="button" class="period-btn" data-period="2박3일">2박3일<br/><b>+60%</b></button>
          </div>
        </div>

        <div class="qty-row">
          수량
          <button type="button" id="qtyMinus">−</button>
          <span id="qtyVal">1</span>
          <button type="button" id="qtyPlus">+</button>
        </div>

        <div class="total-row">총 대여금액 <b id="totalPrice">${won(product.price)}</b></div>
        <button type="button" class="add-cart-btn" id="detailAddCart">장바구니 담기</button>
      </div>
    </div>

    <section class="purchase-info">
      <div class="pinfo-tabs">
        <button type="button" class="pinfo-tab active" data-tab="detail">상세정보</button>
        <button type="button" class="pinfo-tab" data-tab="material">소재관리</button>
        <button type="button" class="pinfo-tab" data-tab="delivery">배송교환</button>
      </div>
      <div class="pinfo-panel" data-panel="detail">
        <ol class="feature-list">
          ${DETAIL_FEATURES[product.cat].map((f,i)=>`<li><b>0${i+1}. ${f[0]}</b><p>${f[1]}</p></li>`).join("")}
        </ol>
        <table class="size-table">
          <thead><tr><th></th><th>가슴</th><th>허리</th><th>총장</th></tr></thead>
          <tbody>
            ${sizeTable(product).map(r=>`<tr><th>${r.size}</th><td>${r.가슴}</td><td>${r.허리}</td><td>${r.총장}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="pinfo-panel" data-panel="material" hidden>
        <dl class="info-dl">
          <dt>소재</dt><dd>${MATERIAL_INFO[product.cat].material}</dd>
          <dt>세탁법</dt><dd>${MATERIAL_INFO[product.cat].wash}</dd>
          <dt>착용 주의사항</dt><dd>${MATERIAL_INFO[product.cat].caution}</dd>
        </dl>
      </div>
      <div class="pinfo-panel" data-panel="delivery" hidden>
        <dl class="info-dl">
          <dt>배송비</dt><dd>${DELIVERY_INFO.fee}</dd>
          <dt>도착 예정</dt><dd>${DELIVERY_INFO.arrival}</dd>
          <dt>반납 방법</dt><dd>${DELIVERY_INFO.returnMethod}</dd>
          <dt>교환 안내</dt><dd>${DELIVERY_INFO.exchange}</dd>
        </dl>
      </div>
    </section>

    <section class="wear-guide">
      <h2>착용가이드</h2>
      <div class="wear-steps">
        ${WEAR_GUIDE_STEPS[product.cat].map((s,i)=>`<div class="wear-step"><b>0${i+1}</b><span>${s}</span></div>`).join("<div class='wear-arrow'>→</div>")}
      </div>
      ${hasGuideVideo
        ? `<video class="wear-video" src="img/콘텐츠3/nezuko-wearing-guide.mp4" controls poster="img/콘텐츠3/nezuko-wearing-guide.png"></video>`
        : `<p class="wear-guide-note">착용가이드 영상은 순차적으로 추가될 예정입니다. 위 단계 순서를 참고해 착용해주세요.</p>`}
    </section>

    <section class="detail-review">
      <h2><span style="color:var(--detail-accent)">${product.name}</span>, 입어봄</h2>
      <div class="detail-review-grid">
        ${buildProductReviews(product).map(r=>`<div class="review-card">
          <img class="review-photo" src="${r.image}" alt="후기 사진"/>
          <div class="review-stars">${"★".repeat(4)}${r.half?"★":"☆"} ${r.rating}</div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
          <div class="review-text">"${r.text}"</div>
          <div class="review-tags">${r.tags.join(" ")}</div>
        </div>`).join("")}
      </div>
    </section>
  `;

  wireGallery(images);
  wireOptions();
  wireTabs();
}

function buildProductReviews(p){
  const tags = REVIEW_TAGS[p.cat];
  return [0,1,2].map(i=>{
    const idx = (Number(p.id.replace(/\D/g,""))+i) % REVIEW_IMAGES.length;
    return {
      image: REVIEW_IMAGES[idx],
      name: REVIEW_NAMES[idx % REVIEW_NAMES.length],
      date: `2026.0${(idx%9)+1}.1${idx%9}`,
      rating: (4.5 + (idx%2)*0.4).toFixed(1),
      half: idx%2===1,
      text: "졸업사진 찍으려고 친구들이랑 같이 빌렸어요. 좋은 추억 입어보고 갑니다.",
      tags: [tags[i%tags.length], tags[(i+1)%tags.length]]
    };
  });
}

function wireGallery(images){
  const mainImg = $("#galleryMainImg");
  const progress = $("#galleryProgress");
  $("#galleryThumbs").addEventListener("click",(e)=>{
    const btn = e.target.closest(".gallery-thumb"); if(!btn) return;
    $all(".gallery-thumb").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const i = Number(btn.dataset.i);
    mainImg.src = images[i];
    progress.textContent = `${i+1}/${images.length}`;
  });
}

function wireOptions(){
  let selectedSize = ["S","M","L"].find(s=>product.stock[s]>0) || "S";
  let selectedPeriod = "1일";
  let qty = 1;
  const accessories = [];

  $all(".size-btn").forEach(b=>{ if(b.dataset.size===selectedSize) b.classList.add("active"); });
  $("#sizePicker").addEventListener("click",(e)=>{
    const b = e.target.closest(".size-btn"); if(!b || b.disabled) return;
    $all(".size-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    selectedSize = b.dataset.size;
  });

  const accPicker = $("#accPicker");
  if(accPicker){
    accPicker.addEventListener("change",(e)=>{
      const name = e.target.dataset.acc, price = Number(e.target.dataset.price);
      if(!name) return;
      if(e.target.checked) accessories.push({name, price});
      else{
        const idx = accessories.findIndex(a=>a.name===name);
        if(idx>-1) accessories.splice(idx,1);
      }
      updateTotal();
    });
  }

  $("#periodPicker").addEventListener("click",(e)=>{
    const b = e.target.closest(".period-btn"); if(!b) return;
    $all(".period-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    selectedPeriod = b.dataset.period;
    updateTotal();
  });

  $("#qtyMinus").addEventListener("click", ()=>{ qty=Math.max(1,qty-1); $("#qtyVal").textContent=qty; updateTotal(); });
  $("#qtyPlus").addEventListener("click", ()=>{ qty=qty+1; $("#qtyVal").textContent=qty; updateTotal(); });

  function updateTotal(){
    const base = periodPrice(product.price, selectedPeriod);
    const accTotal = accessories.reduce((s,a)=>s+a.price,0);
    $("#totalPrice").textContent = won((base+accTotal)*qty);
  }

  $("#detailAddCart").addEventListener("click", ()=>{
    const cart = getCart();
    cart.push({
      cartId: "c"+Date.now()+Math.floor(Math.random()*999),
      productId: product.id,
      size: selectedSize,
      accessories: accessories.slice(),
      period: selectedPeriod,
      qty
    });
    setCart(cart);
    showToast("✓ 장바구니가 추가되었습니다.");
  });
}

function wireTabs(){
  $(".pinfo-tabs").addEventListener("click",(e)=>{
    const b = e.target.closest(".pinfo-tab"); if(!b) return;
    $all(".pinfo-tab").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    $all(".pinfo-panel").forEach(p=> p.hidden = p.dataset.panel !== b.dataset.tab);
  });
}

if(!product){
  main.innerHTML = `<div class="product-notfound">
    <p>존재하지 않거나 삭제된 상품입니다.</p>
    <a href="index.html" class="more-btn">홈으로 돌아가기</a>
  </div>`;
} else {
  renderDetailNav();
  renderBreadcrumb();
  renderProduct();
}

applyAuthUI();
updateCartBadge();
