import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Users, Globe, ShieldCheck, Menu, X, 
  MessageCircle, Send, LogIn, UserPlus, LayoutDashboard, 
  LogOut, TrendingUp, DollarSign, Calendar, MapPin, 
  CheckCircle, Languages, ArrowRight, Activity
} from 'lucide-react';
import { useAppStore, translations } from './store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import ReactMarkdown from 'react-markdown';

// --- Components ---

const Navbar = () => {
  const { lang, setLang, user, setUser } = useAppStore();
  const t = translations[lang];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TLSF</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600">{t.home}</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-emerald-600">{t.about}</Link>
            <Link to="/campaigns" className="text-sm font-medium text-slate-600 hover:text-emerald-600">{t.campaigns}</Link>
            <Link to="/committee" className="text-sm font-medium text-slate-600 hover:text-emerald-600">{t.committee}</Link>
            
            <div className="flex items-center gap-2 ml-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
              >
                <Languages className="w-3 h-3" />
                {lang === 'en' ? 'BN' : 'EN'}
              </button>
              
              {user ? (
                <div className="flex items-center gap-4 ml-4">
                  <Link 
                    to={user.role === 'admin' ? "/admin" : "/dashboard"} 
                    className="text-sm font-bold text-emerald-600 flex items-center gap-1"
                  >
                    <UserIcon className="w-4 h-4" />
                    {user.name}
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-4">
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600">{t.login}</Link>
                  <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition-all shadow-md">
                    {t.register}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button 
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="text-xs font-bold bg-slate-100 px-2 py-1 rounded"
              >
                {lang === 'en' ? 'BN' : 'EN'}
              </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">{t.home}</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">{t.about}</Link>
              <Link to="/campaigns" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">{t.campaigns}</Link>
              <Link to="/committee" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">{t.committee}</Link>
              <div className="pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-emerald-600 font-bold">{user.name}</Link>
                    <button onClick={handleLogout} className="text-left px-3 py-2 text-red-500 font-medium">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-slate-600 font-medium">{t.login}</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 bg-emerald-600 text-white rounded-xl text-center font-bold">{t.register}</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am TLSF Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-80 sm:w-96 mb-4 overflow-hidden flex flex-col"
          >
            <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-bold">TLSF Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none'}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm rounded-tl-none animate-pulse text-slate-400 text-xs">AI is thinking...</div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-grow text-sm bg-slate-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

// --- Pages ---

const Home = () => {
  const { lang } = useAppStore();
  const t = translations[lang];
  const [stats, setStats] = useState({ totalFunds: 0, totalVolunteers: 0, totalDonors: 0 });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/campaigns').then(res => res.json()).then(setCampaigns);
    fetch('/api/donations/recent').then(res => res.json()).then(setRecentDonations);
    // Mocking global stats for home
    setStats({ totalFunds: 154200, totalVolunteers: 124, totalDonors: 856 });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.3]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
              {t.hero_title}
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
              {t.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/campaigns" className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2">
                {t.donate} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Donation Ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 backdrop-blur-sm py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-12 text-white text-sm font-medium">
            {recentDonations.map((d, i) => (
              <span key={i} className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400 fill-current" />
                {d.donor_name || 'Anonymous'} donated ${d.amount}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {recentDonations.map((d, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400 fill-current" />
                {d.donor_name || 'Anonymous'} donated ${d.amount}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: DollarSign, label: t.total_raised, value: `$${stats.totalFunds.toLocaleString()}` },
              { icon: Activity, label: t.active_campaigns, value: campaigns.length },
              { icon: Users, label: t.volunteers, value: stats.totalVolunteers },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Preview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.active_campaigns}</h2>
              <p className="text-slate-600">Support our ongoing efforts to make a difference.</p>
            </div>
            <Link to="/campaigns" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.slice(0, 3).map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const CampaignCard = ({ campaign }: { campaign: any }) => {
  const { lang } = useAppStore();
  const progress = Math.min(100, (campaign.raised / campaign.goal) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img src={campaign.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
          Active
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">
          {lang === 'en' ? campaign.title_en : campaign.title_bn}
        </h3>
        <p className="text-slate-600 text-sm mb-6 line-clamp-2">
          {lang === 'en' ? campaign.description_en : campaign.description_bn}
        </p>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-600">${campaign.raised.toLocaleString()} raised</span>
            <span className="text-slate-400">Goal: ${campaign.goal.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              className="h-full bg-emerald-600"
            />
          </div>
        </div>

        <Link 
          to={`/donate/${campaign.id}`}
          className="block w-full text-center bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
        >
          Donate Now
        </Link>
      </div>
    </div>
  );
};

const About = () => {
  const { lang } = useAppStore();
  return (
    <div className="pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-slate-900 mb-8">About TLSF</h1>
        <div className="prose prose-emerald lg:prose-xl text-slate-600 leading-relaxed">
          <p>
            The Life Saving Foundation (TLSF) is a non-profit organization dedicated to serving humanity. 
            Our journey began with a simple vision: to ensure that no life is lost due to lack of resources, 
            healthcare, or education.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Mission</h2>
          <p>
            To provide immediate relief and long-term sustainable solutions to the most vulnerable populations 
            through healthcare initiatives, educational support, and disaster management.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Our Vision</h2>
          <p>
            A world where every individual has the opportunity to live a healthy, educated, and dignified life.
          </p>
        </div>
      </div>
    </div>
  );
};

const Committee = () => {
  const members = [
    { name: 'Dr. Rahman', role: 'Chairman', img: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Sarah Ahmed', role: 'General Secretary', img: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Karim Ullah', role: 'Treasurer', img: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Nusrat Jahan', role: 'Executive Member', img: 'https://i.pravatar.cc/150?u=4' },
  ];

  return (
    <div className="pt-20 pb-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-16">Our Leadership</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {members.map((m, i) => (
            <div key={i} className="group">
              <div className="aspect-square rounded-3xl overflow-hidden mb-6 shadow-lg">
                <img src={m.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
              <p className="text-emerald-600 font-medium">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DonationForm = () => {
  const { id } = useParams();
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bkash');
  const [donorName, setDonorName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          method,
          campaign_id: id,
          donor_name: donorName,
          user_id: user?.id
        })
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (e) {
      alert('Donation failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-white rounded-[3rem] shadow-xl max-w-md">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
          <p className="text-slate-600 mb-8">Your donation of ${amount} has been received. Redirecting you home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Make a Donation</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Amount (USD)</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[10, 50, 100].map(val => (
                  <button 
                    key={val} 
                    type="button" 
                    onClick={() => setAmount(val.toString())}
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${amount === val.toString() ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Custom Amount"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Donor Name</label>
              <input 
                type="text" 
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Your Name (or Anonymous)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600 appearance-none"
              >
                <option>Bkash</option>
                <option>Nagad</option>
                <option>Card</option>
                <option>PayPal</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAppStore();

  useEffect(() => {
    // If we have a user and they are not admin, redirect
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    // If we don't have a user yet, we might still be loading the initial auth state
    // But we can try to fetch stats anyway as the cookie should be there
    
    console.log('Fetching admin stats...');
    fetch('/api/stats', { credentials: 'include' })
      .then(res => {
        console.log('Admin stats response status:', res.status);
        if (res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Admin stats fetched successfully');
        setStats(data);
      })
      .catch(err => {
        console.error('Admin stats fetch failed:', err);
        setError(err.message);
        // Only redirect if it's an auth error
        if (err.message === 'Unauthorized') {
          navigate('/login');
        }
      });
  }, [user]);

  if (error && error !== 'Unauthorized') {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
        <p className="text-slate-600 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-emerald-600 text-white px-6 py-2 rounded-xl">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return <div className="p-20 text-center">Loading Dashboard...</div>;

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">System overview and analytics</p>
          </div>
          <div className="bg-white p-2 rounded-2xl shadow-sm flex gap-4">
             <div className="px-4 py-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Status</div>
                <div className="text-emerald-600 font-bold flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Live
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Funds', value: `$${stats.totalFunds.toLocaleString()}`, icon: DollarSign },
            { label: 'Total Volunteers', value: stats.totalVolunteers, icon: Users },
            { label: 'Unique Donors', value: stats.totalDonors, icon: Heart },
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-600">
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
              <div className="text-sm font-medium text-slate-500">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Campaign Progress</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.campaignStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="raised" fill="#059669" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Fund Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.campaignStats}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="raised"
                  >
                    {stats.campaignStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ type }: { type: 'login' | 'register' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = type === 'login' ? { email, password } : { name, email, password };

    console.log('Submitting auth form to:', endpoint);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      console.log('Auth response status:', res.status);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }
      const data = await res.json();
      console.log('Auth response:', data);
      if (res.ok) {
        if (type === 'login') {
          console.log('Login successful, user role:', data.user.role);
          setUser(data.user);
          navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          navigate('/login');
        }
      } else {
        alert(data.error);
      }
    } catch (e: any) {
      console.error('Auth error details:', e);
      alert(`Auth failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          {type === 'login' ? 'Welcome Back' : 'Join TLSF'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (type === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="text-center mt-8 text-sm text-slate-500">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <Link to={type === 'login' ? '/register' : '/login'} className="text-emerald-600 font-bold hover:underline">
            {type === 'login' ? 'Register' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
};

const VolunteerForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', skills: '', availability: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSuccess(true);
    } catch (e) {
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl max-w-md">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Application Sent!</h2>
          <p className="text-slate-600">We will contact you soon. Thank you for your interest in TLSF.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Volunteer Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <input 
              type="text" 
              placeholder="Skills (e.g., Teaching, Medical, Logistics)" 
              required
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Availability (e.g., Weekends)" 
                required
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input 
                type="text" 
                placeholder="Location" 
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
            >
              {loading ? 'Submitting...' : 'Join as Volunteer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const { setUser } = useAppStore();

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/campaigns" element={<div className="pt-24 pb-32 max-w-7xl mx-auto px-4"><h1 className="text-4xl font-bold mb-12">All Campaigns</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><CampaignsList /></div></div>} />
            <Route path="/donate/:id" element={<DonationForm />} />
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/register" element={<AuthPage type="register" />} />
            <Route path="/volunteer" element={<VolunteerForm />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/dashboard" element={<div className="p-20 text-center">User Dashboard Coming Soon</div>} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center gap-8 mb-8">
              <Link to="/about" className="hover:text-white">About</Link>
              <Link to="/campaigns" className="hover:text-white">Campaigns</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </div>
            <p className="text-sm">{translations.en.footer_text}</p>
          </div>
        </footer>
        <Chatbot />
      </div>
    </Router>
  );
};

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/campaigns').then(res => res.json()).then(setCampaigns);
  }, []);
  return <>{campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}</>;
};

export default App;
