import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Hope<span className="text-primary">Voice</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Empowering communities through sustainable development, education, and healthcare. Join us in making a difference.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Our Blog</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/donate" className="hover:text-primary transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>123 Hope St, Green City, GC 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@hopevoice.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Newsletter</h3>
            <p className="text-sm mb-4">Stay updated with our latest news and events.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary outline-none"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} HopeVoice NGO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
