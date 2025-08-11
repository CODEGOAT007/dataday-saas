# MyDataday - Your Personal Goal Achievement App

> Your personal goal achievement app with social accountability. Track progress, get AI coaching, activate your Emergency Support Team.

## 🚀 Overview

MyDataday is a Next.js 14 PWA that revolutionizes goal achievement through our unique **Emergency Support Team** system. We activate your family and friends when you need support, ensuring 90%+ success rates for personal goals.

### Key Features

- **Social Accountability Network**: 5 key people in your life who support your success
- **AI Progress Support Team**: Personalized coaching with rotating AI personas
- **Human Backup Support**: Real humans for planning sessions and crisis intervention
- **Multi-tier Pricing**: $35/$65/$120/$200 plans with escalating support levels
- **PWA Capabilities**: Works offline, installable, push notifications
- **Real-time Updates**: Live progress tracking and notifications

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL) → Neon migration path
- **Authentication**: Supabase Auth with JWT signing keys
- **AI**: OpenAI GPT-4 (primary), Claude (fallback), Together AI (cost optimization)
- **State Management**: Zustand, TanStack Query
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (frontend), Railway (backend services)

### Performance Targets

- **Lighthouse PWA Score**: 95+
- **First Contentful Paint**: <1.2s
- **API Response Time**: <200ms
- **Uptime**: 99.99%

## 📁 Project Structure

```
mydataday/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── dashboard/                # Main dashboard
│   ├── goals/                    # Goal management
│   ├── logs/                     # Daily logging
│   ├── onboarding/               # User onboarding
│   ├── admin/                    # Admin dashboard
│   └── api/                      # API routes
│       ├── auth/
│       ├── goals/
│       ├── logs/
│       ├── ai/
│       └── notifications/
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── goals/                    # Goal-related components
│   ├── logs/                     # Logging components
│   ├── onboarding/               # Onboarding flow
│   ├── admin/                    # Admin components
│   ├── layout/                   # Layout components
│   └── providers/                # Context providers
├── lib/                          # Utility libraries
│   ├── supabase.ts              # Supabase client
│   ├── ai.ts                    # AI service abstraction
│   ├── notifications.ts         # Notification system
│   └── utils.ts                 # General utilities
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts              # Authentication hook
│   ├── use-goals.ts             # Goals management
│   ├── use-logs.ts              # Logging functionality
│   └── use-ai-chat.ts           # AI chat interface
├── types/                        # TypeScript definitions
│   ├── supabase.ts              # Database types
│   └── index.ts                 # General types
├── tests/                        # Test files
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── api/
└── public/                       # Static assets
    ├── icons/                    # PWA icons
    ├── screenshots/              # PWA screenshots
    └── manifest.json             # PWA manifest
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/mydataday.git
   cd mydataday
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Run Supabase migrations
   npx supabase db reset
   npx supabase migration up
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API routes and database interactions
- **E2E Tests**: Complete user workflows (planned)

## 📊 Database Schema

### Core Tables

- **users**: User profiles and preferences
- **goals**: User goals and settings
- **daily_logs**: Daily progress entries
- **emergency_support_team**: Social accountability network
- **interactions**: AI and human interactions
- **escalation_logs**: Escalation system tracking
- **planning_sessions**: Scheduled support sessions

### Key Relationships

- Users have many Goals
- Goals have many Daily Logs
- Users have many Emergency Support Team members
- All interactions are logged for analytics

## 🤖 AI Integration

### Multi-Provider Strategy

1. **OpenAI GPT-4**: Primary for user-facing interactions
2. **Claude**: Fallback for reliability
3. **Together AI**: Cost optimization for bulk operations

### AI Personas

- **Coach**: Encouraging and direct
- **Friend**: Supportive and understanding  
- **Mentor**: Wise and strategic

## 🔐 Security

- **Authentication**: Supabase Auth with JWT signing keys
- **Authorization**: Row-level security (RLS)
- **Data Protection**: Encryption at rest and in transit
- **Privacy**: GDPR compliance ready

## 🚀 Deployment

### Vercel (Recommended)

```bash
# One-time setup
npm run vercel:login
npm run vercel:link

# Fast, production deploy
npm run deploy

# Force rebuild deploy
npm run deploy:force
```

- Primary domain: https://mydataday.app
- Inspect latest deploys in Vercel dashboard via `npx vercel open` or the Inspect link printed in CLI.

### Environment Variables

Set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## 📈 Monitoring

- **Analytics**: Vercel Analytics + PostHog
- **Error Tracking**: Sentry
- **Performance**: Core Web Vitals monitoring
- **Uptime**: Built-in health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure accessibility compliance
- Maintain performance budgets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.mydataday.app](https://docs.mydataday.app)
- **Issues**: [GitHub Issues](https://github.com/your-org/mydataday/issues)
- **Discord**: [Community Server](https://discord.gg/mydataday)
- **Email**: support@mydataday.app

---

**Built with ❤️ by the MyDataday team**

*Making sure your goals happen, so you can celebrate the success.*
