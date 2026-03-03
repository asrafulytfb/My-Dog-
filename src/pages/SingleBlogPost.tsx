import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import { formatDate } from '../lib/utils';

export default function SingleBlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        navigate('/blog');
        return;
      }
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stories
        </Link>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-secondary text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-slate-100 py-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {post.author_name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{post.author_name}</div>
                <div className="text-xs text-slate-500">Author</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100 hidden sm:block" />
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-primary transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-primary transition-all">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl">
          <img
            src={post.featured_image || 'https://picsum.photos/seed/ngo/1200/600'}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="markdown-body prose prose-slate prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {/* Footer CTA */}
        <div className="mt-20 p-10 bg-secondary rounded-3xl border border-primary/10 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Inspired by this story?</h3>
          <p className="text-slate-600 mb-8">
            Your support helps us continue our work and share more stories of impact like this one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg"
            >
              Support Our Cause
            </Link>
            <Link
              to="/contact"
              className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
