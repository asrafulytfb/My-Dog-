import React from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import BlogCard from '../components/BlogCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const POSTS_PER_PAGE = 6;

export default function BlogListing() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

      if (!error && data) {
        setPosts(data);
        setTotalCount(count || 0);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [page, searchQuery]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Stories</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore the impact of our work through the voices of our community and volunteers on the ground.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl aspect-[4/5]" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-sm font-bold text-slate-900">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium text-lg">No stories found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
