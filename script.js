// ======================
// ZEDMEMES - Backend Connected Version
// ======================

let currentUser = null;
let memes = [];
let isDarkMode = false;

// API endpoints
const API = {
    signup: 'signup.php',
    login: 'login.php',
    fetchMemes: 'fetch_memes.php',
    uploadMeme: 'upload_meme.php',
    reactMeme: 'react_meme.php'
};

// ======================
// Initialize
// ======================
document.addEventListener('DOMContentLoaded', () => {
    loadDarkMode();
    setupEventListeners();
    updateAuthUI();
    fetchMemesFromDB(); // Fetch memes on page load
});

// ======================
// Event Listeners
// ======================
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        login();
    });

    // Signup form
    document.getElementById('signupForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        signUp();
    });

    // Upload form
    document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadMeme();
    });

    // File input preview
    document.getElementById('memeFile')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        document.getElementById('fileName').value = file ? file.name : 'No file chosen';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModals();
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            currentUser ? toggleModal('uploadModal') : showToast('Please login first', 'error');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleDarkMode();
        }
    });
}

// ======================
// Dark Mode
// ======================
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    updateAuthUI();
    showToast(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`);
}

function loadDarkMode() {
    isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) document.body.classList.add('dark-mode');
}

// ======================
// Modal Functions
// ======================
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('active');
    if (!modal.classList.contains('active')) {
        modal.querySelector('form')?.reset();
    }
}

function closeModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
    });
}

// ======================
// AUTH: SIGNUP & LOGIN
// ======================
function signUp() {
    const username = $('#signupUsername').val().trim();
    const email = $('#signupEmail').val().trim();
    const password = $('#signupPassword').val().trim();
    const confirmPassword = $('#signupConfirmPassword').val().trim();

    if (!username || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    $.ajax({
        url: 'http://localhost/CS361%20php/signup.php', // ✅ use correct path
        type: 'POST',
        dataType: 'json',
        data: {
            username: username,
            email: email,
            password: password
        },
        success: function(response) {
            console.log('Signup Response:', response);
            if (response.status === 'success') {
                showToast(response.message, 'success');
                toggleModal('signupModal');
            } else {
                showToast(response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error, xhr.responseText);
            showToast('Signup failed! Check console.', 'error');
        }
    });
}



function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    $.post(API.login, { username, password }, function (response) {
        if (response.status === "success") {
            currentUser = response.user; // Save logged-in user
            updateAuthUI();
            toggleModal('loginModal');
            showToast(`Welcome ${currentUser.username}!`, 'success');
        } else {
            showToast(response.message, 'error');
        }
    }, "json");
}

function logout() {
    currentUser = null;
    updateAuthUI();
    showToast('Logged out', 'info');
}

// ======================
// AUTH UI UPDATE
// ======================
function updateAuthUI() {
    const authSection = document.querySelector('.auth-section');
    const themeIcon = isDarkMode ? 'sun' : 'moon';

    if (currentUser) {
        authSection.innerHTML = `
            <div class="ui simple dropdown">
                <div class="text"><i class="user icon"></i>${currentUser.username}</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" onclick="showToast('Profile feature coming soon!')">Profile</div>
                    <div class="item" onclick="logout()">Logout</div>
                </div>
            </div>
            <button class="theme-toggle" onclick="toggleDarkMode()">
                <i class="${themeIcon} icon"></i>
            </button>
        `;
        $('.ui.dropdown').dropdown();
    } else {
        authSection.innerHTML = `
            <button class="ui primary button" onclick="toggleModal('loginModal')">Login</button>
            <button class="ui secondary button" onclick="toggleModal('signupModal')">Sign Up</button>
            <button class="theme-toggle" onclick="toggleDarkMode()">
                <i class="${themeIcon} icon"></i>
            </button>
        `;
    }
}

// ======================
// FETCH MEMES FROM DB
// ======================
function fetchMemesFromDB() {
    $.getJSON(API.fetchMemes, function (response) {
        if (response.status === "success") {
            memes = response.memes;
            renderMemes(memes);
        } else {
            showToast("Failed to load memes", "error");
        }
    });
}

function renderMemes(memesList) {
    const memeGrid = document.querySelector('.meme-grid');
    const uploadCard = document.querySelector('.upload-card');

    // Remove existing memes except upload card
    document.querySelectorAll('.meme-card').forEach(card => {
        if (!card.classList.contains('upload-card')) card.remove();
    });

    memesList.forEach(meme => {
        const memeCard = document.createElement('div');
        memeCard.className = 'meme-card fade-in';
        memeCard.setAttribute('data-meme-id', meme.id);

        memeCard.innerHTML = `
            <div class="meme-image">
                <img src="${meme.image_path}" alt="${meme.caption}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="meme-actions">
                <button class="reaction-btn like" data-reaction="like">
                    <i class="fas fa-heart"></i>
                    <span class="count">${meme.likes}</span>
                </button>
                <button class="reaction-btn upvote" data-reaction="upvote">
                    <i class="fas fa-arrow-up"></i>
                    <span class="count">${meme.upvotes}</span>
                </button>
                <button class="reaction-btn share" data-reaction="share">
                    <i class="fas fa-share"></i>
                </button>
                <button class="reaction-btn download" data-reaction="download">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        memeGrid.insertBefore(memeCard, uploadCard);

        // Add reaction handlers
        memeCard.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const memeId = memeCard.getAttribute('data-meme-id');
                const reactionType = this.getAttribute('data-reaction');

                if (reactionType === 'share') {
                    shareMeme(memeId);
                } else if (reactionType === 'download') {
                    downloadMeme(memeId);
                } else {
                    handleReaction(memeId, reactionType, this);
                }
            });
        });
    });
}

// ======================
// UPLOAD MEME (Updated)
// ======================
function uploadMeme() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }

    const fileInput = document.getElementById('memeFile');
    const caption = document.getElementById('memeCaption').value;

    if (!fileInput.files || !fileInput.files[0]) {
        showToast('Please select a file', 'error');
        return;
    }

    let formData = new FormData();
    formData.append('memeFile', fileInput.files[0]);
    formData.append('caption', caption);
    formData.append('user_id', currentUser.id);

    $.ajax({
        url: API.uploadMeme,
        type: "POST",
        data: formData,
        processData: false,  // Important for file uploads
        contentType: false,  // Important for file uploads
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                showToast("Meme uploaded!", "success");
                toggleModal('uploadModal');
                fetchMemesFromDB(); // Refresh memes
            } else {
                showToast(response.message || "Upload failed", "error");
            }
        },
        error: function(xhr, status, error) {
            console.error("Upload error:", error);
            showToast("Upload failed. Please try again.", "error");
        }
    });
}
// ======================
// REACTIONS (LIKE / UPVOTE)
// ======================
function handleReaction(memeId, reactionType, button) {
    if (!currentUser) {
        showToast('Please login to react to memes', 'error');
        return;
    }

    $.post(API.reactMeme, { meme_id: memeId, user_id: currentUser.id, reaction_type: reactionType }, function (response) {
        if (response.status === "added") {
            const countElement = button.querySelector('.count');
            countElement.textContent = parseInt(countElement.textContent) + 1;
            button.classList.add('active');
            showToast('Reaction added!', 'success');
        } else if (response.status === "removed") {
            const countElement = button.querySelector('.count');
            countElement.textContent = parseInt(countElement.textContent) - 1;
            button.classList.remove('active');
            showToast('Reaction removed', 'info');
        }
    }, "json");
}

// ======================
// SHARE & DOWNLOAD
// ======================
function shareMeme(memeId) {
    const memeUrl = `https://yourdomain.com/meme/${memeId}`;
    if (navigator.share) {
        navigator.share({ title: 'Check out this meme!', url: memeUrl })
            .catch(() => copyToClipboard(memeUrl));
    } else {
        copyToClipboard(memeUrl);
    }
}

function downloadMeme(memeId) {
    const meme = memes.find(m => m.id == memeId);
    if (!meme) return;

    const a = document.createElement('a');
    a.href = meme.image_path;
    a.download = `zedmeme-${memeId}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('Meme downloaded!', 'success');
}

// ======================
// COPY TO CLIPBOARD
// ======================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Link copied to clipboard!', 'success');
    });
}

// ======================
// TOAST NOTIFICATIONS
// ======================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="${getToastIcon(type)} icon"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${getToastColor(type)};
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = '1'), 100);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'check circle',
        error: 'times circle',
        warning: 'exclamation triangle',
        info: 'info circle'
    };
    return icons[type] || 'check circle';
}

function getToastColor(type) {
    const colors = {
        success: 'rgba(33, 186, 69, 0.9)',
        error: 'rgba(219, 40, 40, 0.9)',
        warning: 'rgba(242, 113, 28, 0.9)',
        info: 'rgba(33, 133, 208, 0.9)'
    };
    return colors[type] || 'rgba(33, 186, 69, 0.9)';
}

// ======================
// EXPORT GLOBAL FUNCTIONS
// ======================
window.toggleDarkMode = toggleDarkMode;
window.toggleModal = toggleModal;
window.login = login;
window.signUp = signUp;
window.logout = logout;
window.uploadMeme = uploadMeme;
