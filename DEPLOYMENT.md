# Deployment Guide

## 1. Push to GitHub

To store your code and deploy it, you first need to push it to a GitHub repository.

1.  **Create a new Repository** on [GitHub](https://github.com/new). Name it `luxe-ecommerce` (or whatever you prefer).
2.  **Run the following commands** in your terminal (inside this folder):

```bash
# Link your local folder to GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```
*(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual details).*

## 2. Deploy to Vercel (Recommended)

Vercel is the best place to host Next.js apps.

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard) and "Add New Project".
2.  Select "Import" next to your relevant GitHub repository.
3.  **Environment Variables**: You MUST add these in the Vercel Project Settings during import:
    *   `DATABASE_URL`: Your production database URL (e.g., from Neon or Supabase). *Note: The local `file:./dev.db` (SQLite) will NOT work on Vercel properly as it is ephemeral.*
    *   `NEXTAUTH_SECRET`: Generate a random string (e.g. `openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: Your Vercel domain (e.g. `https://your-project.vercel.app`).
    *   `GOOGLE_CLIENT_ID`: From Google Cloud Console.
    *   `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
4.  Click **Deploy**.

### Important Note on Database
Since you are using SQLite locally (`dev.db`), this is a file-based database. Vercel is serverless and does not persist write changes to files. 
**You MUST switch to a Postgres database (like Neon, Supabase, or Vercel Postgres) for production.**

**To switch to Postgres:**
1.  Update `prisma/schema.prisma`:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
2.  Delete `migrations` folder.
3.  Run `npx prisma migrate dev --name init_postgres`.

## 3. Deploy to Replit

1.  Create a newly imported Repl from your GitHub repo.
2.  Replit allows SQLite, so your `dev.db` might work, but it's not recommended for production traffic.
3.  Add Secrets in the "Secrets" tool (Lock icon) matching your `.env` file.
4.  Hit **Run**.
