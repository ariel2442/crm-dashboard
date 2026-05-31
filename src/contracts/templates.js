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
 * Main render function.
 * ------------------------------------------------------------------ */
export function renderContractHtml({
  clientName = "",
  serviceType = "",
  items = [],
  totals = { subtotal: 0, vatAmount: 0, total: 0, vatRate: 18 },
  quoteNumber = "",
  notes = "",
  businessName = "WebCRM",
  signedBy = null,
  signatureImage = null,
}) {
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
      <h1>הצעת מחיר${serviceType ? ` — ${escapeHtml(serviceType)}` : ""}</h1>
      <div class="meta">
        ${quoteNumber ? `מספר הצעה: ${escapeHtml(quoteNumber)} · ` : ""}
        תאריך: ${formatDate()} · ${escapeHtml(businessName)}
      </div>
    </header>

    <p><strong>לכבוד:</strong> ${escapeHtml(clientName || "—")}</p>

    <h2>פירוט הצעה</h2>
    ${itemsTable(items)}
    ${totalsBlock(totals)}

    ${
      notes
        ? `<h2>הערות</h2><p style="white-space:pre-wrap">${escapeHtml(notes)}</p>`
        : ""
    }


${signedBy ? `
    <div style="margin-top:30px;padding:16px 20px;background:#f0fdf4;border:2px solid #16a34a;border-radius:10px;">
      <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:10px;">✅ הסכם חתום</div>
      <div style="font-size:13px;color:#166534;">חתם: <strong>${escapeHtml(signedBy.name || clientName)}</strong></div>
      <div style="font-size:13px;color:#166534;">תאריך חתימה: <strong>${escapeHtml(signedBy.date || formatDate())}</strong></div>
      ${signedBy.method ? `<div style="font-size:13px;color:#166534;">אמצעי תשלום: <strong>${escapeHtml(signedBy.method)}</strong></div>` : ""}
      ${signatureImage ? `<div style="margin-top:12px;"><img src="${signatureImage}" style="max-width:260px;border:1px solid #86efac;border-radius:6px;background:#fff;padding:6px;" /></div>` : ""}
    </div>` : `
    <div class="signatures">
      <div class="box">חתימת הלקוח + תאריך</div>
      <div class="box">חתימת ספק השירות + תאריך</div>
    </div>`}

    <footer>
      נוצר באמצעות WebCRM · ${formatDate()}
      ${signedBy ? ` · נחתם ב-${escapeHtml(signedBy.date || formatDate())}` : ""}
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
