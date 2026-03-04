import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = 'tlsf-secret-key-2026';

async function startServer() {
  console.log('--- TLSF Server Starting ---');
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);

  // Database Initialization
  let db: Database.Database;
  try {
    db = new Database('tlsf.db');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
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
    CREATE TABLE IF NOT EXISTS recent_work (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT,
      title_bn TEXT,
      description_en TEXT,
      description_bn TEXT,
      image TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT,
      title_bn TEXT,
      content_en TEXT,
      content_bn TEXT,
      image TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Admin and Campaigns
  const adminEmail = 'amarlovetips@gmail.com';
  const admin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (!admin) {
    const hashed = bcrypt.hashSync('33543331aA$', 10);
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin', adminEmail, hashed, 'admin');
    console.log('Admin user created');
  } else {
    db.prepare("UPDATE users SET role = 'admin', name = 'Admin' WHERE email = ?").run(adminEmail);
  }

  const campaignCount = db.prepare('SELECT COUNT(*) as count FROM campaigns').get().count;
  if (campaignCount === 0) {
    db.prepare('INSERT INTO campaigns (title_en, title_bn, description_en, description_bn, goal, raised, image) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      'Winter Clothes Distribution', 'শীতবস্ত্র বিতরণ', 'Providing warmth to those in need.', 'অসহায়দের উষ্ণতা প্রদান।', 50000, 12500, 'https://picsum.photos/seed/winter/800/400'
    );
    db.prepare('INSERT INTO campaigns (title_en, title_bn, description_en, description_bn, goal, raised, image) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      'Flood Relief 2026', 'বন্যা ত্রাণ ২০২৬', 'Emergency aid for flood victims.', 'বন্যা কবলিতদের জন্য জরুরি সহায়তা।', 100000, 45000, 'https://picsum.photos/seed/flood/800/400'
    );
    console.log('Campaigns seeded');
  }

  const workCount = db.prepare('SELECT COUNT(*) as count FROM recent_work').get().count;
  if (workCount === 0) {
    db.prepare('INSERT INTO recent_work (title_en, title_bn, description_en, description_bn, image) VALUES (?, ?, ?, ?, ?)').run(
      'Medical Camp in Sylhet', 'সিলেটে মেডিকেল ক্যাম্প', 'Free healthcare services for 500+ families.', ' ৫০০+ পরিবারের জন্য বিনামূল্যে স্বাস্থ্যসেবা।', 'https://picsum.photos/seed/medical/800/400'
    );
    db.prepare('INSERT INTO recent_work (title_en, title_bn, description_en, description_bn, image) VALUES (?, ?, ?, ?, ?)').run(
      'School Supplies Distribution', 'স্কুল সামগ্রী বিতরণ', 'Empowering 200 students with education kits.', '২০০ জন শিক্ষার্থীকে শিক্ষা কিট দিয়ে সহায়তা।', 'https://picsum.photos/seed/school/800/400'
    );
  }

  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get().count;
  if (newsCount === 0) {
    db.prepare('INSERT INTO news (title_en, title_bn, content_en, content_bn, image) VALUES (?, ?, ?, ?, ?)').run(
      'TLSF Annual Gala 2026', 'টিএলএসএফ বার্ষিক গালা ২০২৬', 'Join us for our annual fundraising event.', 'আমাদের বার্ষিক তহবিল সংগ্রহ অনুষ্ঠানে যোগ দিন।', 'https://picsum.photos/seed/gala/800/400'
    );
    db.prepare('INSERT INTO news (title_en, title_bn, content_en, content_bn, image) VALUES (?, ?, ?, ?, ?)').run(
      'New Partnership with Global Health', 'গ্লোবাল হেলথের সাথে নতুন অংশীদারিত্ব', 'Expanding our medical outreach program.', 'আমাদের মেডিকেল আউটরিচ প্রোগ্রাম সম্প্রসারণ।', 'https://picsum.photos/seed/partnership/800/400'
    );
  }

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: true, credentials: true }));

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    let token = req.cookies.token;
    
    // Also check Authorization header
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    console.log('Authenticating request to:', req.url, 'Token present:', !!token);
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
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
    console.log('Login attempt for:', email);
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        console.log('Login failed: Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
      console.log('Login successful for:', email, 'Role:', user.role);
      
      const cookieOptions: any = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      };
      
      res.cookie('token', token, cookieOptions).json({ 
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
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
    let token = req.cookies.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

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

  app.get('/api/public/stats', (req, res) => {
    const totalFunds = db.prepare('SELECT SUM(amount) as total FROM donations').get().total || 0;
    const totalVolunteers = db.prepare('SELECT COUNT(*) as count FROM volunteers').get().count;
    const totalDonors = db.prepare('SELECT COUNT(DISTINCT donor_name) as count FROM donations').get().count;
    res.json({ totalFunds, totalVolunteers, totalDonors });
  });

  app.get('/api/recent-work', (req, res) => {
    const work = db.prepare('SELECT * FROM recent_work ORDER BY date DESC LIMIT 6').all();
    res.json(work);
  });

  app.get('/api/news', (req, res) => {
    const news = db.prepare('SELECT * FROM news ORDER BY date DESC LIMIT 6').all();
    res.json(news);
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

  // Vite or Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
