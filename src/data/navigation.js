/**
 * Navigation Configuration
 */
import { COLORS } from "../constants/colors.js";

export const NAV_GROUPS = [
  {
    label: "דשבורדים",
    items: [
      {
        id: "overview",
        icon: "⊞",
        label: "סיכום כללי",
        badge: null,
        colorKey: "cyan",
      },
      {
        id: "marketing",
        icon: "📣",
        label: "שיווק",
        badge: null,
        colorKey: "violet",
        submenu: [
          {
            id: "marketing-organic",
            icon: "🌱",
            label: "לידים אורגני",
            colorKey: "emerald",
          },
          {
            id: "marketing-paid",
            icon: "💳",
            label: "קמפיינים ממומנים",
            colorKey: "violet",
          },
        ],
      },
      {
        id: "sales",
        icon: "💼",
        label: "מכירות",
        badge: null,
        colorKey: "emerald",
        submenu: [
          {
            id: "leads-real",
            icon: "🎯",
            label: "לידים (מערכת)",
            colorKey: "emerald",
          },
          {
            id: "sales-leads",
            icon: "◎",
            label: "כל הלידים (דמו)",
            colorKey: "cyan",
          },
        ],
      },
      {
        id: "projects",
        icon: "🚀",
        label: "פרוייקטים",
        badge: null,
        colorKey: "amber",
        submenu: [
          {
            id: "client-projects",
            icon: "📁",
            label: "פרויקטי לקוחות",
            colorKey: "cyan",
          },
        ],
      },
      {
        id: "finance",
        icon: "💰",
        label: "פיננסים",
        badge: 2,
        colorKey: "rose",
        submenu: [
          {
            id: "finance-details",
            icon: "📈",
            label: "פירוט הכנסות והוצאות",
            colorKey: "rose",
          },
        ],
      },
    ],
  },
  {
    label: "תקשורת",
    items: [
      {
        id: "whatsapp",
        icon: "💬",
        label: "וואטסאפ",
        badge: 3,
        colorKey: "emerald",
      },
    ],
  },
  {
    label: "הגדרות",
    items: [
      {
        id: "auto",
        icon: "⚡",
        label: "אוטומציות",
        badge: null,
        colorKey: "amber",
      },
      {
        id: "settings",
        icon: "⚙️",
        label: "הגדרות",
        badge: null,
        colorKey: "textMuted",
      },
    ],
  },
];

export const PAGE_META = {
  overview: {
    title: "סיכום כללי",
    sub: "כל המדדים במבט אחד",
    icon: "⊞",
    colorKey: "cyan",
  },
  marketing: {
    title: "שיווק",
    sub: "לידים · ערוצים · קמפיינים",
    icon: "📣",
    colorKey: "violet",
  },
  "marketing-paid": {
    title: "קמפיינים ממומנים",
    sub: "הוצאות פרסום · ביצועים",
    icon: "💳",
    colorKey: "violet",
  },
  "marketing-organic": {
    title: "לידים אורגני",
    sub: "מקורות טבעיים · תוכן",
    icon: "🌱",
    colorKey: "emerald",
  },
  sales: {
    title: "מכירות",
    sub: "פייפליין · עסקאות · ביצועים",
    icon: "💼",
    colorKey: "emerald",
  },
  "sales-leads": {
    title: "כל הלידים (דמו)",
    sub: "ניהול צינור לידים",
    icon: "◎",
    colorKey: "cyan",
  },
  "leads-real": {
    title: "לידים",
    sub: "ניהול לידים · סטטוסים · הצעות מחיר",
    icon: "🎯",
    colorKey: "emerald",
  },
  projects: {
    title: "פרוייקטים",
    sub: "ניהול · התקדמות · לוחות זמנים",
    icon: "🚀",
    colorKey: "amber",
  },
  "client-projects": {
    title: "פרויקטי לקוחות",
    sub: "נתונים אמיתיים · העלאת קבצים",
    icon: "📁",
    colorKey: "cyan",
  },
  finance: {
    title: "פיננסים",
    sub: "הכנסות · הוצאות · רווחיות",
    icon: "💰",
    colorKey: "rose",
  },
  "finance-details": {
    title: "פירוט הכנסות והוצאות",
    sub: "רשימה מפורטת של כל התעסוקות",
    icon: "📊",
    colorKey: "rose",
  },
  auto: {
    title: "אוטומציות",
    sub: "טריגרים ופעולות",
    icon: "⚡",
    colorKey: "amber",
  },
  settings: {
    title: "הגדרות",
    sub: "הגדרות מערכת",
    icon: "⚙️",
    colorKey: "textMuted",
  },
  whatsapp: {
    title: "וואטסאפ",
    sub: "שיחות · לידים · הודעות",
    icon: "💬",
    colorKey: "emerald",
  },
};
