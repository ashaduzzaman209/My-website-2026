// ============ HELPERS ============
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;
}
function formatBDT(amount) {
  return '৳ ' + amount.toLocaleString('bn-BD');
}

// ============ ADD TO CART ============
function addToCart(id, qty = 1) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }
  saveCart(cart);
  showToast('✅ কার্টে যোগ হয়েছে!');
}

// ============ TOAST ============
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 25px; right: 25px;
      background: #27ae60; color: #fff; padding: 12px 22px;
      border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-size: 15px; z-index: 9999; transition: 0.3s;
      opacity: 0; transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; }, 2200);
}

// ============ RENDER PRODUCTS ============
let currentCategory = 'all';
let currentSearch = '';

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCat = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                        p.description.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    document.getElementById('noResult').style.display = 'block';
    return;
  }
  document.getElementById('noResult').style.display = 'none';

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <a href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </a>
      <div class="product-info">
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div>
          <span class="price">${formatBDT(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${formatBDT(p.oldPrice)}</span>` : ''}
        </div>
        <button class="btn-add" onclick="addToCart(${p.id})">🛒 কার্টে যোগ করুন</button>
      </div>
    </div>
  `).join('');
}

// ============ EVENTS ============
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts();

  // Search
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      currentSearch = searchInput.value.trim();
      renderProducts();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        currentSearch = searchInput.value.trim();
        renderProducts();
      }
    });
  }

  // Category
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      renderProducts();
    });
  });

  // Auth link
  const authLink = document.getElementById('authLink');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (authLink && user) {
    authLink.textContent = '👤 ' + user.name.split(' ')[0];
    authLink.href = 'orders.html';
  }
});
