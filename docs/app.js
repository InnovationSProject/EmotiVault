// Initialize the Supabase client
const SUPABASE_URL = "https://aemsjmqvyektoadnuwbh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbXNqbXF2eWVrdG9hZG51d2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNzAzODYsImV4cCI6MjA1Mzc0NjM4Nn0.d9XiI51HAbCcAHrJbFfzmoUgSoFHYY1WVG3pyjhHE0c";

// Create Supabase client
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle form submission
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    });

    if (authError) throw authError;

    showToast('Registration successful!', 'Please check your email to verify your account.');
    
    // Redirect to the main app after successful registration
    setTimeout(() => {
      window.location.href = 'app.html';
    }, 2000);

  } catch (error) {
    showToast('Registration failed', error.message);
  }
});

// Toast notification system
function showToast(message, description = '') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-content">
      <p class="toast-message">${message}</p>
      ${description ? `<p class="toast-description">${description}</p>` : ''}
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Check if user is already logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      window.location.href = 'app.html';
    }
  }
});