// ========== STATE ==========
let currentUser = null;
let posts = [];
let uploadedImageData = null;
let savedPosts = [];
let darkMode = false;
let pendingAvatar = null;
let pendingCover = null;
let pendingEditAvatar = null;

// ========== DEFAULT AVATAR (SVG placeholder - no auto image) ==========
const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect fill='%23ddd' width='40' height='40'/><circle cx='20' cy='15' r='7' fill='%23999'/><path d='M6 40c0-8 6-14 14-14s14 6 14 14z' fill='%23999'/></svg>";

const DEFAULT_COVER = "https://picsum.photos/1200/400?random=100";

// ========== SAMPLE FRIENDS ==========
const friends = [
  { name: 'Rahul Ahmed', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Sadia Khan', avatar: 'https://i.pravatar.cc/150?img=6' },
  { name: 'Karim Hossain', avatar: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Nila Rahman', avatar: 'https://i.pravatar.cc/150?img=9' }
];

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  populateDateDropdowns();
  setupImageUploads();
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

  if (!email || !password) return toast('Please enter email and password!');

  const storedUser = JSON.parse(localStorage.getItem('sb_user'));
  if (storedUser && storedUser.email === email) {
    currentUser = storedUser;
  } else {
    // New user - NO auto avatar, use placeholder
    currentUser = {
      name: email.split('@')[0] || 'User',
      email: email,
      avatar: null,
      cover: null,
      bio: '',
      location: '',
      occupation: ''
    };
  }

  localStorage.setItem('sb_user', JSON.stringify(currentUser));
  showMainApp();
  toast(`Welcome, ${currentUser.name}!`);
}

function signupUser() {
  const firstName = document.getElementById('signupFirstName').value.trim();
  const lastName = document.getElementById('signupLastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const genderEl = document.querySelector('input[name="gender"]:checked');

  if (!firstName || !email || !password) return toast('Please fill all required fields!');
  if (password.length < 6) return toast('Password must be at least 6 characters!');

  // NO auto avatar - user will add their own
  currentUser = {
    name: firstName + ' ' + lastName,
    email: email,
    gender: genderEl ? genderEl.value : 'other',
    avatar: null,
    cover: null,
    bio: '',
    location: '',
    occupation: ''
  };

  localStorage.setItem('sb_user', JSON.stringify(currentUser));
  showMainApp();
  toast('Account created! Please upload your profile picture.');
}

function logoutUser() {
  if (!confirm('Are you sure you want to log out?')) return;
  currentUser = null;
  localStorage.removeItem('sb_user');
  hideAllPages();
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

// ========== PAGE NAVIGATION ==========
function hideAllPages() {
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  document.getElementById('settingsPage').classList.add('hidden');
}

function goHome() {
  hideAllPages();
  document.getElementById('mainApp').classList.remove('hidden');
  document.getElementById('profileDropdown').classList.add('hidden');
}

function openProfilePage() {
  hideAllPages();
  document.getElementById('profilePage').classList.remove('hidden');
  document.getElementById('profileDropdown').classList.add('hidden');
  renderProfilePage();
}

function openSettings() {
  hideAllPages();
  document.getElementById('settingsPage').classList.remove('hidden');
  document.getElementById('profileDropdown').classList.add('hidden');
  loadSettingsValues();
}

function openHelp() {
  openSettings();
  setTimeout(() => {
    const helpItem = document.querySelector('.settings-menu-item:last-child');
    switchSettingsTab(helpItem, 'help');
  }, 100);
}

// ========== MAIN APP ==========
function showMainApp() {
  hideAllPages();
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  updateAllAvatars();
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('sidebarName').textContent = currentUser.name;

  if (posts.length === 0) {
    posts = generateSamplePosts();
    saveToStorage();
  }
  renderPosts();
}

function updateAllAvatars() {
  const avatarSrc = currentUser.avatar || DEFAULT_AVATAR;
  ['navAvatar', 'dropdownAvatar', 'sidebarAvatar', 'postAvatar', 'storyAvatar', 'navAvatar2', 'navAvatar3', 'profilePageAvatar', 'profilePostAvatar', 'editAvatarPreview'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = avatarSrc;
  });
}

// ========== STORIES ==========
function renderStories() {
  const container = document.getElementById('storiesContainer');
  // Remove old stories (keep create-story)
  const createStory = container.querySelector('.create-story');
  container.innerHTML = '';
  container.appendChild(createStory);

  friends.forEach(friend => {
    const story = document.createElement('div');
    story.className = 'story-card';
    story.onclick = () => toast(`Viewing ${friend.name}'s story`);
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
  if (!content && !uploadedImageData) return toast('Write something or add a photo!');

  const post = {
    id: Date.now(),
    author: currentUser.name,
    authorEmail: currentUser.email,
    avatar: currentUser.avatar || DEFAULT_AVATAR,
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
  toast('Post created successfully!');
}

function createProfilePost() {
  const content = document.getElementById('profilePostInput').value.trim();
  if (!content) return toast('Write something!');

  const post = {
    id: Date.now(),
    author: currentUser.name,
    authorEmail: currentUser.email,
    avatar: currentUser.avatar || DEFAULT_AVATAR,
    content: content,
    image: null,
    time: 'Just now',
    likes: 0,
    liked: false,
    comments: 0,
    saved: false,
    commentList: []
  };

  posts.unshift(post);
  saveToStorage();
  renderProfilePage();
  document.getElementById('profilePostInput').value = '';
  toast('Post created!');
}

function renderPosts() {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  posts.forEach(post => {
    container.appendChild(createPostElement(post));
  });
}

function renderProfilePosts() {
  const container = document.getElementById('profilePostsContainer');
  container.innerHTML = '';
  
  const userPosts = posts.filter(p => p.authorEmail === currentUser.email || p.author === currentUser.name);
  
  if (userPosts.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-sec);">No posts yet. Create your first post!</div>';
    return;
  }
  
  userPosts.forEach(post => {
    container.appendChild(createPostElement(post));
  });
}

function createPostElement(post) {
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
        <img src="${currentUser?.avatar || DEFAULT_AVATAR}">
        <input type="text" placeholder="Write a comment..." onkeypress="handleComment(event, ${post.id})">
      </div>
    </div>
  `;
  return postEl;
}

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveToStorage();
  refreshCurrentView();
}

function toggleSave(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.saved = !post.saved;
  if (post.saved) {
    if (!savedPosts.includes(id)) savedPosts.push(id);
    toast('Post saved');
  } else {
    savedPosts = savedPosts.filter(pid => pid !== id);
    toast('Removed from saved');
  }
  saveToStorage();
  refreshCurrentView();
}

function refreshCurrentView() {
  if (!document.getElementById('mainApp').classList.contains('hidden')) {
    renderPosts();
  }
  if (!document.getElementById('profilePage').classList.contains('hidden')) {
    renderProfilePosts();
  }
}

function toggleComments(id) {
  const el = document.getElementById(`comments-${id}`);
  if (el) el.classList.toggle('hidden');
}

function handleComment(e, id) {
  if (e.key === 'Enter') {
    const text = e.target.value.trim();
    if (!text) return;
    const post = posts.find(p => p.id === id);
    if (!post.commentList) post.commentList = [];
    post.commentList.push({
      author: currentUser.name,
      avatar: currentUser.avatar || DEFAULT_AVATAR,
      text: text
    });
    post.comments++;
    saveToStorage();
    refreshCurrentView();
    setTimeout(() => {
      const commentBox = document.getElementById(`comments-${id}`);
      if (commentBox) {
        commentBox.classList.remove('hidden');
        const input = commentBox.querySelector('input');
        if (input) input.focus();
      }
    }, 50);
  }
}

function sharePost(id) {
  toast('Post link copied to clipboard!');
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
    <div class="post-menu-item" onclick="toggleSave(${id});closeAllMenus()">
      <i class="fas fa-bookmark"></i> Save Post
    </div>
    <div class="post-menu-item" onclick="toast('Notifications enabled');closeAllMenus()">
      <i class="fas fa-bell"></i> Turn on Notifications
    </div>
    <div class="post-menu-item" onclick="toast('Link copied');closeAllMenus()">
      <i class="fas fa-link"></i> Copy Link
    </div>
    <div class="post-menu-item" onclick="toast('Post hidden');closeAllMenus()">
      <i class="fas fa-eye-slash"></i> Hide Post
    </div>
    <div class="post-menu-item danger" onclick="deletePost(${id})">
      <i class="fas fa-trash"></i> Delete Post
    </div>
  `;
  e.target.parentElement.appendChild(menu);
}

function deletePost(id) {
  if (!confirm('Delete this post permanently?')) return;
  posts = posts.filter(p => p.id !== id);
  saveToStorage();
  refreshCurrentView();
  closeAllMenus();
  toast('Post deleted');
}

function closeAllMenus() {
  document.querySelectorAll('.post-menu').forEach(m => m.remove());
}

// ========== IMAGE UPLOADS ==========
function setupImageUploads() {
  // Post image
  document.getElementById('imageUpload').addEventListener('change', (e) => {
    readImage(e.target.files[0], (result) => {
      uploadedImageData = result;
      document.getElementById('imagePreview').src = result;
      document.getElementById('imagePreviewBox').classList.remove('hidden');
    });
  });

  // Cover photo
  document.getElementById('coverUpload').addEventListener('change', (e) => {
    readImage(e.target.files[0], (result) => {
      pendingCover = result;
      currentUser.cover = result;
      saveUser();
      document.getElementById('coverPhotoImg').src = result;
      toast('Cover photo updated!');
    });
  });

  // Avatar (profile page)
  document.getElementById('avatarUpload').addEventListener('change', (e) => {
    readImage(e.target.files[0], (result) => {
      currentUser.avatar = result;
      saveUser();
      updateAllAvatars();
      toast('Profile picture updated!');
    });
  });

  // Edit profile avatar
  document.getElementById('editAvatarUpload').addEventListener('change', (e) => {
    readImage(e.target.files[0], (result) => {
      pendingEditAvatar = result;
      document.getElementById('editAvatarPreview').src = result;
    });
  });
}

function readImage(file, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) return toast('Please select an image file');
  if (file.size > 5 * 1024 * 1024) return toast('Image must be less than 5MB');
  
  const reader = new FileReader();
  reader.onload = (ev) => callback(ev.target.result);
  reader.readAsDataURL(file);
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

// ========== PROFILE PAGE ==========
function renderProfilePage() {
  const avatarSrc = currentUser.avatar || DEFAULT_AVATAR;
  const coverSrc = currentUser.cover || DEFAULT_COVER;
  
  document.getElementById('profilePageAvatar').src = avatarSrc;
  document.getElementById('profilePageName').textContent = currentUser.name;
  document.getElementById('profilePageBio').textContent = currentUser.bio || 'Add a bio to tell others about yourself';
  document.getElementById('coverPhotoImg').src = coverSrc;
  document.getElementById('introBio').textContent = currentUser.bio || 'No bio yet';
  
  renderProfilePosts();
}

function switchProfileTab(btn, tab) {
  document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  toast(`Switched to ${tab} tab`);
}

function openEditProfile() {
  document.getElementById('editName').value = currentUser.name || '';
  document.getElementById('editBio').value = currentUser.bio || '';
  document.getElementById('editLocation').value = currentUser.location || '';
  document.getElementById('editOccupation').value = currentUser.occupation || '';
  document.getElementById('editAvatarPreview').src = currentUser.avatar || DEFAULT_AVATAR;
  pendingEditAvatar = null;
  document.getElementById('editProfileModal').classList.remove('hidden');
}

function closeEditProfile() {
  document.getElementById('editProfileModal').classList.add('hidden');
  pendingEditAvatar = null;
}

function saveProfileChanges() {
  const newName = document.getElementById('editName').value.trim();
  if (!newName) return toast('Name cannot be empty');
  
  currentUser.name = newName;
  currentUser.bio = document.getElementById('editBio').value.trim();
  currentUser.location = document.getElementById('editLocation').value.trim();
  currentUser.occupation = document.getElementById('editOccupation').value.trim();
  
  if (pendingEditAvatar) {
    currentUser.avatar = pendingEditAvatar;
  }
  
  saveUser();
  updateAllAvatars();
  renderProfilePage();
  closeEditProfile();
  toast('Profile updated successfully!');
}

function viewProfile(name) {
  toast(`Viewing ${name}'s profile`);
}

function showSaved() {
  const saved = posts.filter(p => p.saved);
  if (saved.length === 0) return toast('No saved posts yet');
  toast(`You have ${saved.length} saved post(s)`);
}

// ========== DARK MODE ==========
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('sb_dark', darkMode);
  toast(darkMode ? 'Dark mode enabled' : 'Light mode enabled');
  document.getElementById('profileDropdown').classList.add('hidden');
}

// ========== TAB SWITCH ==========
function switchTab(btn, tab) {
  document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (tab !== 'home') toast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} page coming soon`);
}

// ========== SETTINGS ==========
function switchSettingsTab(btn, tab) {
  document.querySelectorAll('.settings-menu-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById(`panel-${tab}`);
  if (panel) panel.classList.remove('hidden');
}

function loadSettingsValues() {
  document.getElementById('settingName').value = currentUser.name || '';
  document.getElementById('settingEmail').value = currentUser.email || '';
  document.getElementById('settingBio').value = currentUser.bio || '';
  document.getElementById('settingLocation').value = currentUser.location || '';
  
  // Update theme selection
  document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('active'));
  if (darkMode) document.getElementById('themeDark').classList.add('active');
  else document.getElementById('themeLight').classList.add('active');
}

function saveGeneralSettings() {
  const newName = document.getElementById('settingName').value.trim();
  if (!newName) return toast('Name cannot be empty');
  
  currentUser.name = newName;
  currentUser.bio = document.getElementById('settingBio').value.trim();
  currentUser.location = document.getElementById('settingLocation').value.trim();
  
  saveUser();
  updateAllAvatars();
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('sidebarName').textContent = currentUser.name;
  toast('Settings saved successfully!');
}

function changePassword() {
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;
  
  if (!newPass || !confirmPass) return toast('Please fill all password fields');
  if (newPass !== confirmPass) return toast('Passwords do not match!');
  if (newPass.length < 6) return toast('Password must be at least 6 characters');
  
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  toast('Password changed successfully!');
}

function savePrivacySettings() {
  toast('Privacy settings saved!');
}

function setTheme(theme) {
  document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('active'));
  
  if (theme === 'light') {
    darkMode = false;
    document.body.classList.remove('dark-mode');
    document.getElementById('themeLight').classList.add('active');
    toast('Light theme applied');
  } else if (theme === 'dark') {
    darkMode = true;
    document.body.classList.add('dark-mode');
    document.getElementById('themeDark').classList.add('active');
    toast('Dark theme applied');
  } else if (theme === 'auto') {
    document.getElementById('themeAuto').classList.add('active');
    toast('Auto theme enabled');
  }
  
  localStorage.setItem('sb_dark', darkMode);
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
  toast('Story creation coming soon!');
}

function saveUser() {
  localStorage.setItem('sb_user', JSON.stringify(currentUser));
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

// ========== SAMPLE POSTS (English) ==========
function generateSamplePosts() {
  return [
    {
      id: 1,
      author: 'Karim Hossain',
      authorEmail: 'karim@sample.com',
      avatar: 'https://i.pravatar.cc/150?img=7',
      content: 'The beauty of the sea beach at sunset! 🌊🏖️',
      image: 'https://picsum.photos/600/400?random=20',
      time: '1 day ago',
      likes: 156,
      liked: false,
      comments: 24,
      saved: false,
      commentList: [
        { author: 'Rahul Ahmed', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Amazing shot! 😍' },
        { author: 'Sadia Khan', avatar: 'https://i.pravatar.cc/40?img=6', text: 'When did you visit?' }
      ]
    },
    {
      id: 2,
      author: 'Nila Rahman',
      authorEmail: 'nila@sample.com',
      avatar: 'https://i.pravatar.cc/150?img=9',
      content: "It's my birthday today! 🎂🎉 Thank you everyone for the wishes.",
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
      authorEmail: 'rahul@sample.com',
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
      authorEmail: 'sadia@sample.com',
      avatar: 'https://i.pravatar.cc/150?img=6',
      content: 'Starting a new project! Learning JavaScript. Anyone want to help? 💻✨',
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
    closeEditProfile();
    closeAllMenus();
  }
  if (e.ctrlKey && e.key === 'Enter' && currentUser) {
    if (!document.getElementById('mainApp').classList.contains('hidden')) {
      createPost();
    }
  }
});  
