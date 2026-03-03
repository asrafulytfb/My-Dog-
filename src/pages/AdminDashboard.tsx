import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost, ContactMessage } from '../types';
import { 
  Plus, Edit2, Trash2, LogOut, LayoutDashboard, 
  FileText, MessageSquare, ExternalLink, Search,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function AdminDashboard() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'posts' | 'messages'>('posts');
  const navigate = useNavigate();

  React.useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }

    // Check for admin role
    const role = session.user.app_metadata?.role;
    if (role !== 'admin') {
      alert('Access Denied: You do not have administrator privileges.');
      navigate('/');
    }
  }

  async function fetchData() {
    setLoading(true);
    const [postsRes, messagesRes] = await Promise.all([
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    ]);

    if (!postsRes.error) setPosts(postsRes.data || []);
    if (!messagesRes.error) setMessages(messagesRes.data || []);
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-2 text-white mb-12">
          <div className="bg-primary p-1.5 rounded-lg">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab === 'posts' ? 'Manage Blog Posts' : 'Contact Messages'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'posts' ? `You have ${posts.length} published stories.` : `You have ${messages.length} received messages.`}
            </p>
          </div>

          {activeTab === 'posts' && (
            <Link
              to="/admin/posts/new"
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create New Post
            </Link>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : activeTab === 'posts' ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={post.featured_image}
                            className="w-12 h-12 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{post.title}</div>
                            <div className="text-xs text-slate-500">by {post.author_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-secondary text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                        No posts found. Start by creating your first story!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{msg.name}</h3>
                    <p className="text-sm text-primary font-medium">{msg.email}</p>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(msg.created_at)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                  "{msg.message}"
                </p>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white rounded-[2rem] border border-slate-100">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">No messages received yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
