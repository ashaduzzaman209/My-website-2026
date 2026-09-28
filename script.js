// ========== STATE ==========
let currentUser = null;
let posts = [];
let uploadedImageData = null;
let savedPosts = [];
let darkMode = false;

// ========== SAMPLE FRIENDS ==========
const friends = [
  { name: 'Rahul Ahmed', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Sadia Khan', avatar: 'https://i.pravatar.cc/150?img=6' },
  { name: 'Karim Hossain', avatar: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Nila Rahman', avatar: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Ayesha Sultana', avatar: 'https://i.pravatar.cc/150?img=8' }
];

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  populateDateDropdowns();
  setupImageUpload();
  setupSearch();
  setupOutsideClick();
  renderStories();
  
  if (currentUser) {
    showMainApp();
  }
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

// ========== AUTH ==========
function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) return toast('⚠️ Please enter email and password!');

  const storedUser = JSON.parse(localStorage.getItem('sb_user'));
  if (storedUser && storedUser.email === email) {
    currentUser = storedUser;
  } else {
    currentUser = {
      name: email.split('@')[0] || 'User',
      email: email,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`
    };
  }

  localStorage.setItem('sb_user', JSON.stringify(currentUser));
  showMainApp();
  toast(`👋 Welcome, ${currentUser.name}!`);
}

function signupUser() {
  const firstName = document.getElementById('signupFirstName').value.trim();
  const lastName = document.getElementById('signupLastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const genderEl = document.querySelector('input[name="gender"]:checked');

  if (!firstName || !email || !password) return toast('⚠️ Please fill all fields!');

  currentUser = {
    name: firstName + ' ' + lastName,
    email: email,
    gender: genderEl ? genderEl.value : 'other',
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`
  };

  localStorage.setItem('sb_user', JSON.stringify(currentUser));
  showMainApp();
  toast(`🎉 Account created successfully!`);
}

function logoutUser() {
  if (!confirm('Are you sure you want to log out?')) return;
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

// ========== MAIN APP ==========
function showMainApp() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  ['navAvatar', 'dropdownAvatar', 'sidebarAvatar', 'postAvatar', 'storyAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = currentUser.avatar;
  });
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('sidebarName').textContent = currentUser.name;

  if (posts.length === 0) {
    posts = generateSamplePosts();
    saveToStorage();
  }
  renderPosts();
}

// ========== STORIES ==========
function renderStories() {
  const container = document.querySelector('.stories-container');
  friends.slice(0, 4).forEach(friend => {
    const story = document.createElement('div');
    story.className = 'story-card';
    story.onclick = () => toast(`📖 ${friend.name}'s story`);
    story.innerHTML = `
      <img src="https://picsum.photos/150/250?random=${Math.random()}" alt="${friend.name}">
      <div class="story-avatar"><img src="${friend.avatar}"></div>
      <p>${friend.name.split(' ')[0]}</p>
    `;
    container.appendChild(story);
  });
}

// ========== POSTS ==========
function createPost() {
  const content = document.getElementById('postInput').value.trim();
  if (!content && !uploadedImageData) return toast('⚠️ Write something or add a photo!');

  const post = {
    id: Date.now(),
    author: currentUser.name,
    avatar: currentUser.avatar,
    content: content,
    image: uploadedImageData,
    time: 'Just now',
    likes: 0,
    liked: false,
    comments: 0,
    saved: false,
    commentList: []
  };

  posts.unshift(post);
  saveToStorage();
  renderPosts();

  document.getElementById('postInput').value = '';
  removeImage();
  toast('✅ Post created successfully!');
}

function renderPosts() {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post-card';
    postEl.id = `post-${post.id}`;
    postEl.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="${post.author}" onclick="viewProfile('${post.author}')">
        <div class="post-user-info">
          <h4 onclick="viewProfile('${post.author}')">${post.author}</h4>
          <span>${post.time} · <i class="fas fa-globe-asia"></i></span>
        </div>
        <button class="post-more" onclick="togglePostMenu(event, ${post.id})">⋯</button>
      </div>
      ${post.content ? `<div class="post-content">${escapeHtml(post.content)}</div>` : ''}
      ${post.image ? `<div class="post-content"><img src="${post.image}" onclick="openImageModal('${post.image}')"></div>` : ''}
      <div class="post-stats">
        <div class="like-count">
          <span class="like-icon">👍</span> ${post.likes}
        </div>
        <div onclick="toggleComments(${post.id})" style="cursor:pointer">${post.comments} comments</div>
      </div>
      <div class="post-actions">
        <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
          <i class="fas fa-thumbs-up"></i> Like
        </button>
        <button class="post-action-btn" onclick="toggleComments(${post.id})">
          <i class="fas fa-comment"></i> Comment
        </button>
        <button class="post-action-btn ${post.saved ? 'saved' : ''}" onclick="toggleSave(${post.id})">
          <i class="fas fa-bookmark"></i> Save
        </button>
        <button class="post-action-btn" onclick="sharePost(${post.id})">
          <i class="fas fa-share"></i> Share
        </button>
      </div>
      <div class="comments-section hidden" id="comments-${post.id}">
        ${post.commentList ? post.commentList.map(c => `
          <div class="comment">
            <img src="${c.avatar}">
            <div class="comment-body">
              <strong>${c.author}</strong>
              <p>${escapeHtml(c.text)}</p>
            </div>
          </div>
        `).join('') : ''}
        <div class="comment-input">
          <img src="${currentUser?.avatar || ''}">
          <input type="text" placeholder="Write a comment..." onkeypress="handleComment(event, ${post.id})">
        </div>
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

function toggleSave(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.saved = !post.saved;
  if (post.saved) {
    savedPosts.push(post.id);
    toast('🔖 Post saved');
  } else {
    savedPosts = savedPosts.filter(pid => pid !== id);
    toast('❌ Removed from saved');
  }
  saveToStorage();
  renderPosts();
}

function toggleComments(id) {
  const el = document.getElementById(`comments-${id}`);
  el.classList.toggle('hidden');
}

function handleComment(e, id) {
  if (e.key === 'Enter') {
    const text = e.target.value.trim();
    if (!text) return;
    const post = posts.find(p => p.id === id);
    if (!post.commentList) post.commentList = [];
    post.commentList.push({
      author: currentUser.name,
      avatar: currentUser.avatar,
      text: text
    });
    post.comments++;
    saveToStorage();
    renderPosts();
    setTimeout(() => {
      const commentBox = document.getElementById(`comments-${id}`);
      if (commentBox) commentBox.classList.remove('hidden');
    }, 50);
  }
}

function sharePost(id) {
  toast('🔗 Post link copied!');
}

// ========== POST MENU ==========
function togglePostMenu(e, id) {
  e.stopPropagation();
  const existing = document.querySelector('.post-menu');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'post-menu';
  menu.onclick = (ev) => ev.stopPropagation();
  menu.innerHTML = `
    <div class="post-menu-item" onclick="toast('💾 Post saved');closeAllMenus()">
      <i class="fas fa-bookmark"></i> Save Post
    </div>
    <div class="post-menu-item" onclick="toast('🔔 Notifications on');closeAllMenus()">
      <i class="fas fa-bell"></i> Turn on Notifications
    </div>
    <div class="post-menu-item" onclick="toast('🔗 Link copied');closeAllMenus()">
      <i class="fas fa-link"></i> Copy Link
    </div>
    <div class="post-menu-item" onclick="toast('🚫 Post hidden');closeAllMenus()">
      <i class="fas fa-eye-slash"></i> Hide Post
    </div>
    <div class="post-menu-item danger" onclick="deletePost(${id})">
      <i class="fas fa-trash"></i> Delete Post
    </div>
  `;
  e.target.parentElement.appendChild(menu);
}

function deletePost(id) {
  if (!confirm('Delete this post?')) return;
  posts = posts.filter(p => p.id !== id);
  saveToStorage();
  renderPosts();
  closeAllMenus();
  toast('🗑️ Post deleted');
}

function closeAllMenus() {
  document.querySelectorAll('.post-menu').forEach(m => m.remove());
}

// ========== IMAGE ==========
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
      document.getElementById('imagePreviewBox').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
}

function openImagePicker() {
  document.getElementById('imageUpload').click();
}

function removeImage() {
  uploadedImageData = null;
  document.getElementById('imagePreviewBox').classList.add('hidden');
  document.getElementById('imageUpload').value = '';
}

function openImageModal(src) {
  document.getElementById('modalImage').src = src;
  document.getElementById('imageModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('imageModal').classList.add('hidden');
}

// ========== DROPDOWNS ==========
function toggleProfileMenu(e) {
  e.stopPropagation();
  document.getElementById('profileDropdown').classList.toggle('hidden');
  document.getElementById('notificationDropdown').classList.add('hidden');
}

function toggleNotification(e) {
  e.stopPropagation();
  document.getElementById('notificationDropdown').classList.toggle('hidden');
  document.getElementById('profileDropdown').classList.add('hidden');
}

function setupOutsideClick() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-menu') && !e.target.closest('.profile-dropdown')) {
      document.getElementById('profileDropdown').classList.add('hidden');
    }
    if (!e.target.closest('.nav-icon') && !e.target.closest('.notification-dropdown')) {
      document.getElementById('notificationDropdown').classList.add('hidden');
    }
    if (!e.target.closest('.post-more')) {
      closeAllMenus();
    }
  });
}

// ========== PROFILE ==========
function showProfile() {
  document.getElementById('profileDropdown').classList.add('hidden');
  document.getElementById('profileAvatar').src = currentUser.avatar;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
}

function viewProfile(name) {
  toast(`👤 ${name}'s profile`);
}

function showSaved() {
  const saved = posts.filter(p => p.saved);
  if (saved.length === 0) return toast('📭 No saved posts');
  toast(`🔖 You have ${saved.length} saved post(s)`);
}

// ========== DARK MODE ==========
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('sb_dark', darkMode);
  toast(darkMode ? '🌙 Dark mode on' : '☀️ Light mode on');
}

// ========== TAB SWITCH ==========
function switchTab(btn, tab) {
  document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ========== SEARCH ==========
function setupSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      toast(`🔍 Searching for "${input.value}"...`);
      input.value = '';
    }
  });
}

// ========== TOAST ==========
function toast(msg) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

// ========== HELPERS ==========
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createStory() {
  toast('📸 Create a new story!');
}

// ========== STORAGE ==========
function saveToStorage() {
  localStorage.setItem('sb_posts', JSON.stringify(posts));
  localStorage.setItem('sb_saved', JSON.stringify(savedPosts));
}

function loadFromStorage() {
  currentUser = JSON.parse(localStorage.getItem('sb_user'));
  posts = JSON.parse(localStorage.getItem('sb_posts')) || [];
  savedPosts = JSON.parse(localStorage.getItem('sb_saved')) || [];
  darkMode = localStorage.getItem('sb_dark') === 'true';
  if (darkMode) document.body.classList.add('dark-mode');
}

// ========== SAMPLE POSTS ==========
function generateSamplePosts() {
  return [
    {
      id: 1,
      author: 'Karim Hossain',
      avatar: 'https://i.pravatar.cc/150?img=7',
      content: 'The beauty of Chattogram sea beach! 🌊🏖️',
      image: 'https://picsum.photos/600/400?random=20',
      time: '1 day ago',
      likes: 156,
      liked: false,
      comments: 24,
      saved: false,
      commentList: [
        { author: 'Rahul Ahmed', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Amazing shot! 😍' },
        { author: 'Sadia Khan', avatar: 'https://i.pravatar.cc/40?img=6', text: 'When did you go?' }
      ]
    },
    {
      id: 2,
      author: 'Nila Rahman',
      avatar: 'https://i.pravatar.cc/150?img=9',
      content: "It's my birthday today! 🎂🎉 Wish me well everyone.",
      image: null,
      time: '2 days ago',
      likes: 88,
      liked: true,
      comments: 45,
      saved: false,
      commentList: [
        { author: 'Karim Hossain', avatar: 'https://i.pravatar.cc/40?img=7', text: 'Happy birthday! 🎉' }
      ]
    },
    {
      id: 3,
      author: 'Rahul Ahmed',
      avatar: 'https://i.pravatar.cc/150?img=5',
      content: 'This morning was amazing! ☀️🌅 Good morning everyone.',
      image: 'https://picsum.photos/600/400?random=21',
      time: '2 hours ago',
      likes: 24,
      liked: false,
      comments: 5,
      saved: false,
      commentList: []
    },
    {
      id: 4,
      author: 'Sadia Khan',
      avatar: 'https://i.pravatar.cc/150?img=6',
      content: 'Started a new project! Learning JavaScript. Anyone can help? 💻✨',
      image: null,
      time: '5 hours ago',
      likes: 42,
      liked: true,
      comments: 12,
      saved: true,
      commentList: []
    }
  ];
}

// ========== KEYBOARD ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeProfileModal();
    closeAllMenus();
  }
  if (e.ctrlKey && e.key === 'Enter' && currentUser) {
    createPost();
  }
});
