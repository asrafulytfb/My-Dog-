import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Users, Globe, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import BlogCard from '../components/BlogCard';

export default function Home() {
  const [latestPosts, setLatestPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (!error && data) {
        setLatestPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000"
            alt="Hero background"
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-primary/20 backdrop-blur-md text-primary-foreground border border-primary/30 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              Together for a better future
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
              Empowering Lives, <br />
              <span className="text-primary">Restoring Hope.</span>
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
              We are a non-profit organization dedicated to providing sustainable solutions for education, healthcare, and community development worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/donate"
                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
              >
                Start Donating <Heart className="w-5 h-5 fill-current" />
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Learn More <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20 -mt-16 relative z-20 rounded-t-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Lives Impacted', value: '50k+' },
              { icon: Globe, label: 'Countries', value: '12+' },
              { icon: Heart, label: 'Volunteers', value: '1.2k' },
              { icon: ShieldCheck, label: 'Success Rate', value: '94%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary text-primary mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1000"
                  alt="About us"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-primary p-8 rounded-3xl shadow-xl hidden md:block">
                <div className="text-4xl font-bold text-white mb-1">15+</div>
                <div className="text-white/80 font-medium">Years of Service</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Mission</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                We believe every person deserves a chance to thrive.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                HopeVoice was founded on the principle that collective action can solve the world's most pressing challenges. From providing clean water in remote villages to building schools in underserved urban areas, our focus is on long-term, sustainable impact.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Sustainable community development programs',
                  'Emergency relief and humanitarian aid',
                  'Education and vocational training for youth',
                  'Healthcare access for vulnerable populations'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
              >
                Discover Our Story <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Stories</span>
              <h2 className="text-4xl font-bold text-slate-900">Latest from the Field</h2>
            </div>
            <Link
              to="/blog"
              className="bg-secondary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-all"
            >
              View All Stories
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-slate-100 rounded-2xl aspect-[4/5]" />
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No stories found yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Your contribution can change a life today.
              </h2>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                Every dollar donated goes directly to our field programs. Join our community of monthly donors and make a lasting impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/donate"
                  className="bg-primary text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/20"
                >
                  Donate Now
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
