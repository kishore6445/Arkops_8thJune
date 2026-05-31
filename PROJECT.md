# Arkmedis Operating System

## What Is This?

Arkmedis OS is an **execution management system** built for Arkmedis, a multi-brand digital agency. It transforms the company's annual goals into daily actions that every team member can see, track, and execute.

The system answers one question every day: **"Are we winning or losing?"**

---

## The Problem It Solves

Most companies set annual goals and forget them. Teams work hard but lose sight of what actually moves the needle. By December, everyone realizes they missed targets set in January.

Arkmedis OS fixes this by:
- Breaking yearly goals into quarterly, monthly, weekly, and daily targets
- Making execution visible at every level (company, department, individual)
- Creating accountability through public scorecards
- Focusing teams on the 2-3 actions that actually drive results

---

## How It Works

### The 4DX Framework

The system is built on the "Four Disciplines of Execution" (4DX) methodology:

**1. Focus on the Wildly Important Goal (WIG)**
- Company WIG for 2026: "Acquire 40 new planned clients"
- Everything else is secondary

**2. Act on Lead Measures (Power Moves)**
- These are the repeatable actions that drive the WIG
- Examples: "Conduct 4 webinars per month", "Make 20 outreach calls per week"
- If you do the Power Moves, the results follow

**3. Keep a Compelling Scoreboard (Victory Targets)**
- Every department has 2-4 Victory Targets
- These are the outcomes that show if Power Moves are working
- Examples: "1500 qualified conversations", "100% client retention"

**4. Create a Cadence of Accountability (Weekly Reviews)**
- Weekly check-ins where teams report wins, misses, and commitments
- No hiding from the numbers

---

## The Three Brands

Arkmedis operates three distinct brands:

### Warrior Systems
- **Focus**: Business process automation and systems
- **Target Clients**: Established businesses needing operational efficiency
- **2026 Goal**: 30 new clients

### Story Marketing
- **Focus**: Brand storytelling and content marketing
- **Target Clients**: Businesses needing market positioning
- **2026 Goal**: 10 new clients

### Meta Gurukul
- **Focus**: Training and education programs
- **Target Clients**: Professionals seeking skill development
- **2026 Goal**: Supporting brand (no client acquisition target)

---

## The Seven Departments (MASTERY)

Each department has specific Victory Targets and Power Moves:

| Code | Department | Core Focus |
|------|------------|------------|
| **M** | Marketing | Generate qualified leads through content and campaigns |
| **A** | Accounts | Retain clients and manage financials |
| **S** | Sales | Convert leads to paying clients |
| **T** | Team Tools | Build SOPs and internal systems |
| **E** | Execution | Deliver client work on time and budget |
| **R** | R&D/Risk | Innovate offerings and manage business risks |
| **Y** | Leadership | Strategic direction and team development |

---

## Who Uses This System

### The CEO/Founder
- Opens the **War Dashboard** every morning
- Sees company score in 5 seconds: WINNING, AT RISK, or BEHIND
- Drills into departments that need attention
- Reviews quarterly client acquisition progress

### Department Heads
- Own their department's Victory Targets
- Assign Power Moves to team members
- Conduct weekly reviews
- Track execution streaks (consecutive weeks at 70%+ completion)

### Individual Contributors
- See their personal dashboard with assigned Power Moves
- Complete daily/weekly actions with one click
- Understand how their work connects to company goals
- Track personal execution score

### Administrators
- Manage users and permissions
- Configure Victory Targets and Power Moves
- Assign people to departments and brands
- Monitor system-wide performance

---

## The Scoring System

### How Status Is Calculated

Every Victory Target and Power Move gets a status based on completion percentage:

| Percentage | Status | Meaning |
|------------|--------|---------|
| 70%+ | **WINNING** | On track to hit targets |
| 50-69% | **AT RISK** | Needs attention, still recoverable |
| Below 50% | **BEHIND** | Requires immediate intervention |

### Department Score
- Calculated from Victory Target achievement
- Weighted average of all targets in the department
- Displayed as 0-100 with color coding

### Company Score
- Aggregated from all department scores
- Primary metric: Quarterly client acquisition vs plan
- Secondary: Department execution percentages

---

## All Application Pages

### 1. War Dashboard (`/`)
The CEO's command center. The first thing leadership sees every day.

**Features:**
- Company WIG Banner with year progress
- All Departments Status strip with 7 department icons showing color-coded status
- Critical Power Moves section highlighting at-risk lead measures
- Department Victory Targets grid with time period tabs (Annual/Q1/Q2/Q3/Q4)
- Social Accountability section showing team member execution scores
- Quarter selector to view historical performance

**Key Metrics Displayed:**
- Company execution score (0-100)
- WINNING/AT RISK/BEHIND status badge
- Green/Yellow/Red department count
- Per-department Target vs Achieved vs Gap

### 2. My Dashboard (`/dashboard`)
Personal execution view for individual contributors.

**Features:**
- User identity card with photo and role
- Personal execution score with period selector (Today/This Week/This Month/This Quarter)
- Power Moves table with completion buttons (+1 action)
- Tasks section with checkboxes and brand tags
- Commitments section with status tracking
- Victory Target linkage showing how your work connects to outcomes
- Section legend explaining Power Moves vs Tasks vs Commitments

**Key Metrics Displayed:**
- Personal completion percentage
- Completed vs Total power moves
- Priority indicators (Primary vs Supporting)
- Progress bars per power move

### 3. Department Pages (`/marketing`, `/sales`, `/accounts`, `/team`, `/execution`, `/rnd`, `/leadership`)
Department head view for managing team execution.

**Features:**
- Department Execution Hero with score circle and status badge
- Core Objective display
- Victory Targets section with progress bars and owner assignment
- Power Moves section with cadence (daily/weekly/monthly) and targets
- Tasks section with due dates and priorities
- Commitments section with team promises
- Weekly Review panel for logging wins/misses/blockers
- Execution streak counter (consecutive weeks at 70%+)
- Quarter and brand filters

**Key Metrics Displayed:**
- Department execution score (0-100)
- Victory Target achievement percentages
- Power Move completion rates
- On Track/At Risk/Behind status per item

### 4. Company Performance (`/performance`, `/company-review`)
Financial and client tracking dashboard.

**Features:**
- Quarter Score Card with WINNING/AT RISK/BEHIND status
- Quarterly Progress visualization
- Client Book table with all clients
- Add Client modal with origin selection (Existing/Planned/Bonus)
- Drop Client functionality with reason capture
- Brand split (Warrior Systems vs Story Marketing)
- Founder Verdict section with guidance
- Edit mode for client management

**Key Metrics Displayed:**
- Planned vs Actual new clients per quarter
- Total MRR and client count
- Client retention rate
- Brand-level breakdown

### 5. Vision 2026 Page
Annual planning and monthly tracking.

**Features:**
- Hero strip with year theme ("Foundation Year")
- The ONE Goal card
- Monthly data table with Planned vs Actual per brand
- Status badges per month (WINNING/AT RISK/BEHIND)
- Revenue projections (optional, admin-only)
- Trend visualization
- Quarter filter

**Key Metrics Displayed:**
- Monthly client acquisition targets
- WS (Warrior Systems) vs SM (Story Marketing) splits
- Cumulative progress
- Revenue calculations

### 6. Admin Panel (`/admin`)
System configuration and user management.

**Features:**
- User Management tab
  - Add/Edit/Disable users
  - Role assignment (super_admin, dept_admin, member, viewer)
  - Department permissions (admin, member, view)
  - Avatar upload
- Victory Target Management tab
  - Add/Edit/Delete Victory Targets
  - Set annual and quarterly targets
  - Assign owners
  - Link to departments
- Power Move Management tab
  - Add/Edit/Delete Power Moves
  - Set frequency (daily/weekly/monthly)
  - Set targets per cycle
  - Link to Victory Targets
  - Assign owners
- Brand Assignment Management tab
  - Assign users to brands
  - Set brand-level permissions
- Achievement Tracking tab
  - View milestones
  - Award badges

**User Roles:**
- **super_admin**: Full system access, can manage everything
- **dept_admin**: Can manage their department's data
- **member**: Can view and execute assigned Power Moves
- **viewer**: Read-only access

### 7. Daily Report Page (`/daily-report`)
Daily execution logging form.

**Features:**
- Date picker
- Power Moves completed today
- Wins captured
- Blockers faced
- Tomorrow's focus
- Submit and review history

---

## All Features by Category

### Execution Tracking

**Power Move Completion**
- One-click "+1" buttons to log completions
- Daily, weekly, and monthly tracking
- Auto-calculation of execution percentage
- Visual progress bars

**Victory Target Progress**
- Achieved vs Target tracking
- Percentage completion with color coding
- Quarterly breakdown support
- Owner assignment

**Execution Streaks**
- Tracks consecutive weeks at 70%+ completion
- Visual streak counter
- Best streak record
- Motivation for consistency

### Accountability

**Weekly Reviews**
- Structured format: Wins, Misses, Blockers
- Commitment capture for next week
- Historical review access
- Department-level tracking

**Commitments**
- Public promises made in meetings
- Due date tracking
- Completion status
- Link to Power Moves and Victory Targets

**Commitment Templates**
- Pre-built commitment suggestions
- Quick selection from common patterns
- Customizable text

**Social Accountability**
- Team member photos with scores
- Public leaderboard style display
- Peer visibility for motivation

### Navigation & Filtering

**Quarter Selector**
- Switch between Q1, Q2, Q3, Q4, and Annual views
- Persists across pages
- Affects all metrics displayed

**Time Period Selector**
- Today / This Week / This Month / This Quarter
- For individual dashboard granularity
- Filters Power Moves and Tasks

**Time Period Tabs**
- Horizontal tabs on War Dashboard Victory Targets
- Quick switching between Annual/Q1/Q2/Q3/Q4
- Shows period-specific targets and achievements

**Brand Switcher**
- Toggle between Warrior Systems, Story Marketing, Meta Gurukul
- Filters all data to selected brand
- Persistent across session

**Department Switcher**
- Quick navigation between 7 departments
- Color-coded department chips
- Accessible from any page

**Global Search**
- Search across Power Moves, Victory Targets, Tasks
- Keyboard shortcut support (Cmd+K)
- Quick navigation to results

### Modals & Forms

**Add/Edit User Modal**
- Name, email, role fields
- Department assignment with permissions
- Avatar upload
- Status toggle (active/invited/disabled)

**Add/Edit Power Move Modal**
- Name and description
- Frequency selection
- Target per cycle
- Owner assignment
- Victory Target linkage

**Add/Edit Victory Target Modal**
- Name and unit
- Annual target
- Quarterly breakdown
- Owner assignment
- Department assignment

**Create Task Modal**
- Title and description
- Due date picker
- Priority selection
- Brand assignment
- Power Move linkage (optional)

**Create Commitment Modal**
- Title
- Due date
- Owner
- Linked Power Move (optional)

**Quick Commitment Modal**
- Fast entry version
- Template selection
- One-click creation

**Victory Target Detail Modal**
- Full details view
- Linked Power Moves list
- Historical progress chart
- Edit capabilities

**Daily Check-In Modal**
- Quick status update
- Power Moves completed today
- Blockers encountered

### Visualizations

**BPR Scorecard**
- Business Performance Review card
- Green/Yellow/Red scoring
- Score circle with percentage

**Progress Bars**
- Horizontal bars showing completion
- Color-coded by status
- Animated on load

**Trend Sparklines**
- Mini charts showing trend over time
- Week-over-week comparison
- Embedded in cards

**Animated Numbers**
- Count-up animation for metrics
- Smooth transitions on data change

**Animated Progress**
- Progress bars that animate to final value
- Visual feedback on completion

### Gamification

**Achievement Badges**
- Milestone recognition
- Unlockable achievements
- Display on profile

**Micro Celebrations**
- Confetti animation on completion
- Success messages
- Positive reinforcement

**Wins Celebration Panel**
- Highlights recent wins
- Team-wide visibility
- Morale boost

**Execution Streak Display**
- Current streak number
- Best streak record
- Visual streak indicator

### Intelligence & Suggestions

**Lead Measure Intelligence**
- Analyzes Power Move patterns
- Suggests improvements
- Identifies at-risk measures

**Lead Measure Suggestions**
- AI-suggested Power Moves
- Based on Victory Target gaps
- Recommended actions

**Commitment Quality Checker**
- Validates commitment clarity
- Suggests improvements
- Ensures actionable commitments

### Export & Reporting

**Export Buttons**
- Export to CSV
- Export to PDF
- Print-friendly views

**Daily Report Card**
- Summarized daily view
- Shareable format
- Key metrics only

**Executive Summary Card**
- High-level overview
- For leadership meetings
- Printable format

### UI Components

**Skeleton Loaders**
- Loading states for all sections
- Maintains layout during load
- Professional polish

**Empty States**
- Friendly messages when no data
- Call-to-action buttons
- Guides user next steps

**Confirmation Dialogs**
- Before destructive actions
- Clear messaging
- Cancel option

**Breadcrumbs**
- Navigation trail
- Current location indicator
- Quick back navigation

**Keyboard Shortcuts**
- Power user efficiency
- Cmd+K for search
- Navigation shortcuts

### Layout & Shell

**App Shell**
- Consistent wrapper
- Sidebar + main content
- Responsive design

**Mastery Sidebar**
- Collapsible navigation
- Department links
- Brand indicator
- User profile

**Module Layout**
- Consistent page structure
- Header + content areas
- Padding and spacing

**Skip Link**
- Accessibility feature
- Skip to main content
- Keyboard navigation

### Theme & Providers

**Theme Provider**
- Light/dark mode support
- System preference detection
- Persistent preference

**Providers Wrapper**
- Context providers
- User context
- Brand context

---

## Data Types

### Victory Target
- **id**: Unique identifier
- **name**: Display name (e.g., "Qualified Conversations")
- **target**: Annual target number
- **achieved**: Current achieved number
- **unit**: Measurement unit (conversations, clients, %)
- **owner**: Assigned person
- **status**: on-track / at-risk / behind
- **quarters**: Q1-Q4 breakdown with targets and achieved

### Power Move
- **id**: Unique identifier
- **name**: Action name (e.g., "Webinars Conducted")
- **frequency**: daily / weekly / monthly
- **target**: Target per cycle
- **actual**: Completed this cycle
- **owner**: Assigned person
- **linkedVictoryTarget**: Which Victory Target this drives
- **dailyTarget/Actual**: Daily tracking
- **weeklyTarget/Actual**: Weekly tracking
- **monthlyTarget/Actual**: Monthly tracking
- **quarterlyTarget/Actual**: Quarterly tracking

### Task
- **id**: Unique identifier
- **title**: Task description
- **dueDate**: When it's due
- **owner**: Assigned person
- **status**: pending / in-progress / completed
- **priority**: high / medium / low
- **brand**: Which brand it belongs to
- **linkedPowerMove**: Optional connection

### Commitment
- **id**: Unique identifier
- **title**: Promise made
- **dueDate**: When it's due
- **owner**: Who made the commitment
- **status**: pending / completed
- **linkedPowerMove**: Optional connection
- **linkedVictoryTarget**: Optional connection

### Client
- **id**: Unique identifier
- **name**: Client/company name
- **monthlyFee**: MRR from this client
- **brand**: Warrior Systems / Story Marketing
- **joinMonth**: When they joined
- **origin**: Existing / Planned / Bonus
- **status**: active / dropped
- **dropMonth**: If dropped, when
- **dropReason**: If dropped, why

### User
- **id**: Unique identifier
- **name**: Full name
- **email**: Email address
- **role**: super_admin / dept_admin / member / viewer
- **status**: active / invited / disabled
- **avatar**: Profile photo URL
- **departments**: Array of department assignments with permissions

### Weekly Review
- **id**: Unique identifier
- **date**: Review date
- **wins**: What went well
- **misses**: What didn't go well
- **blockers**: What's in the way
- **commitments**: Promises for next week

---

## The 2026 Goal

**Exit 2026 with 40 paying clients generating 12L MRR**

### Quarterly Breakdown

| Quarter | Planned New Clients | Cumulative |
|---------|---------------------|------------|
| Q1 | 0 (Baseline) | 0 |
| Q2 | 10 | 10 |
| Q3 | 10 | 20 |
| Q4 | 10 | 30 |

### Revenue Math
- Average client value: 30,000/month
- 40 clients x 30,000 = 12,00,000 MRR
- Annual target: 1.44 Cr

---

## Daily Workflow

### Morning (CEO)
1. Open War Dashboard
2. Check company status badge
3. Review any departments showing AT RISK or BEHIND
4. Click into Critical Power Moves to see what's lagging

### Throughout Day (Team Members)
1. Open My Dashboard
2. See today's Power Moves
3. Complete actions and click "+1" to log
4. Check if execution score is above 70%

### Weekly (Department Heads)
1. Conduct Weekly Review meeting
2. Log wins, misses, and blockers
3. Capture commitments for next week
4. Ensure team is maintaining execution streak

### Monthly (Leadership)
1. Review Company Performance page
2. Analyze client acquisition vs plan
3. Adjust Power Move targets if needed
4. Celebrate wins, address gaps

---

## File Structure Overview

```
app/
  page.tsx              # War Dashboard (/)
  dashboard/page.tsx    # My Dashboard
  marketing/page.tsx    # Marketing Department
  sales/page.tsx        # Sales Department
  accounts/page.tsx     # Accounts Department
  team/page.tsx         # Team Tools Department
  execution/page.tsx    # Execution Department
  rnd/page.tsx          # R&D/Risk Department
  leadership/page.tsx   # Leadership Department
  performance/page.tsx  # Company Performance
  company-review/page.tsx # Company Review
  daily-report/page.tsx # Daily Report Form
  admin/page.tsx        # Admin Panel
  layout.tsx            # Root layout
  globals.css           # Global styles

components/
  # Dashboards
  war-dashboard.tsx
  individual-dashboard.tsx
  department-page.tsx
  company-performance.tsx
  vision-2026.tsx
  
  # Execution
  power-move-card.tsx
  power-moves-table.tsx
  victory-targets-scoreboard.tsx
  accountability-sections.tsx
  execution-streak.tsx
  
  # Forms & Modals
  add-edit-user-modal.tsx
  create-task-modal.tsx
  create-commitment-modal.tsx
  weekly-review-session.tsx
  daily-check-in-modal.tsx
  
  # Navigation
  mastery-sidebar.tsx
  breadcrumbs.tsx
  quarter-selector.tsx
  brand-switcher.tsx
  
  # Admin
  admin/power-move-management.tsx
  admin/victory-target-management.tsx
  admin/brand-assignment-management.tsx
  admin/achievement-tracking.tsx
  
  # UI (shadcn)
  ui/button.tsx
  ui/card.tsx
  ui/badge.tsx
  ... (50+ shadcn components)

lib/
  brand-structure.ts    # All mock data and type definitions
  score-calculations.ts # BPR scoring logic
  status-system.ts      # WINNING/AT RISK/BEHIND utilities
  bpr-status.ts         # Business Performance Review helpers
  user-context.tsx      # User state management
  brand-context.tsx     # Brand selection state

hooks/
  use-app-mode.ts       # Execute vs Setup mode
  use-toast.ts          # Toast notifications
  use-mobile.ts         # Mobile detection
  use-unsaved-changes.ts # Form dirty state
  use-url-state.ts      # URL-based state
```

---

## Key Concepts Explained

### Victory Targets vs Power Moves

| Victory Targets | Power Moves |
|-----------------|-------------|
| Lag measures (results) | Lead measures (actions) |
| "What we want to achieve" | "What we do to get there" |
| Example: "150 qualified leads" | Example: "Post 3 LinkedIn articles/week" |
| Measured monthly/quarterly | Measured daily/weekly |
| Owned by department heads | Owned by individuals |

### Commitments vs Tasks

| Commitments | Tasks |
|-------------|-------|
| Promises made in weekly calls | One-time activities |
| Public accountability | Personal tracking |
| "I will complete X by Friday" | "Finish client proposal" |
| Reviewed every week | Completed and checked off |

### Execute Mode vs Setup Mode

| Execute Mode | Setup Mode |
|--------------|------------|
| Default view for daily work | Configuration view for admins |
| Complete Power Moves | Add/edit Victory Targets |
| Track progress | Assign Power Moves to people |
| Review scores | Configure department structure |

---

## Current Status

**This is currently a UI-only prototype.** All data is mocked in TypeScript files. There is no backend, no database, and no authentication.

### What Exists
- Complete UI for all pages
- All navigation working
- Mock data populating all views
- Scoring calculations
- Status system
- All modals and forms (UI only)

### What Does NOT Exist Yet
- Database (planned: PostgreSQL via Prisma)
- Authentication (planned: Supabase Auth or custom)
- API routes / Server Actions
- Real data persistence
- User sessions
- Real-time updates

### Planned Backend Stack
- **Database**: PostgreSQL (Supabase or Neon)
- **ORM**: Prisma
- **Caching**: Redis (Upstash)
- **Queries**: TanStack Query
- **Mutations**: Server Actions
- **Auth**: Supabase Auth or custom with bcrypt

---

## Why "Operating System"?

An operating system runs in the background, making everything else work. Arkmedis OS does the same for business execution:

- **Always On**: The scoreboard updates in real-time
- **Invisible Complexity**: Complex calculations happen behind simple numbers
- **Universal Interface**: Everyone uses the same system, same language
- **Reliable**: If you follow the system, results are predictable

The goal is simple: **Remove guesswork from execution.**

---

## Success Metrics

The system is working when:

1. **Every team member** can state the company WIG from memory
2. **Weekly reviews** happen consistently with 90%+ attendance
3. **Power Move completion** stays above 70% for 4+ consecutive weeks
4. **No surprises** at quarter end - everyone knows the score throughout
5. **Client acquisition** tracks within 10% of quarterly plan

---

*Arkmedis OS: Where strategy meets daily action.*
