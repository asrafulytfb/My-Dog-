import { create } from 'zustand';

type Language = 'en' | 'bn';

interface AppState {
  lang: Language;
  setLang: (lang: Language) => void;
  user: any | null;
  setUser: (user: any | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
  user: null,
  setUser: (user) => set({ user }),
}));

export const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    committee: 'Committee',
    campaigns: 'Campaigns',
    donate: 'Donate Now',
    login: 'Login',
    register: 'Register',
    hero_slogan: 'Beside humanity, a companion of life',
    hero_subtitle: 'Join TLSF in our mission to empower communities through healthcare, education, and disaster relief.',
    total_raised: 'Total Funds Raised',
    active_campaigns: 'Active Campaigns',
    volunteers: 'Volunteers',
    recent_donations: 'Recent Donations',
    recent_work: 'Recent Work',
    news_announcements: 'News & Announcements',
    donate_now_cta: 'Donate Now to Save Lives',
    volunteer_join_cta: 'Become a Volunteer',
    footer_text: '© 2026 The Life Saving Foundation (TLSF). All rights reserved.',
  },
  bn: {
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    committee: 'কমিটি',
    campaigns: 'ক্যাম্পেইন',
    donate: 'এখনই দান করুন',
    login: 'লগইন',
    register: 'নিবন্ধন',
    hero_slogan: 'মানবতার পাশে, জীবনের সহযাত্রী',
    hero_subtitle: 'স্বাস্থ্যসেবা, শিক্ষা এবং দুর্যোগ ত্রাণের মাধ্যমে সম্প্রদায়কে ক্ষমতায়ন করতে TLSF-এর সাথে যোগ দিন।',
    total_raised: 'মোট সংগৃহীত তহবিল',
    active_campaigns: 'সক্রিয় ক্যাম্পেইন',
    volunteers: 'স্বেচ্ছাসেবক',
    recent_donations: 'সাম্প্রতিক দান',
    recent_work: 'সাম্প্রতিক কার্যক্রম',
    news_announcements: 'সংবাদ ও ঘোষণা',
    donate_now_cta: 'জীবন বাঁচাতে এখনই দান করুন',
    volunteer_join_cta: 'স্বেচ্ছাসেবক হিসেবে যোগ দিন',
    footer_text: '© ২০২৬ দ্য লাইফ সেভিং ফাউন্ডেশন (TLSF)। সর্বস্বত্ব সংরক্ষিত।',
  }
};
