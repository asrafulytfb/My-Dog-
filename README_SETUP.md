# HopeVoice NGO Blog - Setup Instructions

Follow these steps to get your NGO blog website up and running.

## 1. Supabase Setup

1. **Create a Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2. **Database Schema**:
   - Go to the **SQL Editor** in your Supabase dashboard.
   - Copy the contents of `SUPABASE_SETUP.sql` from this project.
   - Paste it into the SQL editor and click **Run**.
3. **Promote to Admin**:
   - By default, all new users have the `user` role.
   - To make yourself an admin, go to the **SQL Editor** in Supabase.
   - Run the following command (replace with your email):
     ```sql
     UPDATE auth.users 
     SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"') 
     WHERE email = 'your-admin-email@example.com';
     ```
   - *Note: You will use these credentials to log in at `/admin/login`.*
4. **API Keys**:
   - Go to **Project Settings > API**.
   - Copy the **Project URL** and **anon public** key.
   - Add these to your environment variables (see below).

## 2. Environment Variables

Create a `.env` file in the root of your project (or use the AI Studio Secrets panel) and add:

```env
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

## 3. GitHub Push Instructions

1. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HopeVoice NGO Blog"
   ```
2. **Create Repository**: Create a new repository on GitHub.
3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/hopevoice-ngo-blog.git
   git branch -M main
   git push -u origin main
   ```

## 4. Vercel Deployment

1. **Connect GitHub**: Go to [Vercel](https://vercel.com/) and click **New Project**.
2. **Import Repo**: Select your `hopevoice-ngo-blog` repository.
3. **Configure Project**:
   - Framework Preset: **Vite** (or Other if not detected).
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
4. **Environment Variables**: Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project settings.
5. **Deploy**: Click **Deploy**.

## 5. Admin Access

Once deployed, navigate to `https://your-app.vercel.app/admin/login` to access the dashboard and start posting stories!
