import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogListing from './pages/BlogListing';
import SingleBlogPost from './pages/SingleBlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/admin/PostEditor';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/:slug" element={<SingleBlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/posts/new" element={<PostEditor />} />
          <Route path="/admin/posts/edit/:id" element={<PostEditor />} />
        </Routes>
      </Layout>
    </Router>
  );
}
