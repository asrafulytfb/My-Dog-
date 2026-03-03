import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';

export default function Donate() {
  const [amount, setAmount] = React.useState<number | string>(50);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-slate-100"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Your generous donation of <span className="font-bold text-primary">${amount}</span> has been received. Your support makes our work possible.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Support Our Mission</span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Small acts, <br />
              <span className="text-primary">Big Impact.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Your donation directly funds our programs on the ground. Whether it's providing school supplies, clean water, or medical aid, every contribution counts.
            </p>

            <div className="space-y-6">
              {[
                { title: '94% Efficiency', desc: '94 cents of every dollar goes directly to program services.' },
                { title: 'Secure Payments', desc: 'All transactions are encrypted and processed securely.' },
                { title: 'Tax Deductible', desc: 'HopeVoice is a registered 501(c)(3) non-profit organization.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <form onSubmit={handleDonate} className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-6">Select Amount (USD)</label>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[25, 50, 100, 250, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${amount === val ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30'}`}
                    >
                      ${val}
                    </button>
                  ))}
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Other"
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Payment Information</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    required
                    type="text"
                    placeholder="Card Number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <input
                    required
                    type="text"
                    placeholder="CVC"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary text-white py-5 rounded-2xl text-xl font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? 'Processing...' : (
                  <>
                    Donate ${amount} <Heart className="w-6 h-6 fill-current" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                By donating, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
