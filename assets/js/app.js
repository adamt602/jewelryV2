(function () {
  'use strict';

  const { IMGS, CATALOG, JOURNAL } = window;

let cart = {};
let wishlist = new Set();
let currentPage = 'home';
let tIdx = 0, tTimer;

/* ── REVEAL ─────────────────────────────────────────────── */
let rvIO;
function initReveals(){
  if(rvIO) rvIO.disconnect();
  rvIO = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); rvIO.unobserve(e.target); }});
  },{threshold:.08,rootMargin:'0px 0px -32px 0px'});
  document.querySelectorAll('.page.active .rv,.page.active .rv-l,.page.active .rv-r').forEach(el=>{
    if(!el.classList.contains('vis')) rvIO.observe(el);
  });
}

/* ── PAGE ROUTING ─────────────────────────────────────── */
function goTo(id){
  if(!document.getElementById('page-'+id)) return;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nl,.mob-nav-btn').forEach(b=>b.classList.toggle('act',b.dataset.page===id));
  currentPage=id;
  window.scrollTo({top:0,behavior:'smooth'});
  document.getElementById('mob-m').classList.remove('on');
  if(id==='shop') buildShopGrid(currentFilter,currentSort);
  if(id==='kept') renderKept();
  if(id==='journal'){ document.getElementById('journal-list-view').style.display=''; document.getElementById('journal-post-view').style.display='none'; buildJournalGrid(); }
  if(id==='home') buildHomeGrid();
  setTimeout(initReveals,60);
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-page]');
  if(el&&el.dataset.page){ e.preventDefault(); goTo(el.dataset.page); }
});

/* ── NAV SCROLL ─────────────────────────────────────────── */
window.addEventListener('scroll',()=>document.getElementById('main-nav').classList.toggle('scrolled',window.scrollY>50),{passive:true});

/* ── TOAST ─────────────────────────────────────────────── */
const toastEl=document.getElementById('toast');
let toastT;
function toast(msg){toastEl.textContent='✦ '+msg;toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('on'),2200);}

/* ── CART ─────────────────────────────────────────────── */
function renderCart(){
  const ids=Object.keys(cart);
  const bd=document.getElementById('c-bd'),ft=document.getElementById('c-ft'),sub=document.getElementById('c-subtotal');
  const badge=document.getElementById('cart-badge');
  let total=0,qty=0;
  ids.forEach(id=>{total+=CATALOG[id].price*cart[id];qty+=cart[id];});
  sub.textContent='$'+total;
  badge.textContent=qty; badge.style.display=qty?'':'none';
  ft.style.display=ids.length?'':'none';
  if(!ids.length){bd.innerHTML='<div class="c-emp"><p class="c-emp-ti">nothing gathered yet</p><p class="c-emp-b">the studio is waiting</p></div>';return;}
  bd.innerHTML=ids.map(id=>{
    const p=CATALOG[id];
    return `<div class="c-it"><div class="c-ii"><img src="${IMGS[p.img]}" alt="${p.name}"></div><div class="c-in"><div><p class="c-inm">${p.name}</p><p class="c-inv">${p.verse}</p><p class="c-ied">\u2116 ${String(p.edN).padStart(2,'0')} / ${p.edOf}</p></div><div class="c-ib"><div class="qty"><button class="qty-b" onclick="adjQty('${id}',-1)">\u2212</button><span class="qty-n">${cart[id]}</span><button class="qty-b" onclick="adjQty('${id}',1)">+</button></div><p class="c-ip">$${p.price*cart[id]}</p></div></div></div>`;
  }).join('');
}
window.adjQty=(id,d)=>{if(!cart[id])return;cart[id]+=d;if(cart[id]<=0)delete cart[id];renderCart();};
window.addToCart=(id)=>{cart[id]=(cart[id]||0)+1;renderCart();toast('gathered for you');};

document.querySelectorAll('[data-qa]').forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.qa)));
document.addEventListener('click',e=>{const b=e.target.closest('.pc-qa');if(b){e.stopPropagation();addToCart(b.dataset.id);}});

const cOv=document.getElementById('c-ov'),cDrw=document.getElementById('c-drw');
function openCart(){cDrw.classList.add('on');cOv.classList.add('on');}
function closeCart(){cDrw.classList.remove('on');cOv.classList.remove('on');}
document.getElementById('cart-open-btn').addEventListener('click',openCart);
document.getElementById('c-close').addEventListener('click',closeCart);
cOv.addEventListener('click',closeCart);

/* ── WISHLIST ─────────────────────────────────────────── */
function toggleWish(id){
  if(wishlist.has(id)){wishlist.delete(id);toast('removed from kept');}
  else{wishlist.add(id);toast('held for later \u2726');}
  const badge=document.getElementById('wish-badge');
  badge.textContent=wishlist.size; badge.style.display=wishlist.size?'':'none';
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(b=>b.classList.toggle('on',wishlist.has(id)));
  if(currentPage==='kept') renderKept();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-wish]');if(b){e.stopPropagation();toggleWish(b.dataset.wish);}});

function renderKept(){
  const cnt=document.getElementById('kept-content');
  if(!wishlist.size){cnt.innerHTML=`<div class="kept-empty"><div class="kept-empty-icon">\u2661</div><h2 class="kept-empty-ti">Nothing kept yet.</h2><p class="kept-empty-b">Add pieces to your Kept list from the shop or from any product page. They will wait here for you.</p><button class="btn btn-dark" data-page="shop">explore the atelier \u2192</button></div>`;return;}
  cnt.innerHTML=`<div class="pg pg4">${[...wishlist].map(id=>makeProductCard(id)).join('')}</div>`;
}

/* ── PRODUCT CARD BUILDER ─────────────────────────────── */
function makeProductCard(id,extraClass=''){
  const p=CATALOG[id];
  const low=p.edN<=5?'<span class="badge-pill badge-low">almost gone</span>':'';
  const nw=p.edN>20?'<span class="badge-pill badge-new">new</span>':'';
  const allImgs = p.imgs || [p.img];
  const primarySrc = IMGS[allImgs[0]];
  const hoverImg = allImgs.length > 1 ? `<img class="pc-hover-img" src="${IMGS[allImgs[1]]}" alt="${p.name} — worn">` : '';
  return `<div class="rv"><article class="pc ${allImgs.length>1?'has-hover':''}" data-id="${id}" data-modal="${id}"><div class="pc-wrap"><div class="pc-ed"><span>\u2116 ${String(p.edN).padStart(2,'0')} / ${p.edOf}</span></div><div class="pc-badge">${nw}${low}</div><button class="pc-wish ${wishlist.has(id)?'on':''}" data-wish="${id}"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="6.5" y1="1" x2="6.5" y2="12" stroke="${wishlist.has(id)?'#B6543C':'#2A1F18'}" stroke-width="1.2" stroke-linecap="round"/><line x1="1" y1="6.5" x2="12" y2="6.5" stroke="${wishlist.has(id)?'#B6543C':'#2A1F18'}" stroke-width="1.2" stroke-linecap="round"/></svg></button><img class="pc-primary-img" src="${primarySrc}" alt="${p.name}">${hoverImg}<button class="pc-qa" data-id="${id}">add to bag \u2014 $${p.price}</button></div><p class="pc-coll">${p.coll}</p><div class="pc-foot"><div><p class="pc-name">${p.name}</p><p class="pc-verse">\u201c${p.ins}\u201d \u2014 ${p.verse}</p></div><p class="pc-price">$${p.price}</p></div></article></div>`;
}

/* ── HOME GRID ─────────────────────────────────────────── */
function buildHomeGrid(){
  const g=document.getElementById('home-grid');
  if(!g)return;
  g.innerHTML=['esther','ruth','hannah','mary'].map(id=>makeProductCard(id)).join('');
  setTimeout(initReveals,60);
}

/* ── SHOP ─────────────────────────────────────────────── */
let currentFilter='all',currentSort='featured';
function buildShopGrid(filter,sort){
  currentFilter=filter; currentSort=sort;
  let items=Object.entries(CATALOG).filter(([id,p])=>filter==='all'||p.cat===filter);
  if(sort==='price-asc') items.sort((a,b)=>a[1].price-b[1].price);
  else if(sort==='price-desc') items.sort((a,b)=>b[1].price-a[1].price);
  else if(sort==='edition') items.sort((a,b)=>a[1].edN-b[1].edN);
  const g=document.getElementById('shop-grid');
  if(!g)return;
  g.innerHTML=items.map(([id])=>makeProductCard(id)).join('');
  setTimeout(initReveals,60);
}
document.getElementById('shop-filters').addEventListener('click',e=>{
  const b=e.target.closest('.f-btn');
  if(!b)return;
  document.querySelectorAll('.f-btn').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  buildShopGrid(b.dataset.filter,currentSort);
});
document.getElementById('shop-sort').addEventListener('change',e=>buildShopGrid(currentFilter,e.target.value));
document.getElementById('grid-view-btn').addEventListener('click',()=>{
  document.getElementById('shop-grid').classList.remove('list-view');
  document.getElementById('grid-view-btn').classList.add('on');
  document.getElementById('list-view-btn').classList.remove('on');
  buildShopGrid(currentFilter,currentSort);
});
document.getElementById('list-view-btn').addEventListener('click',()=>{
  const g=document.getElementById('shop-grid');
  g.classList.add('list-view'); g.classList.remove('pg4');
  document.getElementById('list-view-btn').classList.add('on');
  document.getElementById('grid-view-btn').classList.remove('on');
  buildShopGrid(currentFilter,currentSort);
  g.classList.add('list-view');
});

/* ── PRODUCT MODAL ─────────────────────────────────────── */
let mGalleryIdx = 0;
function openModal(id){
  const p=CATALOG[id]; if(!p)return;
  const allImgs = p.imgs || [p.img];
  mGalleryIdx = 0;
  // build gallery
  const track = document.getElementById('m-gallery-track');
  track.innerHTML = allImgs.map(key=>`<div class="m-gallery-slide"><img src="${IMGS[key]}" alt="${p.name}"></div>`).join('');
  track.style.transform = 'translateX(0)';
  const dots = document.getElementById('m-gallery-dots');
  if(allImgs.length > 1){
    dots.innerHTML = allImgs.map((_,i)=>`<button class="m-gal-dot${i===0?' on':''}" data-gi="${i}"></button>`).join('');
    dots.style.display = '';
  } else { dots.innerHTML = ''; dots.style.display = 'none'; }
  // swipe
  const gallery = document.getElementById('m-gallery');
  let sx=0, dx=0;
  function galGo(n){ mGalleryIdx=n; track.style.transform=`translateX(-${n*100}%)`; dots.querySelectorAll('.m-gal-dot').forEach((d,i)=>d.classList.toggle('on',i===n)); }
  gallery.ontouchstart=e=>{sx=e.touches[0].clientX;dx=0;};
  gallery.ontouchmove=e=>{dx=e.touches[0].clientX-sx;};
  gallery.ontouchend=()=>{if(Math.abs(dx)>40){if(dx<0&&mGalleryIdx<allImgs.length-1)galGo(mGalleryIdx+1);else if(dx>0&&mGalleryIdx>0)galGo(mGalleryIdx-1);}};
  dots.onclick=e=>{const d=e.target.closest('.m-gal-dot');if(d)galGo(+d.dataset.gi);};
  const pairs=Object.entries(CATALOG).filter(([k])=>k!==id).slice(0,3);
  document.getElementById('m-cnt').innerHTML=`
    <p class="m-coll">${p.coll}</p>
    <h2 class="m-nm">${p.name}</h2>
    <p class="m-vs"><em>\u201c${p.ins}\u201d</em> \u2014 ${p.verse}</p>
    <p class="m-pr">$${p.price}</p>
    <p class="m-ed">\u2116 ${String(p.edN).padStart(2,'0')} of ${p.edOf} \u00b7 edition closes when sold</p>
    <div class="m-avail"><span class="m-avail-dot"></span><span class="m-avail-txt">in stock \u00b7 ships in 3\u20135 days</span></div>
    <p class="m-size-lbl">cord length</p>
    <div class="m-sizes">
      <button class="m-size sel">15\u2033</button>
      <button class="m-size">17\u2033</button>
      <button class="m-size">19\u2033</button>
    </div>
    <p class="m-desc">${p.desc}</p>
    <p class="m-stones-l">stones &amp; materials</p>
    <div class="m-stones">${p.stones.map(s=>`<span class="m-st">${s}</span>`).join('')}</div>
    <button class="m-add" onclick="addToCart('${id}');closeModal()">add to bag \u2014 $${p.price}</button>
    <button class="m-wish-btn ${wishlist.has(id)?'on':''}" data-wish="${id}">${wishlist.has(id)?'remove from kept':'keep this piece \u2661'}</button>
    <div class="m-trust"><span>Handmade in California</span><span>\u00b7</span><span>Ships in 3\u20135 days</span><span>\u00b7</span><span>Free 30-day returns</span><span>\u00b7</span><span>Numbered &amp; signed</span></div>
    <div class="m-story"><p class="m-sl">the story of ${p.storyName}</p><p class="m-st-text">${p.story}</p></div>
    <div class="m-pairs"><p class="m-pl">pairs well with</p><div class="m-pair-row">${pairs.map(([pid,pp])=>`<div class="m-pair-card" data-modal="${pid}"><div class="m-pair-img"><img src="${IMGS[pp.img]}" alt="${pp.name}"></div><p class="m-pair-name">${pp.name}</p><p class="m-pair-price">$${pp.price}</p></div>`).join('')}</div></div>`;
  document.getElementById('m-ov').classList.add('on');
  document.body.style.overflow='hidden';
  // size selector
  document.querySelectorAll('.m-size').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.m-size').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');}));
}
window.closeModal=()=>{document.getElementById('m-ov').classList.remove('on');document.body.style.overflow='';};
document.getElementById('m-close').addEventListener('click',closeModal);
document.getElementById('m-ov').addEventListener('click',e=>{if(e.target===document.getElementById('m-ov'))closeModal();});

/* ── PRODUCT CARD: single-tap swaps image, double-tap opens modal ── */
let pcTapTimer=null;
let pcTapCard=null;
document.addEventListener('click',e=>{
  /* "pairs well with" cards inside the modal — open immediately */
  const mPair=e.target.closest('.m-pair-card[data-modal]');
  if(mPair){e.stopPropagation();openModal(mPair.dataset.modal);return;}
  /* skip wish / add-to-bag buttons */
  if(e.target.closest('[data-wish]')||e.target.closest('.pc-qa'))return;
  const card=e.target.closest('.pc[data-id]');
  if(!card)return;
  e.stopPropagation();
  const id=card.dataset.id;
  if(pcTapTimer&&pcTapCard===id){
    /* double click/tap → open modal */
    clearTimeout(pcTapTimer);pcTapTimer=null;pcTapCard=null;
    openModal(id);
  } else {
    /* first tap → toggle image after short delay (to detect double) */
    pcTapCard=id;
    pcTapTimer=setTimeout(()=>{
      pcTapTimer=null;pcTapCard=null;
      const p=CATALOG[id];if(!p)return;
      const allImgs=p.imgs||[p.img];
      if(allImgs.length<2)return;
      const primary=card.querySelector('.pc-primary-img');
      const hover=card.querySelector('.pc-hover-img');
      if(!primary||!hover)return;
      const isFlipped=card.classList.contains('img-flipped');
      if(isFlipped){
        primary.style.opacity='';hover.style.opacity='';
        card.classList.remove('img-flipped');
      } else {
        primary.style.opacity='0';hover.style.opacity='1';
        card.classList.add('img-flipped');
      }
    },280);
  }
});
/* Search result cards: no data-id, just data-modal → open modal on click */
document.addEventListener('click',e=>{
  const card=e.target.closest('.pc[data-modal]:not([data-id])');
  if(card){e.stopPropagation();openModal(card.dataset.modal);}
});

/* ── SEARCH ─────────────────────────────────────────────── */
const searchOv=document.getElementById('search-ov');
document.getElementById('search-open-btn').addEventListener('click',()=>{searchOv.classList.add('on');setTimeout(()=>document.getElementById('search-input').focus(),200);});
document.getElementById('search-close').addEventListener('click',()=>searchOv.classList.remove('on'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){searchOv.classList.remove('on');closeModal();}});
document.getElementById('search-input').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  const res=document.getElementById('search-results');
  if(!q){res.innerHTML='';return;}
  const matches=Object.entries(CATALOG).filter(([id,p])=>
    p.name.toLowerCase().includes(q)||p.coll.toLowerCase().includes(q)||p.verse.toLowerCase().includes(q)||p.ins.toLowerCase().includes(q)||p.stones.some(s=>s.toLowerCase().includes(q))
  );
  if(!matches.length){res.innerHTML=`<p class="search-empty" style="grid-column:1/-1">nothing found for \u201c${q}\u201d \u2014 try a stone name or scripture reference</p>`;return;}
  res.innerHTML=matches.map(([id,p])=>`<article class="pc" data-modal="${id}" style="cursor:pointer"><div class="pc-wrap"><img src="${IMGS[p.img]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply"></div><p class="pc-coll">${p.coll}</p><p class="pc-name" style="font-size:14px">${p.name}</p><p class="pc-price">$${p.price}</p></article>`).join('');
});

/* ── TESTIMONY ─────────────────────────────────────────── */
function tGo(n){
  document.querySelectorAll('.t-sl').forEach((s,i)=>s.classList.toggle('on',i===n));
  document.querySelectorAll('.t-dot').forEach((d,i)=>d.classList.toggle('on',i===n));
  tIdx=n;
}
function tReset(){clearInterval(tTimer);tTimer=setInterval(()=>tGo((tIdx+1)%document.querySelectorAll('.t-sl').length),6800);}
document.querySelectorAll('.t-dot').forEach(d=>d.addEventListener('click',()=>{tGo(+d.dataset.sl);tReset();}));
tReset();

/* ── STATS COUNTER ─────────────────────────────────────── */
function animateStats(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=+el.dataset.count, start=Date.now(), dur=1400;
    const tick=()=>{
      const t=Math.min(1,(Date.now()-start)/dur);
      el.textContent=Math.round(target*(t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2))+(el.dataset.count==='100'?'%':'+');
      if(t<1) requestAnimationFrame(tick);
      else el.textContent=target+(el.dataset.count==='100'?'%':'');
    };
    requestAnimationFrame(tick);
  });
}
const statsIO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateStats();statsIO.disconnect();}});},{threshold:.3});
const statsEl=document.querySelector('.stats-section');
if(statsEl) statsIO.observe(statsEl);

/* ── JOURNAL ─────────────────────────────────────────────── */
function makeJournalCard(post){
  return `<article class="jc" data-post="${post.id}"><div class="jc-img"><span class="jc-deco">\u2746</span></div><div class="jc-meta"><span class="jc-e">${post.cat}</span><span class="jc-d">${post.date}</span><span class="jc-read">${post.read} read</span></div><h3 class="jc-ti">${post.title}</h3><p class="jc-ex">${post.exc}</p></article>`;
}
function buildJournalGrid(){
  const g=document.getElementById('journal-grid');
  if(!g)return;
  g.innerHTML=JOURNAL.map(makeJournalCard).join('');
  setTimeout(initReveals,60);
}
document.getElementById('home-journal').innerHTML=JOURNAL.slice(0,3).map(makeJournalCard).join('');
document.addEventListener('click',e=>{
  const card=e.target.closest('[data-post]');
  if(!card)return;
  const id=card.dataset.post;
  const post=JOURNAL.find(p=>p.id===id); if(!post)return;
  document.getElementById('journal-list-view').style.display='none';
  const pv=document.getElementById('journal-post-view');
  pv.style.display='';
  document.getElementById('post-content').innerHTML=`<div class="post-hero"><p class="post-e">${post.cat}</p><h1 class="post-h">${post.title}</h1><div class="post-meta"><span class="post-date">${post.date}</span><span class="post-date">${post.read} read</span></div></div><div class="post-body">${post.body}</div>`;
  goTo('journal');
  window.scrollTo({top:0,behavior:'smooth'});
});
document.getElementById('post-back-btn').addEventListener('click',()=>{
  document.getElementById('journal-list-view').style.display='';
  document.getElementById('journal-post-view').style.display='none';
  buildJournalGrid();
});

/* ── GIFT GUIDE TABS ─────────────────────────────────────── */
document.getElementById('gg-tabs').addEventListener('click',e=>{
  const b=e.target.closest('.gg-tab'); if(!b)return;
  document.querySelectorAll('.gg-tab').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.gg-panel').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  document.getElementById('gg-'+b.dataset.gg).classList.add('on');
});
const ggU150=document.getElementById('gg-grid-under150');
const gg150=document.getElementById('gg-grid-150to250');
if(ggU150) ggU150.innerHTML=Object.entries(CATALOG).filter(([,p])=>p.price<150).map(([id])=>makeProductCard(id)).join('');
if(gg150) gg150.innerHTML=Object.entries(CATALOG).filter(([,p])=>p.price>=150&&p.price<=250).map(([id])=>makeProductCard(id)).join('');

/* ── MOBILE MENU ─────────────────────────────────────────── */
const mobM=document.getElementById('mob-m');
document.getElementById('mob-open').addEventListener('click',()=>mobM.classList.add('on'));
document.getElementById('mob-x').addEventListener('click',()=>mobM.classList.remove('on'));

/* ── FAQ ─────────────────────────────────────────────────── */
document.addEventListener('click',e=>{
  const q=e.target.closest('.faq-q'); if(!q)return;
  const it=q.closest('.faq-it');
  const wasOpen=it.classList.contains('open');
  document.querySelectorAll('.faq-it').forEach(i=>i.classList.remove('open'));
  if(!wasOpen) it.classList.add('open');
});

/* ── NEWSLETTER ─────────────────────────────────────────── */
document.getElementById('nl-sub').addEventListener('click',()=>{
  const v=document.getElementById('nl-email').value;
  if(!v||!v.includes('@'))return;
  document.getElementById('nl-sub').textContent='\u2026sending';
  setTimeout(()=>{document.getElementById('nl-wrap').innerHTML='<p class="nl-done">received. a note is on its way. \u2726</p>';},800);
});

/* ── CONTACT ─────────────────────────────────────────────── */
document.getElementById('contact-submit').addEventListener('click',()=>{
  document.getElementById('contact-submit').textContent='\u2026sending';
  setTimeout(()=>{document.getElementById('contact-submit').style.display='none';document.getElementById('contact-done').style.display='';},900);
});

/* ── CUSTOM FORM ─────────────────────────────────────────────── */
document.addEventListener('click', e => {
  if(e.target.id === 'custom-submit'){
    e.target.textContent = '…sending';
    setTimeout(()=>{
      e.target.style.display='none';
      document.getElementById('custom-done').style.display='';
    }, 900);
  }
});

/* ── SIZE GUIDE IMAGE ─────────────────────────────────────────── */
const sgImg = document.getElementById('sg-img');
if(sgImg) sgImg.src = IMGS.amethyst;

/* ── INIT ─────────────────────────────────────────────────── */
buildHomeGrid();
buildShopGrid('all','featured');
buildJournalGrid();
initReveals();
})();
