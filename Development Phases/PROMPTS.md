# EventVerse Development Prompts

This document contains all the key prompts used during the development of EventVerse across all 8 phases.

---

## Phase 1: Foundation Setup

### Initial Project Setup
```
Create a Next.js 14 application with:
- TypeScript
- App Router
- Tailwind CSS
- Supabase integration
- Authentication with Supabase Auth
- Protected routes using middleware
- Basic layout with sidebar navigation
```

### Authentication Setup
```
Implement Supabase authentication with:
- Email/password signup
- Login functionality
- Session management
- Protected route middleware
- User profile storage
```

---

## Phase 2: Core Event Planning

### AI Event Blueprint Generator
```
Create an AI-powered event planning feature using Google Gemini that:
1. Takes user input (event type, date, budget, guest count)
2. Generates a comprehensive event blueprint including:
   - Detailed task checklist with deadlines
   - Timeline milestones
   - Budget breakdown by category
   - Shopping recommendations
3. Stores the blueprint in the database
4. Creates individual tasks linked to the event
```

### AI Prompt Template
```
You are an expert event planner. Create a detailed event plan for:
- Event Type: {eventType}
- Date: {date}
- Budget: ${budget}
- Guest Count: {guestCount}
- Special Requirements: {requirements}

Generate a comprehensive plan with:
1. Task list (15-20 tasks) with titles, descriptions, deadlines, and priorities
2. Timeline milestones (5-7 key dates)
3. Budget breakdown across categories
4. Shopping list recommendations

Return as JSON format.
```

### Event Dashboard
```
Build an event dashboard that displays:
- Event overview with key details
- Progress tracking with percentage completion
- Upcoming tasks sorted by deadline
- Budget summary with visual indicators
- Quick action buttons (add task, update status)
- Timeline view of milestones
```

---

## Phase 3: Marketplace & Commerce

### Product Catalog
```
Create a product marketplace with:
- 79+ products across 6 categories
- Category filtering
- Event-type specific filtering
- Search functionality
- Product cards with images
- Add to cart functionality
- Wishlist feature
- "Buy Now" quick checkout
```

### Shopping Cart
```
Implement shopping cart with:
- Add/remove products
- Quantity adjustment
- Real-time total calculation
- Persist cart in database
- Cart icon with item count
- Smooth animations for updates
```

### Database Schema for Products
```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL,
  event_types text[] NOT NULL,
  price decimal(10,2) NOT NULL,
  stock integer NOT NULL,
  image_url text,
  description text,
  created_at timestamp DEFAULT now()
);
```

---

## Phase 4: Venue Explorer & Invitations

### Venue Catalog
```
Build a venue explorer with:
- Database of 525+ real venues
- Venue cards with images
- Filtering by location, capacity, price range
- Amenities listing
- Event type suitability tags
- Detailed venue pages
- Booking inquiry system
```

### AI Invitation Card Generator
```
Create an AI-powered invitation card generator that:
1. Takes user input:
   - Event details (name, date, location)
   - Theme preferences
   - Color scheme
   - Custom message
2. Uses Google Gemini to generate SVG card design
3. Displays preview
4. Allows download
```

### AI Card Generation Prompt
```
Create an SVG invitation card design for:
- Event: {eventName}
- Type: {eventType}
- Date: {date}
- Location: {location}
- Theme: {theme}
- Colors: {colorScheme}
- Message: {message}

Generate elegant SVG code with:
- Appropriate layout for the event type
- Decorative elements matching the theme
- Clear text hierarchy
- Responsive design (800x1000px)

Return only valid SVG code.
```

### Video Invitation Creator
```
Build a video invitation generator that:
- Accepts 10 photos from user
- Creates slideshow with Canvas API
- Adds transitions between photos
- Includes event details overlay
- Renders as video file
- Provides download option
```

---

## Phase 5: Budget & Guest Management

### Budget Tracker
```
Create a comprehensive budget tracking system with:
- Category-based budget allocation
- Real-time expense tracking
- Visual analytics with charts (Recharts)
- Budget vs. actual comparison
- Spending alerts
- Export functionality
- Progress indicators per category
```

### Budget Categories
```
Default budget categories:
1. Venue (30-40% of budget)
2. Catering (20-30%)
3. Decorations (10-15%)
4. Entertainment (10-15%)
5. Invitations (5-10%)
6. Miscellaneous (5-10%)
```

### Guest Management
```
Build guest list management with:
- Add/edit/delete guests
- RSVP status tracking (pending, confirmed, declined)
- Dietary preferences
- Special requirements
- Plus-one management
- Contact information
- Guest categorization
- Export guest list
```

---

## Phase 6: Specialized Modules

### Design Studio
```
Create an AI Design Studio with:
- Image generation using AI
- Custom design templates
- Theme customization
- Color palette generator
- Mood board creator
- Save and export designs
```

### Decoration Planner
```
Build decoration planner with:
- Browse decoration ideas by event type
- Theme templates (Modern, Classic, Rustic, etc.)
- Color scheme planner
- Visual mood boards
- Shopping list integration
- Save favorite decorations
```

---

## Phase 7: Memory Vault & Admin Panel

### Memory Vault
```
Create post-event memory storage with:
- Photo upload functionality
- AI-powered photo organization
- Facial recognition grouping
- Event timeline reconstruction
- Share memories with guests
- Album creation
- Download capabilities
```

### Admin Dashboard
```
Build admin panel with:
- User statistics and analytics
- Order tracking and management
- Revenue reporting with charts
- Product management (CRUD)
- User management
- System health monitoring
- Platform-wide analytics
```

### System Monitoring
```
Implement monitoring system with:
- Health check endpoint
- Database connection status
- API availability
- Error rate tracking
- Performance metrics
- Uptime monitoring
```

---

## Phase 8: Final Integration & Launch

### Database Optimization
```
Optimize database with:
- Create 30+ indexes on frequently queried columns
- Add materialized views for analytics
- Implement query performance tuning
- Set up connection pooling
- Add database-level constraints
```

### Performance Optimization
```sql
-- Example indexes
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_tasks_event_id ON tasks(event_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Materialized view for analytics
CREATE MATERIALIZED VIEW event_analytics AS
SELECT 
  event_type,
  COUNT(*) as total_events,
  AVG(budget) as avg_budget,
  AVG(guest_count) as avg_guests
FROM events
GROUP BY event_type;
```

### Error Handling System
```
Implement comprehensive error handling:
- Global error boundary component
- API error responses with proper codes
- User-friendly error messages
- Error logging system
- Retry mechanisms
- Fallback UI states
```

### Deployment Preparation
```
Prepare for deployment:
1. Environment variable configuration
2. Build optimization
3. Security audit
4. Performance testing
5. Create deployment guide
6. Set up monitoring
7. Configure CI/CD pipeline
8. Database backup strategy
```

---

## AI Prompts Library

### Event Planning Prompt (Detailed)
```
You are an expert event planner with 20 years of experience. Create a comprehensive event plan.

Event Details:
- Type: {eventType}
- Date: {date}
- Budget: ${budget} USD
- Guest Count: {guestCount}
- Location: {location}
- Special Requirements: {requirements}

Please provide:

1. TASK CHECKLIST (15-20 tasks)
   For each task include:
   - Title (concise, action-oriented)
   - Description (2-3 sentences)
   - Deadline (relative to event date)
   - Priority (high, medium, low)
   - Category (planning, booking, preparation, day-of)

2. TIMELINE MILESTONES (5-7 key dates)
   - Milestone name
   - Target date (relative to event)
   - Description

3. BUDGET BREAKDOWN
   - Category name
   - Recommended allocation percentage
   - Estimated amount
   - Notes

4. SHOPPING LIST (10-15 items)
   - Item name
   - Category
   - Quantity estimate
   - Priority

Return as valid JSON in this exact format:
{
  "tasks": [...],
  "timeline": [...],
  "budget_breakdown": [...],
  "shopping_list": [...]
}
```

### Invitation Card Design Prompt
```
Create an elegant SVG invitation card design.

Event Information:
- Event Name: {eventName}
- Event Type: {eventType}
- Date: {date}
- Time: {time}
- Location: {location}
- Host: {hostName}

Design Preferences:
- Theme: {theme} (e.g., Modern, Classic, Rustic, Elegant)
- Color Scheme: {colors} (primary and accent colors)
- Style: {style} (Formal, Casual, Fun, Professional)
- Custom Message: {message}

Requirements:
- SVG dimensions: 800x1000px
- Include decorative elements matching the theme
- Clear text hierarchy
- Readable fonts
- Border or frame design
- Background pattern or gradient
- All text must be legible

Return only valid SVG code without explanations.
```

---

## Testing Prompts

### Feature Testing
```
Test the following feature:
1. Navigate to [feature page]
2. Perform [action]
3. Verify [expected result]
4. Check [edge cases]
5. Test [error scenarios]
```

### Database Query Testing
```sql
-- Test event creation with all related data
SELECT e.*, 
       COUNT(t.id) as task_count,
       COUNT(g.id) as guest_count,
       SUM(b.allocated_amount) as total_budget
FROM events e
LEFT JOIN tasks t ON e.id = t.event_id
LEFT JOIN guests g ON e.id = g.event_id
LEFT JOIN budgets b ON e.id = b.event_id
WHERE e.user_id = 'test-user-id'
GROUP BY e.id;
```

---

## Troubleshooting Prompts

### Debug Common Issues
```
When encountering [error]:
1. Check [potential cause 1]
2. Verify [potential cause 2]
3. Test [solution 1]
4. If persists, try [solution 2]
5. Log [relevant data] for analysis
```

### Performance Issues
```
If page loads slowly:
1. Check database query performance
2. Verify image optimization
3. Review network requests
4. Check for unnecessary re-renders
5. Implement code splitting
6. Add loading states
```

---

## Documentation Prompts

### API Documentation Template
```
Endpoint: [METHOD] /api/[route]

Description: [What this endpoint does]

Authentication: [Required/Optional]

Parameters:
- [param1]: [type] - [description]
- [param2]: [type] - [description]

Request Body:
{
  "field1": "value",
  "field2": "value"
}

Response:
{
  "success": true,
  "data": {...}
}

Error Responses:
- 400: [Bad Request reason]
- 401: [Unauthorized reason]
- 500: [Server Error reason]

Example:
[code example]
```

---

**Last Updated:** Phase 8 Complete  
**Version:** 1.0
