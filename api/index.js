import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Data storage path
const dataPath = '/tmp/syed-hosting-data';
const usersFile = path.join(dataPath, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
  const defaultUsers = {
    admin: {
      password: 'asd@codex',
      role: 'admin'
    }
  };
  fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2));
}

// Helper functions
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch {
    return { admin: { password: 'asd@codex', role: 'admin' } };
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Session storage (in-memory for Vercel)
const sessions = new Map();

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SYED ABDUL WAHAB HOSTING</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body class="bg-[#0a0c14] text-white">
      <nav class="bg-[#12141c] border-b border-blue-500/30 p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="text-2xl font-bold">
            <span class="text-white">SYED</span>
            <span class="text-blue-400"> ABDUL WAHAB</span>
            <span class="text-white"> HOSTING</span>
          </div>
          <a href="/login" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
            <i class="fas fa-sign-in-alt mr-2"></i>Login
          </a>
        </div>
      </nav>

      <div class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-2xl text-center">
          <div class="mb-8">
            <i class="fas fa-cloud text-6xl text-blue-400 mb-4"></i>
            <h1 class="text-5xl font-bold mb-4">
              Host Your <span class="text-blue-400">Python Bots</span>
            </h1>
            <p class="text-xl text-gray-400 mb-8">
              Free hosting platform for Python bots. 24/7 uptime, instant setup!
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
              <i class="fas fa-server text-3xl text-blue-400 mb-4"></i>
              <h3 class="font-bold mb-2">500+ Active Servers</h3>
              <p class="text-gray-400 text-sm">Hosting thousands of bots</p>
            </div>
            <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
              <i class="fas fa-clock text-3xl text-blue-400 mb-4"></i>
              <h3 class="font-bold mb-2">24/7 Uptime</h3>
              <p class="text-gray-400 text-sm">Always online, always running</p>
            </div>
            <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
              <i class="fas fa-free-code-camp text-3xl text-blue-400 mb-4"></i>
              <h3 class="font-bold mb-2">Free Forever</h3>
              <p class="text-gray-400 text-sm">No hidden charges</p>
            </div>
          </div>

          <div class="flex gap-4 justify-center">
            <a href="/login" class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition">
              Get Started
            </a>
            <a href="#features" class="border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-3 rounded-lg font-bold transition">
              Learn More
            </a>
          </div>

          <div class="mt-12 text-gray-500 text-sm">
            <p>Developer: <a href="https://t.me/Syedabdulwahab" class="text-blue-400 hover:underline">@Syedabdulwahab</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login | SYED ABDUL WAHAB HOSTING</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body class="bg-[#0a0c12] min-h-screen flex items-center justify-center p-4">
      <div class="bg-[#12141c] rounded-2xl p-8 w-full max-w-md border border-blue-500/30 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-cloud-upload-alt text-4xl text-white"></i>
          </div>
          <h1 class="text-3xl font-bold text-white">SYED <span class="text-blue-400">HOSTING</span></h1>
          <p class="text-gray-400 text-sm mt-1">Premium Hosting Solution</p>
        </div>

        <form method="POST" action="/api/login">
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-2">Username</label>
            <input type="text" name="username" required 
              class="w-full bg-[#0c0e14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition">
          </div>
          <div class="mb-6">
            <label class="block text-gray-400 text-sm mb-2">Password</label>
            <input type="password" name="password" required
              class="w-full bg-[#0c0e14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition">
          </div>
          <button type="submit" 
            class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105">
            <i class="fas fa-sign-in-alt mr-2"></i> Login
          </button>
        </form>

        <div class="text-center mt-6">
          <p class="text-gray-600 text-xs">
            <i class="fas fa-shield-alt"></i> Secure Access Only
          </p>
          <p class="text-gray-500 text-xs mt-2">
            Demo: admin / asd@codex
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users[username] && users[username].password === password) {
    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, { username, role: users[username].role });
    
    res.cookie('session', sessionId, { 
      httpOnly: true, 
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });
    
    res.redirect('/admin');
  } else {
    res.status(401).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-[#0a0c12] text-white flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-red-400 mb-4">❌ Invalid credentials</p>
          <a href="/login" class="text-blue-400 hover:underline">Back to Login</a>
        </div>
      </body>
      </html>
    `);
  }
});

app.get('/admin', (req, res) => {
  const sessionId = req.cookies?.session;
  const session = sessions.get(sessionId);

  if (!session || session.role !== 'admin') {
    return res.redirect('/login');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Panel | SYED ABDUL WAHAB HOSTING</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body class="bg-[#0a0c14] text-white">
      <nav class="bg-[#12141c] border-b border-blue-500/30 p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">
            <span class="text-blue-400">⚙️ Admin Panel</span>
          </h1>
          <div class="flex gap-4">
            <button onclick="openSettings()" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <i class="fas fa-cog mr-2"></i>Settings
            </button>
            <a href="/api/logout" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition">
              <i class="fas fa-sign-out-alt mr-2"></i>Logout
            </a>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
            <i class="fas fa-server text-3xl text-blue-400 mb-4"></i>
            <h3 class="text-lg font-bold">Total Servers</h3>
            <p class="text-3xl text-blue-400 font-bold">0</p>
          </div>
          <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
            <i class="fas fa-users text-3xl text-blue-400 mb-4"></i>
            <h3 class="text-lg font-bold">Total Users</h3>
            <p class="text-3xl text-blue-400 font-bold">1</p>
          </div>
          <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
            <i class="fas fa-check-circle text-3xl text-green-400 mb-4"></i>
            <h3 class="text-lg font-bold">Status</h3>
            <p class="text-3xl text-green-400 font-bold">Online</p>
          </div>
        </div>

        <div class="bg-[#12141c] border border-blue-500/30 p-6 rounded-lg">
          <h2 class="text-xl font-bold mb-4">Welcome to Admin Panel</h2>
          <p class="text-gray-400">
            You are logged in as <strong>${session.username}</strong>. 
            Use the Settings button to manage your account.
          </p>
        </div>
      </div>

      <!-- Settings Modal -->
      <div id="settingsModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-[#12141c] border border-blue-500/30 rounded-lg p-8 w-full max-w-md">
          <h2 class="text-2xl font-bold mb-6">Settings</h2>
          <form onsubmit="updateCredentials(event)">
            <div class="mb-4">
              <label class="block text-gray-400 text-sm mb-2">New Username</label>
              <input type="text" id="newUsername" required
                class="w-full bg-[#0c0e14] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none">
            </div>
            <div class="mb-6">
              <label class="block text-gray-400 text-sm mb-2">New Password</label>
              <input type="password" id="newPassword" required
                class="w-full bg-[#0c0e14] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none">
            </div>
            <div class="flex gap-4">
              <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-bold transition">
                Save
              </button>
              <button type="button" onclick="closeSettings()" class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-bold transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <script>
        function openSettings() {
          document.getElementById('settingsModal').classList.remove('hidden');
        }
        
        function closeSettings() {
          document.getElementById('settingsModal').classList.add('hidden');
        }
        
        async function updateCredentials(e) {
          e.preventDefault();
          const username = document.getElementById('newUsername').value;
          const password = document.getElementById('newPassword').value;
          
          try {
            const response = await fetch('/api/update-credentials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
              alert('Credentials updated successfully!');
              closeSettings();
            } else {
              alert('Failed to update credentials');
            }
          } catch (err) {
            alert('Error: ' + err.message);
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/api/update-credentials', (req, res) => {
  const sessionId = req.cookies?.session;
  const session = sessions.get(sessionId);

  if (!session || session.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = loadUsers();
  users.admin = { password, role: 'admin' };
  saveUsers(users);

  res.json({ success: true });
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
export default app;
