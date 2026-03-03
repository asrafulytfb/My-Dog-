import { motion } from 'motion/react';
import { Heart, Users, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-secondary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Our Story
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight"
            >
              Dedicated to <br />
              <span className="text-primary">Humanity.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 leading-relaxed"
            >
              HopeVoice is a global non-profit organization that works on the front lines of the world's most pressing humanitarian challenges.
            </motion.p>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To empower vulnerable communities through sustainable development, providing access to essential services, education, and economic opportunities that foster long-term self-reliance.
              </p>
            </div>
            <div className="bg-primary p-12 rounded-[3rem] text-white">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-white/80 leading-relaxed">
                A world where every individual has the opportunity to live a life of dignity, free from poverty and injustice, supported by resilient and thriving communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Team</span>
          <h2 className="text-4xl font-bold text-slate-900 mb-16">The People Behind HopeVoice</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Dr. Sarah Jenkins', role: 'Executive Director', img: 'https://i.pravatar.cc/300?u=sarah' },
              { name: 'Michael Chen', role: 'Head of Programs', img: 'https://i.pravatar.cc/300?u=michael' },
              { name: 'Elena Rodriguez', role: 'Community Outreach', img: 'https://i.pravatar.cc/300?u=elena' },
              { name: 'David Smith', role: 'Finance & Operations', img: 'https://i.pravatar.cc/300?u=david' },
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 relative">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Core Values</h2>
            <p className="text-lg text-slate-600">These principles guide everything we do, from our field operations to our administrative decisions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Integrity', desc: 'We are committed to transparency and accountability in all our actions and financial management.' },
              { title: 'Empowerment', desc: 'We believe in giving people the tools and knowledge to build their own sustainable futures.' },
              { title: 'Collaboration', desc: 'We work closely with local communities and partners to ensure our impact is culturally relevant and lasting.' },
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary text-primary flex items-center justify-center mx-auto mb-8">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
