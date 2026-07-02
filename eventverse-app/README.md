# EventVerse - AI-Powered Event Planning Platform

A modern event planning application with AI-powered blueprints, task management, and integrated e-commerce.

## Features

- 🎉 **AI Event Planning** - Generate personalized event blueprints with Gemini AI
- 📅 **Event Management** - Track tasks, timeline, and shopping lists
- 🛍️ **Product Catalog** - 79+ event products across multiple categories
- 💳 **E-Commerce** - Full shopping cart and checkout functionality
- 📊 **Dashboard** - Real-time event progress tracking

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini Pro
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Database Setup
In Supabase SQL Editor, run:
1. `lib/supabase/complete-setup.sql` (schema setup)
2. `lib/supabase/FINAL-EXACT-IMAGES.sql` (product data)

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── (auth)/              # Authentication pages
├── (customer)/          # Customer pages
│   ├── dashboard/       # Dashboard
│   ├── events/          # Event management
│   └── shop/            # E-commerce
└── api/                 # API routes

components/
├── events/              # Event components
├── shop/                # Shop components
└── ui/                  # UI components

lib/
├── ai/                  # AI integration
├── commerce/            # Commerce logic
├── events/              # Event logic
└── supabase/            # Database
```

## Key Features

### AI Event Blueprints
Provide event details → Get personalized:
- Task checklist with deadlines
- Timeline milestones
- Shopping list recommendations

### Product Catalog
- Event-specific products (Birthday, Wedding, Corporate, etc.)
- Category filtering
- Stock management
- "Buy Now" quick checkout

### Event Dashboard
- Progress tracking
- Budget monitoring
- Task completion
- Shopping status

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Lint code
```

## Database Schema

Three-phase setup:
1. **Core** - Auth and users
2. **Events** - Planning and AI
3. **Commerce** - Products and orders

All included in `complete-setup.sql`.

## License

MIT
