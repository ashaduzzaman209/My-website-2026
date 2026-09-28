// ========== STATE MANAGEMENT ==========
let currentUser = null;
let posts = [];
let uploadedImageData = null;

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  if (currentUser) {
    showMainApp();
  }
  populateDateDropdowns();
  setupImageUpload();
  setupSearch();
});

// ========== DATE DROPDOWNS ==========
function populateDateDropdowns() {
  const daySelect = document.getElementById('signupDay');
  const yearSelect = document.getElementById('signupYear');
  for (let i = 1; i <= 31; i++) {
    daySelect.innerHTML += `<option value="${i}">${i}</option>`;
  }
  for (let i = 2024; i >= 1950; i--) {
    yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }
}

// ========== AUTH FUNCTIONS ==========
function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('ইমেইল এবং পাসওয়ার্ড দিন!');
    return;
  }

  // Check stored user
  const storedUser = JSON.parse(localStorage.getItem('sb_user'));
  if (storedUser && storedUser.email === email) {
    currentUser = storedUser;
  } else {
    // Create a default user
    currentUser = {
      name: email.split('@')[0] || 'ব্যবহারকারী',
      email: email,
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random()*70)}`
    };
  }

  localStorage.setItem('sb_user', JSON.stringify(currentUser));
  showMainApp();
}

function signupUser() {
  const firstName = document.getElementById('signupFirstName').value.trim();
  const lastName = document.getElementById('signupLastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const genderEl = document.querySelector('input[name="gender"]:checked');

  if (!firstName || !email || !password) {
    alert('সব তথ্য পূরণ করুন!');
    return;
  }

  currentUser = {
    name: firstName + ' ' + lastName,
    email: email,
    gender: genderEl ? genderEl.value : 'other',
    avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random()*70)}`
  };

  localStorage.setItem('sb_user', JSON.stringify(currentUser));
  showMainApp();
}

function logoutUser() {
  if (!confirm('লগআউট করতে চান?')) return;
  currentUser = null;
  localStorage.removeItem('sb_user');
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('profileDropdown').classList.add('hidden');
}

function showSignup() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('signupPage').classList.remove('hidden');
}

function showLogin() {
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
}

// ========== SHOW MAIN APP ==========
function showMainApp() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  // Set avatars
  ['navAvatar', 'dropdownAvatar', 'sidebarAvatar', 'postAvatar', 'storyAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = currentUser.avatar;
  });
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('sidebarName').textContent = currentUser.name;

  renderPosts();
}

// ========== POSTS ==========
function createPost() {
  const content = document.getElementById('postInput').value.trim();
  if (!content && !uploadedImageData) {
    alert('কিছু লিখুন বা ছবি যুক্ত করুন!');
    return;
  }

  const post = {
    id: Date.now(),
    author: currentUser.name,
    avatar: currentUser.avatar,
    content: content,
    image: uploadedImageData,
    time: new Date().toLocaleString('bn-BD'),
    likes: 0,
    liked: false,
    comments: 0
  };

  posts.unshift(post);
  saveToStorage();
  renderPosts();

  // Reset
  document.getElementById('postInput').value = '';
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('imagePreview').src = '';
  uploadedImageData = null;
}

function renderPosts() {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  if (posts.length === 0) {
    // Sample posts for first time
    if (currentUser) {
      posts = generateSamplePosts();
      saveToStorage();
    }
  }

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post-card';
    postEl.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="${post.author}" onclick="viewProfile('${post.author}')">
        <div class="post-user-info">
          <h4 onclick="viewProfile('${post.author}')">${post.author}</h4>
          <span>${post.time} · <i class="fas fa-globe-asia"></i></span>
        </div>
        <button class="post-more">⋯</button>
      </div>
      ${post.content ? `<div class="post-content">${escapeHtml(post.content)}</div>` : ''}
      ${post.image ? `<div class="post-content"><img src="${post.image}" onclick="openImageModal('${post.image}')"></div>` : ''}
      <div class="post-stats">
        <div class="like-count">
          <span class="like-icon">👍</span> ${post.likes} জন
        </div>
        <div>${post.comments} কমেন্ট</div>
      </div>
      <div class="post-actions">
        <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
          <i class="fas fa-thumbs-up"></i> Like
        </button>
        <button class="post-action-btn" onclick="addComment(${post.id})">
          <i class="fas fa-comment"></i> Comment
        </button>
        <button class="post-action-btn" onclick="sharePost(${post.id})">
          <i class="fas fa-share"></i> Share
        </button>
      </div>
    `;
    container.appendChild(postEl);
  });
}

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveToStorage();
  renderPosts();
}

function addComment(id) {
  const comment = prompt('আপনার কমেন্ট লিখুন:');
  if (comment && comment.trim()) {
    const post = posts.find(p => p.id === id);
    post.comments++;
    saveToStorage();
    renderPosts();
    alert('কমেন্ট যোগ হয়েছে!');
  }
}

function sharePost(id) {
  alert('পোস্ট শেয়ার হয়েছে! ✅');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== IMAGE UPLOAD ==========
function setupImageUpload() {
  const input = document.getElementById('imageUpload');
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadedImageData = ev.target.result;
      const preview = document.getElementById('imagePreview');
      preview.src = uploadedImageData;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
}

function openImagePicker() {
  document.getElementById('imageUpload').click();
}

function openImageModal(src) {
  document.getElementById('modalImage').src = src;
  document.getElementById('imageModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('imageModal').classList.add('hidden');
}

// ========== PROFILE MENU ==========
function toggleProfileMenu() {
  document.getElementById('profileDropdown').classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('profileDropdown');
  const btn = e.target.closest('.profile-menu');
  if (!btn && !e.target.closest('.profile-dropdown')) {
    menu.classList.add('hidden');
  }
});

function showProfile() {
  alert(`👤 প্রোফাইল: ${currentUser.name}\n📧 ${currentUser.email}`);
}

function viewProfile(name) {
  alert(`👤 ${name} এর প্রোফাইল`);
}

function createStory() {
  alert('📸 স্টোরি তৈরি করুন!');
}

// ========== SEARCH ==========
function setupSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      alert(`🔍 "${input.value}" খোঁজা হচ্ছে...`);
      input.value = '';
    }
  });
}

// ========== STORAGE ==========
function saveToStorage() {
  localStorage.setItem('sb_posts', JSON.stringify(posts));
}

function loadFromStorage() {
  currentUser = JSON.parse(localStorage.getItem('sb_user'));
  posts = JSON.parse(localStorage.getItem('sb_posts')) || [];
}

// ========== SAMPLE POSTS ==========
function generateSamplePosts() {
  return [
    {
      id: 1,
      author: 'রাহুল আহমেদ',
      avatar: 'https://i.pravatar.cc/40?img=5',
      content: 'আজকের সকালটা অসাধারণ ছিল! ☀️🌅 সবাইকে শুভ সকাল।',
      image: 'https://picsum.photos/500/300?random=20',
      time: '২ ঘন্টা আগে',
      likes: 24,
      liked: false,
      comments: 5
    },
    {
      id: 2,
      author: 'সাদিয়া খান',
      avatar: 'https://i.pravatar.cc/40?img=6',
      content: 'নতুন প্রজেক্ট শুরু করলাম! JavaScript শিখছি। কেউ সাহায্য করতে পারবেন? 💻✨',
      image: null,
      time: '৫ ঘন্টা আগে',
      likes: 42,
      liked: true,
      comments: 12
    },
    {
      id: 3,
      author: 'করিম হোসেন',
      avatar: 'https://i.pravatar.cc/40?img=7',
      content: 'চট্টগ্রামের সমুদ্র সৈকতের সৌন্দর্য! 🌊🏖️',
      image: 'https://picsum.photos/500/400?random=21',
      time: '১ দিন আগে',
      likes: 156,
      liked: false,
      comments: 23
    },
    {
      id: 4,
      author: 'নিলা রহমান',
      avatar: 'https://i.pravatar.cc/40?img=9',
      content: 'আজ আমার জন্মদিন! 🎂🎉 সবাই দোয়া করবেন।',
      image: null,
      time: '২ দিন আগে',
      likes: 89,
      liked: true,
      comments: 45
    }
  ];
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 'Enter' && currentUser) {
    createPost();
  }
});
