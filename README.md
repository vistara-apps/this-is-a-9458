# LocalGigs - Community-Driven Local Task & Gig Platform

**Connect, Collaborate, and Earn Locally**

LocalGigs is a comprehensive web application that connects individuals for local task-sharing, gig opportunities, skill development, and professional networking. Built with React, Supabase, and modern web technologies.

## 🚀 Features

### Core Features

1. **Hyperlocal Task Feed**
   - Displays immediate, nearby tasks needing completion
   - Filter by distance, task type, and urgency
   - Both paid and unpaid/skill-building tasks

2. **Skill-Based Gig Board**
   - Paid gig opportunities filtered by specific skills
   - Experience level and location-based filtering
   - Direct application system

3. **Collaborative Skill Swapping**
   - Skill exchange between users
   - Mutual learning opportunities
   - Cost-effective skill development

4. **Community Networking**
   - Connect with peers and mentors
   - Direct messaging system
   - Group forums and mentorship matching

### Additional Features

- **Real-time Messaging** - Instant communication between users
- **Payment Integration** - Secure payments via Stripe
- **User Profiles** - Comprehensive user profiles with ratings and reviews
- **Search & Filtering** - Advanced search capabilities
- **Mobile Responsive** - Optimized for all devices
- **Authentication** - Secure user authentication with Supabase

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icons

### Backend & Services
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)
- **Stripe** - Payment processing
- **Vite** - Fast build tool and dev server

### Database Schema
- Users, Tasks, Gigs, Applications
- Skill Swaps, Connections, Messages
- Reviews, Payments with full relationships

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** - [Sign up here](https://supabase.com)
- **Stripe Account** - [Sign up here](https://stripe.com)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-9458.git
cd this-is-a-9458
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=LocalGigs
```

### 4. Database Setup

1. **Create a new Supabase project**
2. **Run the database schema**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Execute the SQL

3. **Enable Row Level Security** (already included in schema)

### 5. Stripe Setup (Optional for MVP)

1. **Create Stripe account**
2. **Get your publishable key**
3. **Set up webhooks** (for production)

### 6. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── tasks/          # Task-related components
│   ├── gigs/           # Gig-related components
│   ├── messages/       # Messaging components
│   ├── profile/        # Profile components
│   ├── payments/       # Payment components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API services
└── styles/             # Global styles

database/
└── schema.sql          # Complete database schema

public/                 # Static assets
```

## 🔧 Configuration

### Supabase Configuration

1. **Authentication Settings**:
   - Enable email authentication
   - Configure redirect URLs
   - Set up email templates

2. **Database Policies**:
   - RLS policies are included in the schema
   - Customize as needed for your use case

3. **Storage** (Optional):
   - Set up buckets for user avatars
   - Configure file upload policies

### Stripe Configuration

1. **Payment Methods**:
   - Configure accepted payment methods
   - Set up webhooks for payment status updates

2. **Webhooks**:
   - Set up webhook endpoints
   - Handle payment events

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Netlify

1. **Connect your repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`
4. **Set environment variables**

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run linting
npm run lint
```

## 📚 API Documentation

### Authentication
- Sign up, sign in, sign out
- Profile management
- Password reset

### Tasks
- Create, read, update, delete tasks
- Apply to tasks
- Task filtering and search

### Gigs
- Create, read, update, delete gigs
- Apply to gigs
- Gig filtering and search

### Skill Swaps
- Create skill swap requests
- Match with other users
- Manage skill exchanges

### Messaging
- Real-time messaging
- Conversation management
- Message history

### Payments
- Process payments via Stripe
- Payment history
- Platform fee calculation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core task and gig functionality
- ✅ User authentication and profiles
- ✅ Basic messaging system
- ✅ Payment integration

### Phase 2 (Upcoming)
- 🔄 Advanced search and filtering
- 🔄 Mobile app (React Native)
- 🔄 Push notifications
- 🔄 Advanced analytics

### Phase 3 (Future)
- 🔄 AI-powered matching
- 🔄 Video calling integration
- 🔄 Multi-language support
- 🔄 Advanced reporting

## 🌟 Acknowledgments

- **Supabase** for the amazing backend platform
- **Stripe** for secure payment processing
- **Tailwind CSS** for the utility-first CSS framework
- **React** team for the excellent framework
- **Vite** for the fast build tool

---

**Built with ❤️ for the local community**

For more information, visit our [documentation](https://docs.localgigs.com) or [contact us](mailto:support@localgigs.com).
