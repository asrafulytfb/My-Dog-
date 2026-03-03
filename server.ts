import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { GoogleGenAI } from '@google/genai';

const db = new Database('tlsf.db');
const JWT_SECRET = 'tlsf-secret-key-2026';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Ensure role column exists (in case table was created earlier without it)
try {
  db.exec('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
} catch (e) {
  // Column already exists, ignore error
}

db.exec(`
  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    method TEXT,
    campaign_id INTEGER,
    donor_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT,
    title_bn TEXT,
    description_en TEXT,
    description_bn TEXT,
    goal REAL,
    raised REAL DEFAULT 0,
    image TEXT,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    skills TEXT,
    availability TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Admin and Campaigns
const oldAdminEmail = 'admin@tlsf.org';
const newAdminEmail = 'amarlovetips@gmail.com';
const newAdminPass = '33543331aA$';

// Remove old admin if exists
db.prepare('DELETE FROM users WHERE email = ?').run(oldAdminEmail);

const admin = db.prepare('SELECT * FROM users WHERE email = ?').get(newAdminEmail);
if (!admin) {
  const hashed = bcrypt.hashSync(newAdminPass, 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Super Admin', newAdminEmail, hashed, 'admin');
} else {
  // Ensure existing admin has the correct role
  db.prepare('UPDATE users SET role = "admin" WHERE email = ?').run(newAdminEmail);
}

const campaignCount = db.prepare('SELECT COUNT(*) as count FROM campaigns').get().count;
if (campaignCount === 0) {
  db.prepare('INSERT INTO campaigns (title_en, title_bn, description_en, description_bn, goal, raised, image) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    'Winter Clothes Distribution', 'শীতবস্ত্র বিতরণ', 'Providing warmth to those in need.', 'অসহায়দের উষ্ণতা প্রদান।', 50000, 12500, 'https://picsum.photos/seed/winter/800/400'
  );
  db.prepare('INSERT INTO campaigns (title_en, title_bn, description_en, description_bn, goal, raised, image) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    'Flood Relief 2026', 'বন্যা ত্রাণ ২০২৬', 'Emergency aid for flood victims.', 'বন্যা কবলিতদের জন্য জরুরি সহায়তা।', 100000, 45000, 'https://picsum.photos/seed/flood/800/400'
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    console.log('Authenticating token:', token ? 'Token exists' : 'No token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      console.log('Authenticated user:', req.user.email, 'Role:', req.user.role);
      next();
    } catch (e) {
      console.error('Token verification failed:', e);
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // API Routes
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashed = bcrypt.hashSync(password, 10);
      db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashed);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none',
      path: '/'
    }).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none',
      path: '/'
    }).json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (e) {
      res.json({ user: null });
    }
  });

  app.get('/api/campaigns', (req, res) => {
    const campaigns = db.prepare('SELECT * FROM campaigns WHERE active = 1').all();
    res.json(campaigns);
  });

  app.post('/api/donate', (req, res) => {
    const { amount, method, campaign_id, donor_name, user_id } = req.body;
    db.prepare('INSERT INTO donations (user_id, amount, method, campaign_id, donor_name) VALUES (?, ?, ?, ?, ?)').run(user_id || null, amount, method, campaign_id, donor_name);
    db.prepare('UPDATE campaigns SET raised = raised + ? WHERE id = ?').run(amount, campaign_id);
    res.json({ success: true });
  });

  app.get('/api/donations/recent', (req, res) => {
    const donations = db.prepare('SELECT * FROM donations ORDER BY created_at DESC LIMIT 10').all();
    res.json(donations);
  });

  app.post('/api/volunteers', (req, res) => {
    const { name, email, skills, availability, location } = req.body;
    db.prepare('INSERT INTO volunteers (name, email, skills, availability, location) VALUES (?, ?, ?, ?, ?)').run(name, email, skills, availability, location);
    res.json({ success: true });
  });

  app.get('/api/stats', authenticate, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const totalFunds = db.prepare('SELECT SUM(amount) as total FROM donations').get().total || 0;
    const totalVolunteers = db.prepare('SELECT COUNT(*) as count FROM volunteers').get().count;
    const totalDonors = db.prepare('SELECT COUNT(DISTINCT donor_name) as count FROM donations').get().count;
    const campaignStats = db.prepare('SELECT title_en as name, raised, goal FROM campaigns').all();
    res.json({ totalFunds, totalVolunteers, totalDonors, campaignStats });
  });

  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction: 'You are an AI assistant for TLSF (The Life Saving Foundation), an NGO. You help visitors understand our mission, campaigns, and how to donate. Be helpful, empathetic, and professional. TLSF works on education, healthcare, and disaster relief.'
        }
      });
      res.json({ text: response.text });
    } catch (e) {
      res.status(500).json({ error: 'AI Error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
