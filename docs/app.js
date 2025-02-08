// Initialize Supabase client
const SUPABASE_URL = "https://aemsjmqvyektoadnuwbh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbXNqbXF2eWVrdG9hZG51d2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNzAzODYsImV4cCI6MjA1Mzc0NjM4Nn0.d9XiI51HAbCcAHrJbFfzmoUgSoFHYY1WVG3pyjhHE0c";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const toggleAuthBtn = document.getElementById('toggle-auth');

// State
let isLogin = false;

// Toggle between login and signup
toggleAuthBtn.addEventListener('click', () => {
  isLogin = !isLogin;
  
  // Update UI
  document.querySelector('.auth-title').textContent = isLogin ? 'Welcome Back' : 'Welcome to EmotiVault';
  document.querySelector('.auth-subtitle').textContent = isLogin 
    ? 'Sign in to continue sharing emotions'
    : 'Create your account to start sharing emotions';
  submitBtn.textContent = isLogin ? 'Sign In' : 'Sign Up';
  toggleAuthBtn.textContent = isLogin ? 'Sign Up' : 'Sign In';
  
  // Toggle username field visibility
  const usernameGroup = document.querySelector('.form-group:first-child');
  usernameGroup.style.display = isLogin ? 'none' : 'block';
  
  // Update form switch text
  document.querySelector('.form-switch').firstChild.textContent = 
    isLogin ? "Don't have an account? " : "Already have an account? ";
});

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isLogin) {
      // Handle login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      showToast('Welcome back!', 'success');
      setTimeout(() => window.location.href = 'app.html', 1500);
      
    } else {
      // Handle signup
      const username = document.getElementById('username').value;
      
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            username 
          }]);
        
        if (profileError) throw profileError;
        
        showToast('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'app.html', 1500);
      }
    }
    
  } catch (error) {
    console.error('Auth error:', error);
    showToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

// Toast notification system
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Hide toast
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Check authentication state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && window.location.pathname === '/index.html') {
    window.location.href = 'app.html';
  }
});