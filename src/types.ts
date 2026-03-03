export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  author_name: string;
  category: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
