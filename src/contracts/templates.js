/**
 * Contract templates per service type.
 * Each function returns a self-contained HTML document that prints well
 * and renders Hebrew correctly (uses system fonts, no external CDN).
 *
 * Stage 2 scope: HTML contract openable in a new window and printable to PDF.
 * Stage 3/4 will attach the same HTML to WhatsApp / iCount flows.
 */

const formatMoney = (n) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(n || 0);

const formatDate = (iso) => {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("he-IL");
};

const itemsTable = (items) => `
  <table>
    <thead>
      <tr>
        <th>תיאור</th>
        <th>כמות</th>
        <th>מחיר יח׳</th>
        <th>סה״כ</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (it) => `
        <tr>
          <td>${escapeHtml(it.description || "—")}</td>
          <td class="c">${it.quantity || 0}</td>
          <td class="c">${formatMoney(it.price)}</td>
          <td class="c">${formatMoney((it.quantity || 0) * (it.price || 0))}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;

const totalsBlock = ({ subtotal, vatAmount, total, vatRate }) => `
  <div class="totals">
    <div class="row"><span>סכום ביניים</span><span>${formatMoney(subtotal)}</span></div>
    <div class="row"><span>מע״מ (${vatRate}%)</span><span>${formatMoney(vatAmount)}</span></div>
    <div class="row total"><span>סה״כ לתשלום</span><span>${formatMoney(total)}</span></div>
  </div>
`;

const baseCss = `
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Rubik", Arial, "David", sans-serif;
    direction: rtl;
    color: #1a202c;
    margin: 0;
    padding: 40px;
    line-height: 1.7;
    background: #fff;
  }
  .sheet { max-width: 780px; margin: 0 auto; }
  header { border-bottom: 3px solid #0891b2; padding-bottom: 16px; margin-bottom: 26px; }
  header h1 { margin: 0; font-size: 28px; color: #0e7490; }
  header .meta { color: #64748b; font-size: 13px; margin-top: 4px; }
  h2 { color: #0e7490; margin-top: 26px; font-size: 18px; border-right: 4px solid #0891b2; padding-right: 10px; }
  p { margin: 10px 0; font-size: 14px; }
  ul { padding-right: 22px; font-size: 14px; }
  ul li { margin: 6px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
  th { background: #e0f2fe; color: #0c4a6e; padding: 10px; text-align: right; border-bottom: 2px solid #0891b2; }
  td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
  td.c, th.c { text-align: center; }
  .totals { margin-top: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; }
  .totals .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
  .totals .total { font-size: 17px; font-weight: 800; border-top: 2px solid #0891b2; margin-top: 8px; padding-top: 10px; color: #0e7490; }
  .signatures { margin-top: 40px; display: flex; gap: 30px; }
  .signatures .box { flex: 1; border-top: 1.5px solid #1a202c; padding-top: 8px; font-size: 12px; color: #475569; text-align: center; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 0; } .no-print { display: none; } }
  .print-btn {
    position: fixed; top: 20px; left: 20px; padding: 10px 20px;
    background: #0891b2; color: #fff; border: none; border-radius: 8px;
    font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(8,145,178,0.3);
  }
`;

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ------------------------------------------------------------------
 * Per-service-type body clauses.
 * Each returns the middle "scope of work" block.
 * ------------------------------------------------------------------ */
const BODY_BY_SERVICE = {
  "אתר עסקי": () => `
    <h2>מהות העבודה</h2>
    <p>הקמת אתר עסקי על בסיס וורדפרס, כולל:</p>
    <ul>
      <li>עיצוב מותאם לזהות המותג (דסקטופ + מובייל)</li>
      <li>עד 6 עמודי תוכן סטטיים</li>
      <li>טופס יצירת קשר + חיבור למערכת לידים</li>
      <li>אופטימיזציית SEO בסיסית ו-Core Web Vitals</li>
      <li>התקנה על שרת הלקוח, תעודת SSL והדרכה 30 דקות</li>
    </ul>
    <h2>לוח זמנים</h2>
    <p>אספקה משוערת: עד 21 ימי עבודה ממועד קבלת התשלום הראשון ותכני הלקוח.</p>
  `,
  "חנות אונליין": () => `
    <h2>מהות העבודה</h2>
    <p>הקמת חנות אונליין מלאה על WooCommerce, כולל:</p>
    <ul>
      <li>עיצוב חנות מותאם לזהות המותג</li>
      <li>הטענת עד 30 מוצרים ראשונים (תמונה, תיאור, מלאי)</li>
      <li>חיבור סליקה בישראל (Cardcom / Meshulam / iCount)</li>
      <li>חיבור ספק משלוחים ומייל תזכורות אוטומטי</li>
      <li>הדרכה על ניהול החנות (שעה מלאה)</li>
    </ul>
    <h2>לוח זמנים</h2>
    <p>אספקה משוערת: עד 30 ימי עבודה ממועד התשלום הראשון.</p>
  `,
  "מערכת CRM": () => `
    <h2>מהות העבודה</h2>
    <p>בניית מערכת CRM מותאמת אישית, כולל:</p>
    <ul>
      <li>ניהול לידים, סטטוסים ואוטומציות מותאמות</li>
      <li>דשבורד נתונים + דוחות ביצועים</li>
      <li>הרשאות לפי תפקידים (מנהל / נציג / לקוח)</li>
      <li>אינטגרציה לשרת הלקוח ולכלים חיצוניים (WhatsApp, Email, סליקה)</li>
      <li>הדרכת צוות והטמעה (שעתיים)</li>
    </ul>
    <h2>לוח זמנים</h2>
    <p>אספקה משוערת: 30-45 ימי עבודה בכפוף לאפיון מפורט.</p>
  `,
  "ייעוץ": () => `
    <h2>מהות העבודה</h2>
    <p>שירותי ייעוץ מקצועיים, כולל:</p>
    <ul>
      <li>פגישת אפיון ראשונית וניתוח מצב קיים</li>
      <li>מסמך המלצות מפורט ותוכנית פעולה</li>
      <li>ליווי צמוד עד השלמת היישום</li>
      <li>זמינות לשאלות במייל / וואטסאפ במהלך תקופת הליווי</li>
    </ul>
    <h2>לוח זמנים</h2>
    <p>משך הליווי המוסכם: יתואם פרטנית מול הלקוח.</p>
  `,
  "אחר": () => `
    <h2>מהות העבודה</h2>
    <p>ראה פירוט הפריטים בהצעה. היקף העבודה יוגדר באישור הצדדים לפני תחילת הביצוע.</p>
  `,
};

/* ------------------------------------------------------------------
 * Main render function.
 * ------------------------------------------------------------------ */
export function renderContractHtml({
  clientName = "",
  serviceType = "אחר",
  items = [],
  totals = { subtotal: 0, vatAmount: 0, total: 0, vatRate: 18 },
  quoteNumber = "",
  notes = "",
  businessName = "WebCRM",
}) {
  const scopeFn = BODY_BY_SERVICE[serviceType] || BODY_BY_SERVICE["אחר"];
  const body = scopeFn();

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>הצעת מחיר — ${escapeHtml(clientName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>${baseCss}</style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨 הדפס / שמור כ-PDF</button>
  <div class="sheet">
    <header>
      <h1>הצעת מחיר — ${escapeHtml(serviceType)}</h1>
      <div class="meta">
        ${quoteNumber ? `מספר הצעה: ${escapeHtml(quoteNumber)} · ` : ""}
        תאריך: ${formatDate()} · ${escapeHtml(businessName)}
      </div>
    </header>

    <p><strong>לכבוד:</strong> ${escapeHtml(clientName || "—")}</p>

    ${body}

    <h2>פירוט הצעה</h2>
    ${itemsTable(items)}
    ${totalsBlock(totals)}

    ${
      notes
        ? `<h2>הערות</h2><p style="white-space:pre-wrap">${escapeHtml(notes)}</p>`
        : ""
    }

    <h2>תנאי תשלום</h2>
    <ul>
      <li>50% מקדמה עם חתימת ההסכם, 50% יתרה עם אישור סופי להעלאה לאוויר/סיום העבודה.</li>
      <li>המחירים אינם כוללים עלויות צד ג׳ (שרת, דומיין, תוספי פרמיום) אלא אם צוין אחרת.</li>
      <li>ההצעה תקפה ל-14 יום ממועד ההצעה.</li>
    </ul>

    <div class="signatures">
      <div class="box">חתימת הלקוח + תאריך</div>
      <div class="box">חתימת ספק השירות + תאריך</div>
    </div>

    <footer>
      נוצר באמצעות WebCRM · ${formatDate()}
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Open the contract in a new window for printing / saving as PDF.
 */
export function openContractWindow(opts) {
  const html = renderContractHtml(opts);
  const w = window.open("", "_blank");
  if (!w) {
    alert("הדפדפן חסם את חלון החוזה. אפשר חלונות קופצים ונסה שוב.");
    return;
  }
  w.document.write(html);
  w.document.close();
}
