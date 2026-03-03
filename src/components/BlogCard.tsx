import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { formatDate } from '../lib/utils';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link to={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden block">
        <img
          src={post.featured_image || 'https://picsum.photos/seed/ngo/800/600'}
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.created_at)}
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {post.author_name}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
          {post.content.replace(/[#*`]/g, '').slice(0, 150)}...
        </p>
        
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
        >
          Read Full Story <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
