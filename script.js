function toggleUploadModal() {
  document.getElementById("uploadModal").classList.toggle("show");
}

function toggleModal(id) {
  document.getElementById(id).classList.toggle("show");
}

document.getElementById('darkModeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('darkModeToggle').checked = true;
}

document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const submitBtn = this.querySelector('button[type="submit"]');
  const fileInput = this.querySelector('input[type="file"]');
  
  if (fileInput.files.length === 0) {
    alert('Please select a file to upload');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Uploading...';
  
  setTimeout(() => {
    alert('Meme uploaded successfully!');
    toggleUploadModal();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Upload';
    this.reset();
  }, 1500);
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const submitBtn = this.querySelector('button[type="submit"]');
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  
  setTimeout(() => {
    alert('Login successful! (This is a demo)');
    toggleModal('loginModal');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
    this.reset();
  }, 1500);
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const password = this.querySelector('input[name="password"]').value;
  const confirmPassword = this.querySelector('input[name="confirm_password"]').value;
  const submitBtn = this.querySelector('button[type="submit"]');
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing up...';
  
  setTimeout(() => {
    alert('Account created successfully!');
    toggleModal('signupModal');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Up';
    this.reset();
  }, 1500);
});

document.querySelector('.login-btn').addEventListener('click', () => toggleModal('loginModal'));
document.querySelector('.signup-btn').addEventListener('click', () => toggleModal('signupModal'));

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('show');
    }
  });
});