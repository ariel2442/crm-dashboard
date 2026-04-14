# CRM Dashboard Architecture Guide

## Overview

This refactored CRM Dashboard is built with a **modular, component-driven architecture** that emphasizes:
- **Separation of Concerns**: Data, styling, and UI logic are cleanly separated
- **Reusability**: Components are designed to be used across multiple pages
- **Maintainability**: Easy to find, update, and extend features
- **Scalability**: Simple to add new dashboards or components

## Directory Structure Explained

### 🎯 Root Level Files
```
├── index.html          # HTML entry point
├── vite.config.js      # Build configuration
├── package.json        # Dependencies and scripts
├── README.md           # User-facing documentation
└── .gitignore          # Git ignore rules
```

### 📦 src/constants/
**Purpose**: Centralized configuration and theme

- **colors.js**: Complete theme/design system
  - All color variables (background, primary, accent, text)
  - Font family definition
  - Used by: All components via imports

### 📊 src/data/
**Purpose**: Application data layer

- **mock-data.js**: Sample/mock data
  - Months, revenue, expenses, leads
  - Deals and transaction data
  - Sales channels information
  - Used by: All dashboard components

- **navigation.js**: Navigation configuration
  - Sidebar menu structure and groups
  - Page metadata (titles, icons, descriptions)
  - Color associations per page
  - Used by: Sidebar, Topbar, Placeholder components

### 🎨 src/styles/
**Purpose**: Global styling and animations

- **global.js**: Global CSS as JavaScript string
  - Font imports
  - CSS reset and base styles
  - Animation definitions (@keyframes)
  - Utility classes (.fu, .hov, .bar, .grid-bg)
  - Used by: App.jsx (injected into <style> tag)

### 🛠️ src/utils/
**Purpose**: Helper functions and utilities

- **helpers.js**: Utility functions
  - `formatCurrency()`: Format numbers as Israeli Shekel
  - `getColor()`: Lookup color from COLORS object
  - Used by: Dashboard components for data formatting

### 🧩 src/components/

#### shared/
**Reusable UI components used across dashboards**

- **Badge.jsx** (11 lines)
  - Simple label with background color
  - Props: label, colorKey
  - Example: Status badges, type indicators

- **MiniBar.jsx** (18 lines)
  - Horizontal progress/metric bar
  - Props: pct (0-100), colorKey, h (height)
  - Example: Progress bars, percentage displays

- **SectionTitle.jsx** (23 lines)
  - Section header with optional subtitle
  - Props: children, sub
  - Example: "Revenue Chart" with "6 months" subtitle

- **Stat.jsx** (46 lines)
  - KPI card with icon and metrics
  - Props: label, val, sub, icon, colorKey, delay, glow
  - Example: "₪89,000 Revenue" with animation

- **BarChart.jsx** (48 lines)
  - Vertical bar chart component
  - Props: data (array), labels (array), colorKey, h, target
  - Example: Monthly income/expense chart

- **DonutChart.jsx** (38 lines)
  - SVG-based donut/pie chart
  - Props: segments (array), size
  - Example: Channel distribution pie chart

#### layouts/
**Page structure and navigation components**

- **Sidebar.jsx** (220 lines)
  - Left navigation panel (collapsible)
  - Features: Groups, badges, collapse animation
  - Props: page, setPage
  - Uses: NAV_GROUPS from navigation.js

- **Topbar.jsx** (96 lines)
  - Top header with page info and alerts
  - Shows: Page title, icon, greeting, notifications
  - Props: page
  - Uses: PAGE_META from navigation.js

- **Placeholder.jsx** (42 lines)
  - "Coming Soon" page for in-development features
  - Used for: Leads, Deals, Projects, Settings, etc.
  - Props: page

#### dashboards/
**Individual dashboard pages**

- **DashOverview.jsx** (400+ lines)
  - Main/summary dashboard
  - Sections: KPIs, revenue chart, alerts, pipeline, top leads, targets
  - Uses: Stat, SectionTitle, MiniBar, mock-data

- **DashMarketing.jsx** (350+ lines)
  - Marketing metrics dashboard
  - Sections: KPIs, leads over time, channels, conversion funnel, campaigns
  - Uses: Stat, BarChart, DonutChart, MiniBar, CHANNELS data

- **DashSales.jsx** (400+ lines)
  - Sales pipeline and deals dashboard
  - Sections: KPIs, pipeline stages, deals table, lead scoring, win rates
  - Uses: Stat, Badge, BarChart, MiniBar, DEALS and LEADS data

- **DashFinance.jsx** (400+ lines)
  - Financial overview dashboard
  - Sections: KPIs, cash flow, expense breakdown, transactions, profit margins
  - Uses: Stat, Badge, BarChart, DonutChart, MiniBar, TXNS data

### src/App.jsx
**Main application component**

- Imports all sub-components
- Manages page state (which dashboard to show)
- Injects global CSS
- Implements routing logic: `renderPage()`
- Returns layout structure: Sidebar → Topbar → Content

### src/index.jsx
**Application entry point**

- Mounts React app to DOM (#root)
- Renders App component

## Data Flow

```
                    App.jsx
                       |
        ________________|_____________________
        |                                      |
     Sidebar.jsx                        Topbar.jsx
        |                                    |
   NAV_GROUPS               →          PAGE_META
   (from navigation.js)                (from navigation.js)
        |
   setPage() ────→ page state
                       |
                   renderPage()
                       |
        ________________|_____________________
        |        |        |         |
   DashO.jsx  DashM.jsx  DashS.jsx DashF.jsx
        |        |        |         |
   (uses mock-data.js and components/shared/)

```

## Component Hierarchy

```
App
├── <style>{GLOBAL_CSS}</style>
├── Sidebar
│   └── Button × NAV_ITEMS
├── Topbar
│   └── uses PAGE_META[page]
└── [Active Dashboard]
    ├── Stat (multiple)
    ├── SectionTitle
    ├── BarChart/DonutChart
    ├── Badge
    └── MiniBar
```

## How to Extend

### Add a New Dashboard
1. Create `src/components/dashboards/DashNewSection.jsx`
2. Import shared components
3. Import data from `src/data/mock-data.js`
4. Export a React component
5. Add to `navigation.js` NAV_GROUPS and PAGE_META
6. Import and add rendering logic to `App.jsx`

### Add a New Shared Component
1. Create `src/components/shared/NewComponent.jsx`
2. Use `COLORS` from constants/colors.js
3. Accept props for customization
4. Export and import in dashboards that need it

### Change the Theme
1. Edit `src/constants/colors.js`
2. Add/modify color definitions
3. All components automatically reflect changes

### Update Data
1. Edit `src/data/mock-data.js`
2. All dashboards automatically display new data
3. No component changes needed

## Performance Considerations

- Components are **stateless** (receive props, render UI)
- State management is minimal (only active page in App)
- Animations use CSS (@keyframes) for 60fps performance
- Can implement React.memo() for optimization if needed
- Ready for API integration (replace mock-data with API calls)

## RTL (Right-to-Left) Support

The app is fully optimized for Hebrew:
- `direction: rtl` in global styles
- All layouts use flexbox for automatic RTL flipping
- Text naturally flows right-to-left
- Navigation items right-aligned

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires React 18+
- Uses CSS Grid and Flexbox

## Next Steps

To continue development:

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Make changes** to components in `src/`
4. **Hot reload** automatically applies changes
5. **Build for production**: `npm run build`

The architecture is designed for easy iteration and feature addition!
