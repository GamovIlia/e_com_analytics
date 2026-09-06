window.dataLayer = window.dataLayer || [];

const PRODUCTS = [
  {id:'alpha', name:'Alpha Backpack', category:'Backpacks', price:79, icon:'A', description:'Lightweight everyday backpack for work and short trips.'},
  {id:'orbit', name:'Orbit Bottle', category:'Accessories', price:24, icon:'O', description:'Insulated steel bottle, 700 ml.'},
  {id:'ridge', name:'Ridge Jacket', category:'Apparel', price:129, icon:'R', description:'Water-resistant shell for changing weather.'},
  {id:'field', name:'Field Cap', category:'Apparel', price:29, icon:'F', description:'Minimal cap made from recycled fabric.'},
  {id:'signal', name:'Signal Pouch', category:'Accessories', price:19, icon:'S', description:'Organizer for cables, chargers and small gear.'},
  {id:'base', name:'Base Tote', category:'Bags', price:39, icon:'B', description:'Structured tote for daily carry.'}
];

function pushEvent(event, params = {}) {
  const payload = { event, ...params };
  window.dataLayer.push(payload);
  console.log('[dataLayer]', payload);
}

function money(value){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value); }

function getCart(){
  try { return JSON.parse(localStorage.getItem('ga4_demo_cart') || '[]'); }
  catch { return []; }
}
function setCart(cart){
  localStorage.setItem('ga4_demo_cart', JSON.stringify(cart));
  updateCartBadge();
}
function cartCount(){ return getCart().reduce((s,x)=>s+x.quantity,0); }
function updateCartBadge(){
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartCount());
}
function gaItem(product, quantity=1){
  return {item_id:product.id,item_name:product.name,item_category:product.category,price:product.price,quantity};
}
function addToCart(id, quantity=1){
  const product = PRODUCTS.find(p=>p.id===id);
  if(!product) return;
  const cart=getCart();
  const row=cart.find(x=>x.id===id);
  if(row) row.quantity += quantity; else cart.push({id,quantity});
  setCart(cart);
  pushEvent('add_to_cart',{currency:'USD',value:product.price*quantity,items:[gaItem(product,quantity)]});
  const btn=document.querySelector(`[data-add="${id}"]`);
  if(btn){ const old=btn.textContent; btn.textContent='Added'; setTimeout(()=>btn.textContent=old,900); }
}
function removeFromCart(id){
  const cart=getCart();
  const row=cart.find(x=>x.id===id);
  const product=PRODUCTS.find(p=>p.id===id);
  if(row && product){
    pushEvent('remove_from_cart',{currency:'USD',value:product.price*row.quantity,items:[gaItem(product,row.quantity)]});
  }
  setCart(cart.filter(x=>x.id!==id));
  renderCart();
}
function updateQty(id, qty){
  const cart=getCart();
  const row=cart.find(x=>x.id===id);
  if(row){ row.quantity=Math.max(1,Number(qty)||1); setCart(cart); renderCart(false); }
}
function cartValue(cart=getCart()){
  return cart.reduce((sum,row)=>{
    const p=PRODUCTS.find(x=>x.id===row.id);
    return sum + (p ? p.price*row.quantity : 0);
  },0);
}

function productCard(p){
  return `
  <article class="card product-card" data-product-id="${p.id}">
    <a class="product-visual" href="product.html?id=${encodeURIComponent(p.id)}" data-product-link="${p.id}" aria-label="${p.name}">${p.icon}</a>
    <div class="card-body">
      <div class="meta">${p.category}</div>
      <h3><a href="product.html?id=${encodeURIComponent(p.id)}" data-product-link="${p.id}">${p.name}</a></h3>
      <p class="muted">${p.description}</p>
      <div class="price">${money(p.price)}</div>
      <div class="card-actions">
        <a class="btn btn-secondary" href="product.html?id=${encodeURIComponent(p.id)}" data-product-link="${p.id}">Details</a>
        <button class="btn btn-primary" data-add="${p.id}">Add</button>
      </div>
    </div>
  </article>`;
}

function renderCatalog(list=PRODUCTS){
  const root=document.querySelector('[data-product-grid]');
  if(!root) return;
  root.innerHTML=list.map(productCard).join('');
}

function renderFeatured(){
  const root=document.querySelector('[data-featured-grid]');
  if(!root) return;
  root.innerHTML=PRODUCTS.slice(0,3).map(productCard).join('');
}

function renderProduct(){
  const root=document.querySelector('[data-product-detail]');
  if(!root) return;
  const id=new URLSearchParams(location.search).get('id') || PRODUCTS[0].id;
  const p=PRODUCTS.find(x=>x.id===id) || PRODUCTS[0];
  document.title=`${p.name} | Metric Market`;
  root.innerHTML=`
    <div class="product-visual card" style="font-size:96px">${p.icon}</div>
    <div>
      <div class="meta">${p.category}</div>
      <h1 style="font-size:52px">${p.name}</h1>
      <p class="lead">${p.description}</p>
      <div class="price" style="font-size:32px">${money(p.price)}</div>
      <div class="actions">
        <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
        <a class="btn btn-secondary" href="catalog.html">Back to catalog</a>
      </div>
    </div>`;
  pushEvent('view_item',{currency:'USD',value:p.price,items:[gaItem(p)]});
}

function renderCart(track=true){
  const root=document.querySelector('[data-cart]');
  if(!root) return;
  const cart=getCart();
  if(track){
    pushEvent('view_cart',{
      currency:'USD',
      value:cartValue(cart),
      items:cart.map(row=>gaItem(PRODUCTS.find(p=>p.id===row.id),row.quantity)).filter(Boolean)
    });
  }
  if(!cart.length){
    root.innerHTML='<div class="panel"><h2>Your cart is empty</h2><p class="muted">Add a few products to continue the practice funnel.</p><a class="btn btn-primary" href="catalog.html">Open catalog</a></div>';
    return;
  }
  root.innerHTML=`
    <div class="panel">
      ${cart.map(row=>{
        const p=PRODUCTS.find(x=>x.id===row.id);
        if(!p) return '';
        return `<div class="cart-row">
          <div><strong>${p.name}</strong><div class="meta">${p.category} · ${money(p.price)}</div></div>
          <input class="qty" type="number" min="1" value="${row.quantity}" data-qty="${p.id}" aria-label="Quantity">
          <button class="btn btn-danger" data-remove="${p.id}">Remove</button>
        </div>`;
      }).join('')}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
        <span class="muted">Order total</span><span class="total">${money(cartValue(cart))}</span>
      </div>
      <div class="actions" style="justify-content:flex-end">
        <a class="btn btn-primary" href="checkout.html" data-begin-checkout>Checkout</a>
      </div>
    </div>`;
}

function handleSearchPage(){
  const root=document.querySelector('[data-search-results]');
  if(!root) return;
  const q=(new URLSearchParams(location.search).get('q')||'').trim();
  document.querySelectorAll('[data-search-term]').forEach(el=>el.textContent=q || 'all products');
  const list=q ? PRODUCTS.filter(p=>(p.name+' '+p.category+' '+p.description).toLowerCase().includes(q.toLowerCase())) : PRODUCTS;
  root.innerHTML=list.length ? list.map(productCard).join('') : '<div class="panel"><h3>No results</h3><p class="muted">Try “bag”, “apparel” or “bottle”.</p></div>';
  if(q) pushEvent('search',{search_term:q});
}

function handleCheckout(){
  const form=document.querySelector('[data-checkout-form]');
  if(!form) return;
  const cart=getCart();
  pushEvent('begin_checkout',{
    currency:'USD',value:cartValue(cart),
    items:cart.map(row=>gaItem(PRODUCTS.find(p=>p.id===row.id),row.quantity)).filter(Boolean)
  });
  const total=document.querySelector('[data-checkout-total]');
  if(total) total.textContent=money(cartValue(cart));
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(!form.reportValidity()) return;
    const transactionId='MM-'+Date.now();
    sessionStorage.setItem('ga4_demo_purchase',JSON.stringify({
      transaction_id:transactionId,
      currency:'USD',
      value:cartValue(cart),
      items:cart.map(row=>gaItem(PRODUCTS.find(p=>p.id===row.id),row.quantity)).filter(Boolean)
    }));
    localStorage.removeItem('ga4_demo_cart');
    location.href='thank-you.html';
  });
}

function handlePurchase(){
  const root=document.querySelector('[data-order-id]');
  if(!root) return;
  let purchase=null;
  try{ purchase=JSON.parse(sessionStorage.getItem('ga4_demo_purchase')||'null'); }catch{}
  if(!purchase){
    root.textContent='DEMO';
    return;
  }
  root.textContent=purchase.transaction_id;
  pushEvent('purchase',purchase);
  sessionStorage.removeItem('ga4_demo_purchase');
  updateCartBadge();
}

function handleLeadForm(){
  const form=document.querySelector('[data-lead-form]');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.reportValidity()) return;
    pushEvent('generate_lead',{form_id:'contact_form',lead_type:form.querySelector('[name="topic"]').value});
    form.reset();
    document.querySelector('[data-form-success]').hidden=false;
  });
}

function handleNewsletter(){
  document.querySelectorAll('[data-newsletter]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      pushEvent('sign_up',{method:'newsletter'});
      const input=form.querySelector('input');
      if(input) input.value='';
      const status=form.querySelector('[data-newsletter-status]');
      if(status) status.textContent='Subscribed';
    });
  });
}

function handleConsent(){
  const banner=document.querySelector('[data-cookie-banner]');
  if(!banner) return;
  const stored=localStorage.getItem('ga4_demo_consent');
  if(!stored) banner.hidden=false;
  document.querySelectorAll('[data-consent]').forEach(btn=>btn.addEventListener('click',()=>{
    const choice=btn.dataset.consent;
    localStorage.setItem('ga4_demo_consent',choice);
    banner.hidden=true;
    pushEvent('consent_update',{analytics_storage:choice==='accepted'?'granted':'denied'});
  }));
}

document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');
  if(add) addToCart(add.dataset.add);

  const remove=e.target.closest('[data-remove]');
  if(remove) removeFromCart(remove.dataset.remove);

  const productLink=e.target.closest('[data-product-link]');
  if(productLink){
    const p=PRODUCTS.find(x=>x.id===productLink.dataset.productLink);
    if(p) pushEvent('select_item',{item_list_name:'product_list',items:[gaItem(p)]});
  }

  const checkout=e.target.closest('[data-begin-checkout]');
  if(checkout) {
    const cart=getCart();
    pushEvent('checkout_click',{value:cartValue(cart),currency:'USD'});
  }

  const outbound=e.target.closest('a[data-outbound]');
  if(outbound) pushEvent('outbound_click',{link_url:outbound.href,link_text:outbound.textContent.trim()});
});

document.addEventListener('change',e=>{
  const qty=e.target.closest('[data-qty]');
  if(qty) updateQty(qty.dataset.qty,qty.value);
});

document.addEventListener('DOMContentLoaded',()=>{
  updateCartBadge();
  renderFeatured();
  renderCatalog();
  renderProduct();
  renderCart();
  handleSearchPage();
  handleCheckout();
  handlePurchase();
  handleLeadForm();
  handleNewsletter();
  handleConsent();

  const pageType=document.body.dataset.pageType || 'unknown';
  pushEvent('virtual_page_context',{page_type:pageType});
});
