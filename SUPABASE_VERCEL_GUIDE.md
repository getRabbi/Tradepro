# 🚀 Deploy Guide: Supabase + Vercel = Full Functional Platform

## Total Time: ~30 minutes
## Cost: FREE (both Supabase and Vercel have free tiers)

---

## Part 1: Supabase Setup (Database + File Storage)

### Step 1: Create Supabase Project
1. Go to https://supabase.com → Sign Up (GitHub login)
2. Click "New Project"
   - Name: `tradepro`
   - Database Password: (set a strong password, COPY IT!)
   - Region: Singapore (closest to BD)
3. Wait 2 minutes for project to setup

### Step 2: Get Connection String
1. Go to Settings → Database
2. Copy "Connection string (URI)" — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefgh.supabase.co:5432/postgres
   ```
3. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Create Storage Buckets
1. Go to Storage (left sidebar)
2. Click "New Bucket" → Name: `kyc-documents` → Public: ON → Create
3. Click "New Bucket" → Name: `deposit-screenshots` → Public: ON → Create

### Step 4: Get API Keys
1. Go to Settings → API
2. Copy:
   - **Project URL**: `https://abcdefgh.supabase.co`
   - **anon public key**: `eyJ...` (long string)

### Step 5: Create Database Tables
Open terminal in your project folder:
```bash
# Set your .env first with the DATABASE_URL from Step 2
npx prisma db push
```
You should see: "Your database is now in sync with your Prisma schema."

### Step 6: Create Admin User
```bash
npx prisma studio
```
Opens browser at localhost:5555
- Click "users" table
- Click "Add record"
- Fill in:
  - email: admin@tradepro.com
  - password_hash: $2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu6cy
  - first_name: Admin
  - last_name: TradePro
  - role: ADMIN
- Save

(This password hash = "admin123")

---

## Part 2: Vercel Deploy

### Step 1: Push to GitHub
```bash
cd trading-platform
git init
git add .
git commit -m "TradePro platform"
git remote add origin https://github.com/YOUR_USERNAME/tradepro.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New" → "Project"
3. Import your `tradepro` repo
4. **Environment Variables** — Add these:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:PASS@db.xxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | `any-random-64-character-string-here-make-it-long` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (from Supabase API settings) |
| `NEXT_PUBLIC_SITE_NAME` | `TradePro` |
| `NEXT_PUBLIC_SITE_URL` | `https://tradepro.vercel.app` |
| `NEXT_PUBLIC_DEMO_BALANCE` | `100000` |

5. Click "Deploy" → Wait 2-3 minutes
6. Done! Your site is live at `https://tradepro.vercel.app`

### Step 3: Custom Domain (Optional)
1. Vercel Dashboard → Your project → Settings → Domains
2. Add `tradepro.com` (or your domain)
3. Update DNS: Add CNAME record pointing to `cname.vercel-dns.com`

---

## Part 3: Test Everything

### Test Flow:
1. Open `https://tradepro.vercel.app`
2. Click "Open Account" → Register
3. Fill form → Skip KYC → Login
4. Go to /trader → Trade demo
5. Sidebar → Deposit → bKash select → Upload screenshot → Submit
6. Go to /admin → Finance → See deposit with screenshot → Approve
7. User balance updated!

### Admin Login:
- URL: `https://tradepro.vercel.app/auth/login`
- Email: admin@tradepro.com
- Password: admin123

---

## What's Now Fully Dynamic:

| Feature | Status |
|---------|--------|
| User Registration | ✅ Real DB |
| User Login | ✅ Real auth + JWT |
| Deposit + Screenshot | ✅ Supabase Storage |
| Admin sees screenshots | ✅ Image preview |
| Admin approves → balance updates | ✅ Auto credit |
| KYC Document Upload | ✅ Supabase Storage |
| Admin reviews KYC docs | ✅ Image/PDF preview |
| Payment method config | ✅ Admin Settings |
| Trading (WebTrader) | ✅ Client-side simulation |
| Admin User Management | ✅ Real DB data |
