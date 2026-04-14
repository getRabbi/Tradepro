# 🚀 Production Deployment Guide — TradePro

## Quick Answer: cPanel এ Next.js চলে না!

cPanel PHP/HTML এর জন্য বানানো — Next.js এ Node.js server লাগে।
তোমার জন্য সবচেয়ে সহজ ৩টা option:

---

## ✅ Option 1: Vercel (সবচেয়ে সহজ — FREE)

Next.js এর creator Vercel — 1 click deploy, SSL free, global CDN।

### Step 1: GitHub এ push করো
```bash
cd trading-platform
git init
git add .
git commit -m "Initial commit"

# GitHub এ নতুন repo বানাও, তারপর:
git remote add origin https://github.com/TOMAR_USERNAME/trading-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel এ deploy
1. https://vercel.com → Sign up (GitHub দিয়ে)
2. "New Project" → GitHub repo select করো
3. Environment Variables add করো:
   ```
   DATABASE_URL = postgresql://user:pass@host:5432/trading_platform
   JWT_SECRET = random-64-char-string
   NEXT_PUBLIC_SITE_NAME = TradePro
   NEXT_PUBLIC_SITE_URL = https://tradepro.vercel.app
   NEXT_PUBLIC_DEMO_BALANCE = 100000
   ```
4. "Deploy" click করো → 2 মিনিটে live!

### Custom Domain add:
Vercel Dashboard → Settings → Domains → `tradepro.com` add করো
DNS এ CNAME record: `@ → cname.vercel-dns.com`

### Result: https://tradepro.vercel.app (free SSL, fast, auto-deploy)

---

## ✅ Option 2: VPS (Full Control — $4-6/month)

DigitalOcean, Hetzner, বা Vultr থেকে VPS নাও।

### Step 1: Server setup (Ubuntu 22.04)
```bash
# SSH login
ssh root@YOUR_SERVER_IP

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Setup database
sudo -u postgres psql
CREATE USER tradepro WITH PASSWORD 'yourpassword';
CREATE DATABASE trading_platform OWNER tradepro;
\q

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt-get install -y nginx
```

### Step 2: Deploy app
```bash
# Clone project
cd /var/www
git clone https://github.com/YOUR/trading-platform.git
cd trading-platform

# Setup env
cp .env.example .env
nano .env
# Set: DATABASE_URL="postgresql://tradepro:yourpassword@localhost:5432/trading_platform"
# Set: JWT_SECRET="your-random-secret-here"
# Set: NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Install & build
npm install
npx prisma generate
npx prisma db push
npm run build

# Start with PM2
pm2 start npm --name "tradepro" -- start
pm2 save
pm2 startup
```

### Step 3: Nginx config
```bash
nano /etc/nginx/sites-available/tradepro
```
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
ln -s /etc/nginx/sites-available/tradepro /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 4: SSL (free)
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Result: https://yourdomain.com (full control, fast)

---

## ✅ Option 3: Railway.app (Easy + Cheap — $5/month)

### Step 1:
1. https://railway.app → Sign up
2. "New Project" → "Deploy from GitHub"
3. Select repo
4. Add PostgreSQL: "New" → "Database" → "PostgreSQL"
5. Railway auto-sets DATABASE_URL
6. Add other env vars (JWT_SECRET, etc.)
7. Deploy!

### Custom Domain:
Railway Dashboard → Settings → Custom Domain → add your domain

---

## 🗄️ Database Setup (All Options Need This)

### Free PostgreSQL Hosting:
| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Supabase** | 500MB, unlimited API | Best free option |
| **Neon** | 512MB | Vercel integration |
| **Railway** | $5/mo included | Easy setup |
| **ElephantSQL** | 20MB | Testing only |

### Supabase Setup (Recommended FREE):
1. https://supabase.com → New Project
2. Project Settings → Database → Connection String copy করো
3. `.env` এ paste করো:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
   ```
4. ```bash
   npx prisma db push  # Creates all 25 tables
   ```

---

## ⚡ Dynamic করার Checklist

### এখন যা static/mock, সেগুলো DB connect করলে auto dynamic হবে:

| Feature | এখন | DB connect করলে |
|---------|------|-----------------|
| Registration | ❌ Redirect to /trader | ✅ Real user create হবে |
| Login | ❌ Demo mode | ✅ Real auth, real data |
| Demo Balance | Hardcoded 100K | ✅ .env থেকে admin set করবে |
| Admin Users | Mock data | ✅ Real users DB থেকে আসবে |
| Admin Finance | Mock data | ✅ Real transactions |
| Deposit | Screenshot upload only | ✅ DB তে save, admin approve |
| KYC | Client-side only | ✅ Files save, admin review |
| Trading | Demo only | ✅ Real P&L DB তে save |

### Steps to make fully dynamic:
```bash
# 1. Setup free PostgreSQL (Supabase)
# 2. Set DATABASE_URL in .env
# 3. Create tables
npx prisma db push

# 4. Create admin user
npx prisma db seed  # (or manually via Prisma Studio)

# 5. Deploy to Vercel
# Done! Everything is now dynamic
```

---

## 🔑 Create Admin User

After DB is connected, create admin user via Prisma Studio:

```bash
npx prisma studio
# Opens http://localhost:5555
# Go to "users" table
# Create new user with role: "ADMIN"
```

Or use this SQL:
```sql
INSERT INTO users (id, email, password_hash, first_name, last_name, role)
VALUES (
  gen_random_uuid(),
  'admin@tradepro.com',
  '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu6cy', -- password: admin123
  'Admin',
  'TradePro',
  'ADMIN'
);
```

Login: admin@tradepro.com / admin123

---

## 📋 Production Checklist

- [ ] PostgreSQL database connected (Supabase free)
- [ ] .env configured with real values
- [ ] `npx prisma db push` — tables created
- [ ] Admin user created
- [ ] Payment methods configured (Admin → Settings)
- [ ] KYC documents storage configured
- [ ] Deploy to Vercel/VPS
- [ ] Custom domain + SSL
- [ ] Test registration → login → trade → deposit → admin flow
