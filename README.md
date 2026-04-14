# WebCRM Dashboard - Refactored & Organized

A beautiful, modern React CRM dashboard with 4 specialized dashboards for Overview, Marketing, Sales, and Finance metrics.

## Project Structure

```
src/
├── index.jsx                 # Application entry point
├── App.jsx                   # Main app component with routing
│
├── constants/
│   └── colors.js            # Theme colors and typography constants
│
├── data/
│   ├── mock-data.js         # Sample data for all dashboards
│   └── navigation.js        # Navigation configuration and page metadata
│
├── styles/
│   └── global.js            # Global CSS, animations, and utilities
│
├── utils/
│   └── helpers.js           # Utility functions (formatting, colors)
│
└── components/
    ├── shared/              # Reusable components
    │   ├── Badge.jsx        # Label badges with color variants
    │   ├── MiniBar.jsx      # Horizontal progress/metric bar
    │   ├── Stat.jsx         # KPI stat card with icon
    │   ├── SectionTitle.jsx # Section header component
    │   ├── BarChart.jsx     # Vertical bar chart
    │   └── DonutChart.jsx   # SVG-based donut/pie chart
    │
    ├── layouts/             # Layout components
    │   ├── Sidebar.jsx      # Left navigation sidebar (collapsible)
    │   ├── Topbar.jsx       # Top header with page info
    │   └── Placeholder.jsx  # Placeholder for in-development pages
    │
    └── dashboards/          # Dashboard pages
        ├── DashOverview.jsx # Summary/main dashboard
        ├── DashMarketing.jsx# Marketing metrics
        ├── DashSales.jsx    # Sales pipeline & deals
        └── DashFinance.jsx  # Financial overview
```

## Key Features

### 📁 Organization
- **Separation of Concerns**: Data, styling, utilities, and components are cleanly separated
- **Modular Architecture**: Each component has a single responsibility
- **Reusable Components**: Shared components can be used across multiple dashboards
- **Centralized Configuration**: Colors, navigation, and data in dedicated files

### 🎨 Design System
- **Color Variables**: All colors centralized in `constants/colors.js`
- **Typography**: Consistent font family and sizes
- **Animations**: Defined once in global styles, reused everywhere
- **RTL Support**: Full Hebrew/RTL language support

### 📊 Dashboards
1. **Overview** - KPIs, revenue chart, alerts, sales funnel
2. **Marketing** - Leads, conversion funnels, channels, campaigns
3. **Sales** - Pipeline, deals table, lead scoring, win rates
4. **Finance** - Income/expenses, cash flow, profit margins

### 🔧 Components

#### Shared Components
- **Stat**: Key performance indicator card with icon and metrics
- **Badge**: Inline label with color-coded variants
- **MiniBar**: Horizontal progress bar with gradient
- **BarChart**: Vertical bar chart with labels
- **DonutChart**: SVG-based donut chart
- **SectionTitle**: Section header with optional subtitle

#### Layout Components
- **Sidebar**: Collapsible navigation with groups and badges
- **Topbar**: Page header with title, subtitle, and alerts
- **Placeholder**: Coming-soon page for in-development features

### 🎯 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Configuration Files

### `constants/colors.js`
Defines the complete color palette and typography:
- Background colors
- Card and panel colors
- Text colors (primary, secondary, muted)
- Accent colors (cyan, emerald, amber, rose, violet, pink)
- Color variants for UI elements

### `data/mock-data.js`
Contains all sample data:
- Monthly metrics (revenue, expenses, leads)
- Lead records with scoring
- Deal records with stages
- Transaction history
- Marketing channels

### `data/navigation.js`
Navigation structure and page metadata:
- Sidebar navigation groups
- Page titles and descriptions
- Icons and color associations
- Badge indicators

### `styles/global.js`
Global styling as string:
- CSS reset
- Animations (@keyframes)
- Utility classes (.fu, .hov, .bar, etc.)
- Grid background pattern

## Component API

### Stat Component
```jsx
<Stat
  label="Revenue"           // Label text
  val="₪89,000"            // Main value to display
  sub="↑ 32% vs last month" // Subtitle
  icon="📈"                // Emoji or icon
  colorKey="emerald"       // Color from COLORS theme
  delay={1}                // Animation delay (0-8)
  glow={true}              // Add glow effect
/>
```

### Badge Component
```jsx
<Badge
  label="Active"      // Badge text
  colorKey="emerald"  // Color from COLORS theme
/>
```

### MiniBar Component
```jsx
<MiniBar
  pct={75}            // Percentage (0-100)
  colorKey="cyan"     // Color from COLORS theme
  h={5}               // Height in pixels (default: 5)
/>
```

### BarChart Component
```jsx
<BarChart
  data={[52000, 61000, 48000, 73000]}  // Array of values
  labels={["Jan", "Feb", "Mar", "Apr"]}// X-axis labels
  colorKey="emerald"                    // Color from COLORS theme
  h={90}                                // Chart height
  target={70000}                        // Optional target line
/>
```

## Styling Approach

- **Inline Styles**: Used for component-specific styling for easy customization
- **Global CSS**: Animations, utilities, and resets in `global.js`
- **Color System**: All colors reference the centralized `COLORS` object
- **CSS Classes**: Utility classes (`.fu`, `.hov`, `.bar`, etc.) for animations and interactions

## Best Practices Used

1. **Single Responsibility**: Each component has one clear purpose
2. **Prop-Based Configuration**: Components accept props for customization
3. **Data Separation**: Mock data kept separate from components
4. **Color References**: Using color keys instead of hardcoded hex values
5. **RTL Support**: Proper direction handling for Hebrew interface
6. **Accessibility**: Semantic HTML and proper contrast ratios
7. **Performance**: Memoization ready for larger datasets

## Customization

### Add a New Dashboard
1. Create component in `src/components/dashboards/`
2. Add import to `App.jsx`
3. Add navigation entry to `data/navigation.js`
4. Add page metadata to `PAGE_META` in navigation.js
5. Add routing in `App.jsx` renderPage()

### Change Colors
Edit `src/constants/colors.js` - all components will automatically use new colors

### Modify Mock Data
Edit `src/data/mock-data.js` - dashboards will display updated information

### Update Navigation
Edit `src/data/navigation.js` - sidebar and topbar reflect changes automatically

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires ES6+ support

## Notes

- All times are in Hebrew (RTL)
- Data is mock/sample data for demonstration
- Can easily replace with real API calls
- Styling is RTL-optimized for Hebrew interface
- Animations are smooth with 60fps capability
