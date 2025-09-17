// JavaScript for Form Toggle
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

const loginFormBox = document.getElementById('login-form-box');
const signupFormBox = document.getElementById('signup-form-box');

// Show Signup Form
showSignupBtn.addEventListener('click', () => {
    loginFormBox.style.display = 'none';
    signupFormBox.style.display = 'block';
});

// Show Login Form
showLoginBtn.addEventListener('click', () => {
    signupFormBox.style.display = 'none';
    loginFormBox.style.display = 'block';
});
