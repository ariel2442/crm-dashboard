# Quick Start Guide

## Installation & Setup

### 1️⃣ Install Dependencies
```bash
cd crm-dashboard-refactored
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```
The app will open at `http://localhost:3000`

### 3️⃣ Build for Production
```bash
npm run build
```
Output goes to `dist/` folder

---

## Project Contents

### 📁 What's Where

| File/Folder | Purpose |
|------------|---------|
| `src/index.jsx` | App entry point |
| `src/App.jsx` | Main app component |
| `src/constants/colors.js` | Theme colors |
| `src/data/mock-data.js` | Sample data |
| `src/data/navigation.js` | Menu & page config |
| `src/styles/global.js` | Global CSS |
| `src/components/shared/` | Reusable components |
| `src/components/layouts/` | Page structure |
| `src/components/dashboards/` | Dashboard pages |

---

## 4 Main Dashboards

### 📊 1. Overview (סיכום כללי)
- KPI cards, revenue chart
- Alerts, sales pipeline, top leads
- Monthly targets
- **File**: `DashOverview.jsx`

### 📣 2. Marketing (שיווק)
- Lead metrics, conversion tracking
- Channel distribution, conversion funnel
- Active campaigns
- **File**: `DashMarketing.jsx`

### 💼 3. Sales (מכירות)
- Pipeline overview, deal tracking
- Lead scoring, win rates
- Monthly sales trends
- **File**: `DashSales.jsx`

### 💰 4. Finance (פיננסים)
- Income/expense tracking
- Cash flow analysis
- Profit margins, transactions
- **File**: `DashFinance.jsx`

---

## Key Features

✅ **Modular Architecture** - Easy to understand and modify
✅ **Reusable Components** - Build faster with shared UI components
✅ **Clean Data Layer** - All data centralized and easy to replace
✅ **Theme System** - Change colors in one file
✅ **RTL Support** - Full Hebrew language support
✅ **Responsive Design** - Works on different screen sizes
✅ **Smooth Animations** - Professional feel with CSS animations
✅ **No External UI Library** - Pure React + CSS

---

## Making Changes

### 🎨 Change Colors
Edit `src/constants/colors.js`:
```javascript
export const COLORS = {
  cyan: "#06B6D4",    // Change this
  // ... other colors
};
```

### 📊 Update Data
Edit `src/data/mock-data.js`:
```javascript
export const REV = [52000, 61000, 48000, 73000, 67000, 89000];
// Change these numbers to see different metrics
```

### 📝 Add Navigation Item
Edit `src/data/navigation.js`:
```javascript
{
  id: "new-page",
  icon: "🎯",
  label: "דף חדש",
  badge: null,
  colorKey: "cyan",
}
```

### 🧩 Add New Dashboard
1. Create `src/components/dashboards/DashNewPage.jsx`
2. Add to navigation config
3. Import in `App.jsx` and add to `renderPage()`

---

## File Size Overview

| Component | Lines | Purpose |
|-----------|-------|---------|
| DashOverview | 400+ | Complete main dashboard |
| DashSales | 400+ | Sales with table & charts |
| DashFinance | 400+ | Financial with 2 tables |
| DashMarketing | 350+ | Marketing with donut chart |
| Stat | 46 | KPI card component |
| BarChart | 48 | Bar chart component |
| Sidebar | 220 | Navigation panel |

**Total**: ~2,000 lines of well-organized, readable code

---

## Component API Examples

### Using Stat Component
```jsx
<Stat
  label="הכנסות"
  val="₪89,000"
  sub="↑ 32%"
  icon="📈"
  colorKey="emerald"
  delay={1}
/>
```

### Using BarChart Component
```jsx
<BarChart
  data={[52000, 61000, 48000, 73000]}
  labels={["אוק׳", "נוב׳", "דצמ׳", "ינו׳"]}
  colorKey="cyan"
  h={90}
/>
```

### Using Badge Component
```jsx
<Badge label="בטיפול" colorKey="amber" />
```

---

## Tips & Tricks

💡 **Animation Delays**: Add `delay={1}`, `delay={2}`, etc. for staggered animations

💡 **Color Keys**: Use any key from `COLORS` object in `constants/colors.js`

💡 **Mock Data**: Replace with API calls in the future without changing components

💡 **RTL**: All layouts automatically work right-to-left (Hebrew)

💡 **Responsive**: Uses CSS Grid and Flexbox for all screen sizes

---

## Troubleshooting

### Port Already in Use?
```bash
npm run dev -- --port 3001
```

### Changes Not Showing?
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- Check browser console for errors

### Need to Reset?
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Next Steps

1. ✅ Install and run: `npm install && npm run dev`
2. ✅ Explore the 4 dashboards
3. ✅ Edit colors and data
4. ✅ Add new components or dashboards
5. ✅ Deploy with `npm run build`

---

## Resources

- **Colors**: `src/constants/colors.js` - All theme colors
- **Icons**: Using emoji (can replace with icon library)
- **Fonts**: Google Fonts - Rubik (Hebrew optimized)
- **Layout**: CSS Grid + Flexbox

---

## Questions?

Look at similar components for examples:
- Need a chart? → See `BarChart.jsx` or `DonutChart.jsx`
- Need a card? → See `Stat.jsx`
- Need a label? → See `Badge.jsx`
- Need a page? → See `DashOverview.jsx`

Happy coding! 🚀
