# LocalGigs Deployment Guide

This guide provides step-by-step instructions for deploying LocalGigs to production.

## 🚀 Production Deployment Checklist

### Pre-Deployment Setup

- [ ] **Supabase Project** - Production database configured
- [ ] **Stripe Account** - Live keys obtained
- [ ] **Domain Name** - Registered and configured
- [ ] **Environment Variables** - All production values set
- [ ] **Database Schema** - Applied to production database
- [ ] **SSL Certificate** - Configured for HTTPS

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file or configure in your hosting platform:

```env
# Supabase Configuration (Production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Stripe Configuration (Live Keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key

# App Configuration
VITE_APP_URL=https://yourdomain.com
VITE_APP_NAME=LocalGigs
```

## 🗄️ Database Setup

### 1. Create Production Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project for production
3. Choose a strong database password
4. Select your preferred region

### 2. Apply Database Schema

1. Navigate to SQL Editor in Supabase Dashboard
2. Copy the entire contents of `database/schema.sql`
3. Execute the SQL to create all tables, indexes, and policies

### 3. Configure Authentication

```sql
-- Enable email authentication
UPDATE auth.config SET 
  enable_signup = true,
  enable_email_confirmations = true;

-- Set up redirect URLs
INSERT INTO auth.config (key, value) VALUES 
  ('site_url', 'https://yourdomain.com'),
  ('redirect_urls', 'https://yourdomain.com/auth/callback');
```

### 4. Set Up Row Level Security

RLS policies are included in the schema, but verify they're active:

```sql
-- Verify RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

## 💳 Stripe Configuration

### 1. Live Mode Setup

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API Keys**:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...` (for backend)

### 2. Webhook Configuration

1. **Create Webhook Endpoint**:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Supabase Edge Function** (Optional):
   ```typescript
   // supabase/functions/stripe-webhook/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   serve(async (req) => {
     const signature = req.headers.get('stripe-signature')
     // Handle webhook events
   })
   ```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository

#### Step 2: Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

#### Step 3: Environment Variables
Add all production environment variables in Vercel dashboard.

#### Step 4: Domain Configuration
1. Add your custom domain in Vercel
2. Configure DNS records as instructed

### Option 2: Netlify

#### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your repository

#### Step 2: Build Settings
```
Build command: npm run build
Publish directory: dist
```

#### Step 3: Environment Variables
Add all production environment variables in Netlify dashboard.

### Option 3: AWS S3 + CloudFront

#### Step 1: Build Application
```bash
npm run build
```

#### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://your-app-bucket
aws s3 sync dist/ s3://your-app-bucket --delete
```

#### Step 3: Configure CloudFront
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error pages for SPA routing

### Option 4: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Security Configuration

### 1. HTTPS Setup
Ensure SSL/TLS is configured:
- Use Let's Encrypt for free certificates
- Configure HSTS headers
- Redirect HTTP to HTTPS

### 2. Content Security Policy
Add CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.supabase.co;
```

### 3. Environment Security
- Never commit `.env` files
- Use secure environment variable storage
- Rotate keys regularly

## 📊 Monitoring & Analytics

### 1. Error Tracking
Set up error monitoring:
```bash
npm install @sentry/react @sentry/tracing
```

### 2. Performance Monitoring
- Configure Web Vitals tracking
- Set up performance budgets
- Monitor bundle size

### 3. Analytics
- Google Analytics 4
- Supabase Analytics
- Custom event tracking

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Pre-Production Testing

### 1. Staging Environment
Set up a staging environment that mirrors production:
- Separate Supabase project
- Stripe test mode
- Same deployment process

### 2. Testing Checklist
- [ ] User registration and login
- [ ] Task creation and application
- [ ] Gig posting and management
- [ ] Skill swap functionality
- [ ] Messaging system
- [ ] Payment processing (test mode)
- [ ] Mobile responsiveness
- [ ] Performance testing

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure values don't contain special characters

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure database schema is applied

#### Payment Issues
- Verify Stripe keys are for correct mode
- Check webhook configuration
- Test with Stripe test cards

## 📈 Post-Deployment

### 1. Health Checks
Set up monitoring for:
- Application uptime
- Database connectivity
- Payment processing
- API response times

### 2. Backup Strategy
- Database backups (Supabase handles this)
- Code repository backups
- Environment configuration backups

### 3. Scaling Considerations
- Monitor resource usage
- Set up auto-scaling if needed
- Consider CDN for static assets

## 🔄 Updates and Maintenance

### Rolling Updates
1. Test changes in staging
2. Deploy during low-traffic periods
3. Monitor for issues post-deployment
4. Have rollback plan ready

### Database Migrations
```sql
-- Example migration
ALTER TABLE users ADD COLUMN new_field TEXT;
UPDATE users SET new_field = 'default_value';
```

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test thoroughly before deploying
```

---

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review application logs
3. Check service status pages (Vercel, Supabase, Stripe)
4. Create an issue in the repository

**Remember**: Always test in staging before deploying to production!
