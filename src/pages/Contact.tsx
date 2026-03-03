import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (submitError) throw submitError;
      
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              We'd love to hear <br /> from you.
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              Have questions about our programs, volunteering, or how you can help? Send us a message and our team will get back to you as soon as possible.
            </p>

            <div className="space-y-8">
              {[
                { icon: MapPin, title: 'Our Office', content: '123 Hope St, Green City, GC 45678' },
                { icon: Phone, title: 'Phone', content: '+1 (234) 567-890' },
                { icon: Mail, title: 'Email', content: 'contact@hopevoice.org' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Message Sent!</h2>
                <p className="text-slate-600 mb-8">
                  Thank you for reaching out. We'll be in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? 'Sending...' : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
