(function () {
  'use strict';

  const { IMGS, CATALOG, JOURNAL } = window;

let cart = loadJSON('jrj_cart', {});
let wishlist = new Set(loadJSON('jrj_wishlist', []));
let currentPage = 'home';
let tIdx = 0, tTimer;

function loadJSON(key, fallback){
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveState(){
  localStorage.setItem('jrj_cart', JSON.stringify(cart));
  localStorage.setItem('jrj_wishlist', JSON.stringify([...wishlist]));
}


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
  const freeLeft=Math.max(0,120-total);
  const prog=Math.min(100,Math.round((total/120)*100));
  const progressHTML=`<div class="c-progress"><div class="c-progress-top"><span class="c-progress-msg">${freeLeft?`$${freeLeft} away from free shipping`:'free shipping unlocked ✦'}</span><span class="c-progress-val">${prog}%</span></div><div class="c-progress-track"><div class="c-progress-fill" style="width:${prog}%"></div></div></div>`;
  if(!ids.length){bd.innerHTML='<div class="c-emp"><p class="c-emp-ti">nothing gathered yet</p><p class="c-emp-b">the studio is waiting</p></div>';return;}

  bd.innerHTML=progressHTML+ids.map(id=>{
    const p=CATALOG[id];
    return `<div class="c-it"><div class="c-ii"><img src="${IMGS[p.img]}" alt="${p.name}"></div><div class="c-in"><div><p class="c-inm">${p.name}</p><p class="c-inv">${p.verse}</p><p class="c-ied">\u2116 ${String(p.edN).padStart(2,'0')} / ${p.edOf}</p></div><div class="c-ib"><div class="qty"><button class="qty-b" onclick="adjQty('${id}',-1)">\u2212</button><span class="qty-n">${cart[id]}</span><button class="qty-b" onclick="adjQty('${id}',1)">+</button></div><p class="c-ip">$${p.price*cart[id]}</p></div></div></div>`;
  }).join('')+cartSuggestion(ids);
}


function cartSuggestion(ids){
  const next = Object.entries(CATALOG).find(([id])=>!ids.includes(id));
  if(!next) return '';
  const [id,p]=next;
  return `<div class="c-suggest"><p class="c-suggest-title">you may also love</p><div class="c-suggest-card"><img src="${IMGS[p.img]}" alt="${p.name}"><div><p class="c-suggest-name">${p.name}</p><p class="c-suggest-price">$${p.price}</p></div><button class="c-suggest-add" onclick="addToCart('${id}')">add</button></div></div>`;
}
window.adjQty=(id,d)=>{if(!cart[id])return;cart[id]+=d;if(cart[id]<=0)delete cart[id];saveState();renderCart();};
window.addToCart=(id)=>{cart[id]=(cart[id]||0)+1;saveState();renderCart();toast('gathered for you');};

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
  saveState();
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
  return `<div class="rv"><article class="pc" data-id="${id}" data-modal="${id}"><div class="pc-wrap"><div class="pc-ed"><span>\u2116 ${String(p.edN).padStart(2,'0')} / ${p.edOf}</span></div><div class="pc-badge">${nw}${low}</div><button class="pc-wish ${wishlist.has(id)?'on':''}" data-wish="${id}"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="6.5" y1="1" x2="6.5" y2="12" stroke="${wishlist.has(id)?'#B6543C':'#2A1F18'}" stroke-width="1.2" stroke-linecap="round"/><line x1="1" y1="6.5" x2="12" y2="6.5" stroke="${wishlist.has(id)?'#B6543C':'#2A1F18'}" stroke-width="1.2" stroke-linecap="round"/></svg></button><img src="${IMGS[p.img]}" alt="${p.name}"><button class="pc-qa" data-id="${id}">add to bag \u2014 $${p.price}</button></div><p class="pc-coll">${p.coll}</p><div class="pc-foot"><div><p class="pc-name">${p.name}</p><p class="pc-verse">\u201c${p.ins}\u201d \u2014 ${p.verse}</p></div><p class="pc-price">$${p.price}</p></div></article></div>`;
}

/* ── HOME GRID ─────────────────────────────────────────── */
function buildHomeGrid(){
  const g=document.getElementById('home-grid');
  if(!g)return;
  g.innerHTML=['esther','ruth','hannah','mary'].map(id=>makeProductCard(id)).join('');
  setTimeout(initReveals,60);
}

/* ── SHOP ─────────────────────────────────────────────── */
let currentFilter='all',currentSort='featured', currentQuery='';
function productMatchesQuery(p, q){
  if(!q) return true;
  const hay = [p.name,p.coll,p.verse,p.ins,p.desc,p.storyName,(p.stones||[]).join(' ')].join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}
function getShopItems(filter=currentFilter, sort=currentSort, q=currentQuery){
  let items=Object.entries(CATALOG).filter(([id,p])=>(filter==='all'||p.cat===filter) && productMatchesQuery(p,q));
  if(sort==='price-asc') items.sort((a,b)=>a[1].price-b[1].price);
  else if(sort==='price-desc') items.sort((a,b)=>b[1].price-a[1].price);
  else if(sort==='edition') items.sort((a,b)=>a[1].edN-b[1].edN);
  return items;
}
function buildShopGrid(filter,sort){
  currentFilter=filter; currentSort=sort;
  const items=getShopItems(filter,sort,currentQuery);
  const g=document.getElementById('shop-grid');
  if(!g)return;
  g.innerHTML=items.length ? items.map(([id])=>makeProductCard(id)).join('') : `<p class="finder-empty">No pieces match that edit yet. Try clearing the search or choosing All pieces.</p>`;
  const count=document.getElementById('shop-count');
  if(count) count.textContent=`${items.length} piece${items.length===1?'':'s'}`;
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

const inlineSearch=document.getElementById('shop-inline-search');
if(inlineSearch){
  inlineSearch.addEventListener('input',e=>{currentQuery=e.target.value.trim();buildShopGrid(currentFilter,currentSort);});
}

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
function openModal(id){
  const p=CATALOG[id]; if(!p)return;
  document.getElementById('m-img').src=IMGS[p.img];
  document.getElementById('m-img').alt=p.name;
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
document.addEventListener('click',e=>{
  const card=e.target.closest('[data-modal]');
  if(card){e.stopPropagation();openModal(card.dataset.modal);}
});
document.addEventListener('click',e=>{
  const card=e.target.closest('.pc');
  if(card&&!e.target.closest('[data-wish]')&&!e.target.closest('.pc-qa')&&!e.target.closest('[data-modal]')){
    openModal(card.dataset.id);
  }
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



/* ── EXTRA UX POLISH ───────────────────────────────────── */
const scrollMeter=document.getElementById('scroll-meter');
const backTop=document.getElementById('back-top');
window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const pct=max>0?(window.scrollY/max)*100:0;
  if(scrollMeter) scrollMeter.style.width=pct+'%';
  if(backTop) backTop.classList.toggle('show',window.scrollY>650);
},{passive:true});
if(backTop) backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
const floatSearch=document.getElementById('float-search');
if(floatSearch) floatSearch.addEventListener('click',()=>{searchOv.classList.add('on');setTimeout(()=>document.getElementById('search-input').focus(),160);});

const cursor=document.getElementById('lux-cursor');
if(cursor && matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove',e=>{cursor.classList.add('on');cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';},{passive:true});
  document.addEventListener('mouseover',e=>cursor.classList.toggle('big',!!e.target.closest('button,a,.pc,.cc,.jc,.lb-cell')));
}

const finderOv=document.getElementById('finder-ov');
function openFinder(){finderOv.classList.add('on');renderFinderResults();document.body.style.overflow='hidden';}
function closeFinder(){finderOv.classList.remove('on');document.body.style.overflow='';}
['finder-open-btn','float-finder'].forEach(id=>{const el=document.getElementById(id); if(el) el.addEventListener('click',openFinder);});
const finderClose=document.getElementById('finder-close');
if(finderClose) finderClose.addEventListener('click',closeFinder);
if(finderOv) finderOv.addEventListener('click',e=>{if(e.target===finderOv)closeFinder();});
function finderValue(name){return document.querySelector(`[data-finder="${name}"] .finder-choice.on`)?.dataset.value||'all';}
function renderFinderResults(){
  const res=document.getElementById('finder-results'); if(!res) return;
  const mood=finderValue('mood'), stone=finderValue('stone'), budget=finderValue('budget');
  let items=Object.entries(CATALOG).filter(([id,p])=>{
    const text=[p.name,p.coll,p.verse,p.ins,p.desc,p.storyName,(p.stones||[]).join(' ')].join(' ').toLowerCase();
    const moodOK=mood==='all'||(mood==='protection'&&(text.includes('strength')||text.includes('shield')||text.includes('courage')||text.includes('deborah')||text.includes('esther')))||(mood==='devotion'&&(text.includes('faith')||text.includes('prayer')||text.includes('mary')||text.includes('hannah')||text.includes('ruth')))||(mood==='bold'&&(p.price>=150||p.cat==='sets'));
    const stoneOK=stone==='all'||text.includes(stone);
    const budgetOK=budget==='all'||p.price<=Number(budget);
    return moodOK&&stoneOK&&budgetOK;
  }).slice(0,3);
  if(!items.length) items=Object.entries(CATALOG).slice(0,3);
  res.innerHTML=items.length?items.map(([id])=>makeProductCard(id)).join(''):'<p class="finder-empty">No exact match yet. Try opening one of the filters.</p>';
}
document.addEventListener('click',e=>{
  const choice=e.target.closest('.finder-choice'); if(!choice)return;
  const group=choice.closest('.finder-options');
  group.querySelectorAll('.finder-choice').forEach(b=>b.classList.remove('on'));
  choice.classList.add('on');
  renderFinderResults();
});

// Remember dismissed top launch bar for this browser.
const arrivalsBar=document.getElementById('arrivals-bar');
if(arrivalsBar && localStorage.getItem('jrj_arrivals_closed')==='1') arrivalsBar.style.display='none';
if(arrivalsBar){
  const close=arrivalsBar.querySelector('button[onclick]');
  if(close) close.addEventListener('click',()=>localStorage.setItem('jrj_arrivals_closed','1'));
}

/* ── INIT ─────────────────────────────────────────────────── */

const initialWishBadge=document.getElementById('wish-badge');
if(initialWishBadge){initialWishBadge.textContent=wishlist.size;initialWishBadge.style.display=wishlist.size?'':'none';}
renderCart();
buildHomeGrid();
buildShopGrid('all','featured');
buildJournalGrid();
initReveals();
})();

/* ══════════════════════════════════════════════════════════════
   NEW FEATURES — v3
   ══════════════════════════════════════════════════════════════ */

/* ── TOAST QUEUE (replaces single toast) ────────────────────── */
const toastStack = document.getElementById('toast-stack');
// Keep old toastEl working for backwards compat but route through stack
const _origToast = toast;
function toast(msg, duration = 2200) {
  const el = document.createElement('div');
  el.className = 'toast-item';
  el.textContent = '✦ ' + msg;
  toastStack.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, duration);
}
// Also update the old #toast element to be invisible (stack handles it now)
const oldToast = document.getElementById('toast');
if (oldToast) oldToast.style.display = 'none';

/* ── RECENTLY VIEWED ─────────────────────────────────────────── */
let recentlyViewed = loadJSON('jrj_recent', []);
function trackView(id) {
  recentlyViewed = [id, ...recentlyViewed.filter(x => x !== id)].slice(0, 6);
  localStorage.setItem('jrj_recent', JSON.stringify(recentlyViewed));
}
function renderRecentlyViewed() {
  const section = document.getElementById('recently-viewed');
  if (!section) return;
  // Filter out items currently visible in shop grid
  const shown = recentlyViewed.filter(id => CATALOG[id]);
  if (shown.length < 2) { section.style.display = 'none'; return; }
  section.style.display = '';
  section.innerHTML = `
    <p class="rv-section-eye">recently viewed</p>
    <div class="rv-rail">
      ${shown.map(id => {
        const p = CATALOG[id];
        return `<div class="rv-card" data-modal="${id}">
          <img src="${IMGS[p.img]}" alt="${p.name}">
          <p class="rv-card-name">${p.name}</p>
          <p class="rv-card-price">$${p.price}</p>
        </div>`;
      }).join('')}
    </div>`;
}
// Patch openModal to track views and show recent in modal footer
const _baseOpenModal = openModal;
window.openModal = function(id) {
  _baseOpenModal(id);
  trackView(id);
  // Append recently viewed to modal content after render
  setTimeout(() => {
    const cnt = document.getElementById('m-cnt');
    if (!cnt) return;
    const others = recentlyViewed.filter(x => x !== id && CATALOG[x]);
    if (others.length >= 2) {
      const rv = document.createElement('div');
      rv.className = 'm-rv';
      rv.innerHTML = `<p class="m-rv-l">recently viewed</p>
        <div class="m-rv-rail">
          ${others.slice(0, 4).map(rid => {
            const p = CATALOG[rid];
            return `<div class="m-rv-card" data-modal="${rid}">
              <img src="${IMGS[p.img]}" alt="${p.name}">
              <p>${p.name}</p>
            </div>`;
          }).join('')}
        </div>`;
      cnt.appendChild(rv);
    }
  }, 80);
};
// Show recently viewed on shop page after filter
const _baseShop = buildShopGrid;
function buildShopGrid(filter, sort) {
  _baseShop(filter, sort);
  renderRecentlyViewed();
}

/* ── COMPARE ─────────────────────────────────────────────────── */
let compareSet = new Set();
const CMP_MAX = 3;
const cmpTray = document.getElementById('cmp-tray');
const cmpOv   = document.getElementById('cmp-ov');

function cmpRenderTray() {
  const arr = [...compareSet];
  for (let i = 0; i < CMP_MAX; i++) {
    const slot = document.getElementById(`cmp-slot-${i}`);
    if (!slot) continue;
    if (arr[i]) {
      const p = CATALOG[arr[i]];
      slot.className = 'cmp-slot';
      slot.innerHTML = `
        <img src="${IMGS[p.img]}" alt="${p.name}">
        <span class="cmp-slot-name">${p.name}</span>
        <button class="cmp-slot-remove" data-cmp-remove="${arr[i]}" title="Remove">×</button>`;
    } else {
      slot.className = 'cmp-slot cmp-slot-empty';
      slot.innerHTML = 'add a piece';
    }
  }
  cmpTray.classList.toggle('open', compareSet.size > 0);
  document.body.classList.toggle('cmp-open', compareSet.size > 0);
  // Update all compare buttons
  document.querySelectorAll('.pc-compare').forEach(b => {
    const id = b.dataset.cmpId;
    b.classList.toggle('in-compare', compareSet.has(id));
    b.textContent = compareSet.has(id) ? 'remove from compare' : '+ compare';
    if (compareSet.has(id)) b.classList.add('in-compare');
  });
}

function toggleCompare(id) {
  if (compareSet.has(id)) {
    compareSet.delete(id);
    toast('removed from comparison');
  } else {
    if (compareSet.size >= CMP_MAX) {
      toast(`compare up to ${CMP_MAX} pieces`); return;
    }
    compareSet.add(id);
    toast('added to comparison ✦');
  }
  cmpRenderTray();
}

// View compare overlay
document.getElementById('cmp-view-btn')?.addEventListener('click', () => {
  const arr = [...compareSet];
  if (arr.length < 2) { toast('add at least 2 pieces to compare'); return; }
  const fields = [
    { label: '', key: 'img', render: p => `<img src="${IMGS[p.img]}" alt="${p.name}">` },
    { label: 'piece', key: 'name', render: p => p.name },
    { label: 'collection', key: 'coll', render: p => p.coll },
    { label: 'price', key: 'price', render: p => `$${p.price}` },
    { label: 'scripture', key: 'verse', render: p => p.verse },
    { label: 'edition', key: 'edN', render: p => `№ ${String(p.edN).padStart(2,'0')} of ${p.edOf}` },
    { label: 'type', key: 'cat', render: p => p.cat },
    { label: 'stones', key: 'stones', render: p => (p.stones || []).join(', ') },
    { label: 'add to bag', key: '_add', render: (p, id) => `<button class="btn btn-dark" style="width:100%;padding:11px;font-size:10px" onclick="addToCart('${id}')">add — $${p.price}</button>` },
  ];
  const cols = arr.length + 1;
  const table = document.getElementById('cmp-table');
  table.style.cssText = `display:grid;gap:0`;
  table.innerHTML = fields.map(f => `
    <div class="cmp-row" style="grid-template-columns:90px ${arr.map(() => '1fr').join(' ')}">
      <div class="cmp-row-label">${f.label}</div>
      ${arr.map(id => {
        const p = CATALOG[id];
        const isImg = f.key === 'img';
        const isAdd = f.key === '_add';
        const isHighlight = ['name','price'].includes(f.key);
        return `<div class="cmp-cell ${isHighlight ? 'highlight' : ''}" style="${isImg?'padding:8px':''}">${f.render(p, id)}</div>`;
      }).join('')}
    </div>`).join('');
  cmpOv.classList.add('on');
  document.body.style.overflow = 'hidden';
});

document.getElementById('cmp-close')?.addEventListener('click', () => {
  cmpOv.classList.remove('on');
  document.body.style.overflow = '';
});
cmpOv?.addEventListener('click', e => {
  if (e.target === cmpOv) { cmpOv.classList.remove('on'); document.body.style.overflow = ''; }
});
document.getElementById('cmp-clear')?.addEventListener('click', () => {
  compareSet.clear(); cmpRenderTray(); toast('comparison cleared');
});
document.addEventListener('click', e => {
  const rem = e.target.closest('[data-cmp-remove]');
  if (rem) { compareSet.delete(rem.dataset.cmpRemove); cmpRenderTray(); }
  const add = e.target.closest('[data-cmp-id]');
  if (add && add.classList.contains('pc-compare')) { e.stopPropagation(); toggleCompare(add.dataset.cmpId); }
});

// Patch makeProductCard to inject compare button
const _baseMakeCard = makeProductCard;
function makeProductCard(id, extra) {
  let html = _baseMakeCard(id, extra);
  // Insert compare button just before the closing </article>
  html = html.replace('</article>', `<button class="pc-compare ${compareSet.has(id) ? 'in-compare' : ''}" data-cmp-id="${id}">${compareSet.has(id) ? 'remove from compare' : '+ compare'}</button></article>`);
  return html;
}

/* ── SHARE BUTTON ─────────────────────────────────────────────── */
function makeShareButton(id) {
  return `<button class="m-share" id="share-btn-${id}">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" stroke-width="1.1"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" stroke-width="1.1"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" stroke-width="1.1"/><line x1="4" y1="7.2" x2="9" y2="10.5" stroke="currentColor" stroke-width="1.1"/><line x1="4" y1="5.8" x2="9" y2="2.5" stroke="currentColor" stroke-width="1.1"/></svg>
    share this piece
  </button>`;
}
document.addEventListener('click', async e => {
  const btn = e.target.closest('[id^="share-btn-"]');
  if (!btn) return;
  const id = btn.id.replace('share-btn-','');
  const p = CATALOG[id];
  if (!p) return;
  const shareData = {
    title: `${p.name} — Jenny's Radiant Jewelry`,
    text: `"${p.ins}" — ${p.verse}. ${p.name} from the ${p.coll} collection.`,
    url: window.location.href,
  };
  if (navigator.share && navigator.canShare?.(shareData)) {
    try { await navigator.share(shareData); toast('shared ✦'); } catch {}
  } else {
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
      toast('link copied to clipboard ✦');
    } catch {
      toast('share: ' + shareData.title);
    }
  }
});
// Patch openModal to append share button + qty
const __baseOpenModal = window.openModal;
window.openModal = function(id) {
  __baseOpenModal(id);
  setTimeout(() => {
    const cnt = document.getElementById('m-cnt');
    if (!cnt) return;
    // Inject qty selector before the add-to-bag button
    const addBtn = cnt.querySelector('.m-add');
    if (addBtn && !cnt.querySelector('.m-qty-row')) {
      const qtyRow = document.createElement('div');
      qtyRow.className = 'm-qty-row';
      qtyRow.innerHTML = `
        <span class="m-qty-lbl">Qty</span>
        <div class="m-qty-ctrl">
          <button class="m-qty-b" id="mqty-dec">−</button>
          <span class="m-qty-n" id="mqty-val">1</span>
          <button class="m-qty-b" id="mqty-inc">+</button>
        </div>`;
      cnt.insertBefore(qtyRow, addBtn);
      let qty = 1;
      cnt.querySelector('#mqty-dec').addEventListener('click', () => {
        if (qty > 1) qty--;
        cnt.querySelector('#mqty-val').textContent = qty;
      });
      cnt.querySelector('#mqty-inc').addEventListener('click', () => {
        if (qty < 5) qty++;
        cnt.querySelector('#mqty-val').textContent = qty;
      });
      // Override the add button to use qty
      addBtn.onclick = null;
      addBtn.addEventListener('click', () => {
        for (let i = 0; i < qty; i++) addToCart(id);
        closeModal();
        if (qty > 1) toast(`${qty}× ${CATALOG[id].name} added ✦`);
      });
    }
    // Inject notify-me for near-sold-out pieces
    const p = CATALOG[id];
    if (p && p.edN <= 3) {
      const avail = cnt.querySelector('.m-avail');
      if (avail && !cnt.querySelector('.m-notify-btn')) {
        const notifyBtn = document.createElement('button');
        notifyBtn.className = 'm-notify-btn btn btn-outline';
        notifyBtn.style.cssText = 'width:100%;margin-bottom:10px;font-size:10px;padding:11px';
        notifyBtn.textContent = 'notify me when available';
        notifyBtn.dataset.notifyId = id;
        cnt.insertBefore(notifyBtn, cnt.querySelector('.m-add'));
      }
    }
    // Inject share button
    const trust = cnt.querySelector('.m-trust');
    if (trust && !cnt.querySelector('.m-share')) {
      const actionsRow = document.createElement('div');
      actionsRow.className = 'm-actions-row';
      actionsRow.innerHTML = makeShareButton(id);
      cnt.insertBefore(actionsRow, trust);
    }
  }, 60);
};

/* ── NOTIFY ME ─────────────────────────────────────────────────── */
const notifyOv = document.getElementById('notify-ov');
let notifyTargetId = null;
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-notify-id]');
  if (!btn) return;
  notifyTargetId = btn.dataset.notifyId;
  const p = CATALOG[notifyTargetId];
  if (p) document.getElementById('notify-piece-name').textContent = p.name;
  document.getElementById('notify-email').value = '';
  document.getElementById('notify-form').style.display = 'flex';
  document.getElementById('notify-ok').style.display = 'none';
  notifyOv.classList.add('on');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('notify-email').focus(), 200);
});
document.getElementById('notify-close')?.addEventListener('click', () => {
  notifyOv.classList.remove('on');
  document.body.style.overflow = '';
});
notifyOv?.addEventListener('click', e => {
  if (e.target === notifyOv) { notifyOv.classList.remove('on'); document.body.style.overflow = ''; }
});
document.getElementById('notify-submit')?.addEventListener('click', () => {
  const email = document.getElementById('notify-email').value;
  if (!email || !email.includes('@')) { toast('please enter a valid email'); return; }
  document.getElementById('notify-form').style.display = 'none';
  document.getElementById('notify-ok').style.display = '';
  // Save to localStorage (in a real app this posts to a server)
  const notifications = loadJSON('jrj_notify', {});
  if (!notifications[notifyTargetId]) notifications[notifyTargetId] = [];
  notifications[notifyTargetId].push(email);
  localStorage.setItem('jrj_notify', JSON.stringify(notifications));
  toast('you\'re on the list ✦');
  setTimeout(() => { notifyOv.classList.remove('on'); document.body.style.overflow = ''; }, 2000);
});

/* ── STICKY MOBILE BUY BAR ─────────────────────────────────────── */
const stickyBar = document.getElementById('sticky-bar');
const sbName = document.getElementById('sb-name');
const sbPrice = document.getElementById('sb-price');
const sbAdd = document.getElementById('sb-add');
let stickyProduct = null;

// Track the last product card that entered the viewport
const stickyObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.dataset.id || e.target.closest('[data-id]')?.dataset.id;
      if (id && CATALOG[id]) {
        stickyProduct = id;
        const p = CATALOG[id];
        sbName.textContent = p.name;
        sbPrice.textContent = '$' + p.price;
        sbAdd.onclick = () => { addToCart(id); toast('gathered for you'); };
      }
    }
  });
}, { threshold: 0.5 });

function observeProductCards() {
  document.querySelectorAll('.pc[data-id]').forEach(card => stickyObserver.observe(card));
}

// Show/hide sticky bar based on scroll + only on shop page
window.addEventListener('scroll', () => {
  if (currentPage !== 'shop') { stickyBar?.classList.remove('visible'); return; }
  const hasScrolled = window.scrollY > 300;
  stickyBar?.classList.toggle('visible', hasScrolled && !!stickyProduct);
}, { passive: true });

// Re-observe when shop grid rebuilds (patch buildShopGrid)
const __baseShop = buildShopGrid;
function buildShopGrid(filter, sort) {
  __baseShop(filter, sort);
  setTimeout(observeProductCards, 120);
}
// Also observe home grid
const _baseHomeGrid = buildHomeGrid;
function buildHomeGrid() {
  _baseHomeGrid();
  setTimeout(observeProductCards, 120);
}

/* ── GIFT NOTE CHARACTER COUNTER ─────────────────────────────── */
const cartNote = document.querySelector('.c-note');
if (cartNote) {
  // Wrap in a wrapper div for the counter
  const wrapper = document.createElement('div');
  wrapper.className = 'c-note-wrap';
  cartNote.parentNode.insertBefore(wrapper, cartNote);
  wrapper.appendChild(cartNote);
  const counter = document.createElement('span');
  counter.className = 'c-note-count';
  counter.textContent = '150';
  wrapper.appendChild(counter);
  cartNote.setAttribute('maxlength', 150);
  cartNote.addEventListener('input', () => {
    const left = 150 - cartNote.value.length;
    counter.textContent = left;
    counter.classList.toggle('near', left <= 20);
  });
}

/* ── PRINT CARE GUIDE ─────────────────────────────────────────── */
// Inject print button into care guide page header
const carePh = document.querySelector('#page-care .ph');
if (carePh) {
  const printBtn = document.createElement('button');
  printBtn.className = 'print-btn';
  printBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="4" width="9" height="6" rx="1" stroke="currentColor" stroke-width="1.1"/><path d="M4 4V2h5v2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><rect x="4" y="7" width="5" height="3" fill="currentColor" opacity=".3"/></svg> print this guide`;
  printBtn.addEventListener('click', () => {
    // Switch to care page first if not already there
    if (currentPage !== 'care') goTo('care');
    setTimeout(() => window.print(), 200);
  });
  carePh.style.display = 'flex';
  carePh.style.alignItems = 'flex-start';
  carePh.style.justifyContent = 'space-between';
  carePh.style.gap = '20px';
  carePh.style.flexWrap = 'wrap';
  carePh.appendChild(printBtn);
}

/* ── TOUCH / SWIPE TESTIMONIALS ───────────────────────────────── */
(function initSwipe() {
  const stage = document.getElementById('t-stage');
  if (!stage) return;
  let startX = 0, startY = 0, isDragging = false;
  stage.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return; // not a horizontal swipe
    const slides = document.querySelectorAll('.t-sl');
    const total = slides.length;
    if (dx < 0) {
      // Swipe left = next
      tGo((tIdx + 1) % total);
    } else {
      // Swipe right = prev
      tGo((tIdx - 1 + total) % total);
    }
    tReset();
  }, { passive: true });
  stage.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dy = e.touches[0].clientY - startY;
    const dx = e.touches[0].clientX - startX;
    // If more horizontal than vertical, prevent page scroll
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }, { passive: false });
})();

/* ── KEYBOARD NAVIGATION ──────────────────────────────────────── */
document.addEventListener('keydown', e => {
  // Escape closes everything
  if (e.key === 'Escape') {
    document.getElementById('search-ov')?.classList.remove('on');
    document.getElementById('finder-ov')?.classList.remove('on');
    cmpOv?.classList.remove('on');
    notifyOv?.classList.remove('on');
    document.body.style.overflow = '';
    const mOv = document.getElementById('m-ov');
    if (mOv?.classList.contains('on')) { mOv.classList.remove('on'); document.body.style.overflow = ''; }
  }
  // Arrow keys navigate testimonials (when no modal is open)
  const anyModalOpen = document.querySelector('#m-ov.on,#search-ov.on,#finder-ov.on,#cmp-ov.on,#notify-ov.on');
  if (!anyModalOpen && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    const slides = document.querySelectorAll('.t-sl');
    if (!slides.length) return;
    const total = slides.length;
    if (e.key === 'ArrowLeft') tGo((tIdx - 1 + total) % total);
    else tGo((tIdx + 1) % total);
    tReset();
  }
});

// Focus trap in product modal
document.getElementById('m-ov')?.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = document.getElementById('m-box')?.querySelectorAll('button,input,select,textarea,[tabindex]');
  if (!focusable?.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ── RE-INIT ON PAGE NAVIGATION ──────────────────────────────── */
// Patch goTo to hide sticky bar + reinit observers when leaving shop
const __baseGoTo = goTo;
function goTo(id) {
  __baseGoTo(id);
  if (id !== 'shop') stickyBar?.classList.remove('visible');
  if (id === 'shop') setTimeout(observeProductCards, 150);
}

/* ── INIT NEW FEATURES ────────────────────────────────────────── */
renderRecentlyViewed();
observeProductCards();
