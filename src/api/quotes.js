/**
 * Quotes API — WordPress "quote" Custom Post Type.
 * items stored as a JSON string in meta.items_json.
 */
import { api } from "./client.js";

export const DEFAULT_VAT_RATE = 18;

const META_KEYS = [
  "lead_id",
  "client_name",
  "service_type",
  "items_json",
  "subtotal",
  "vat_rate",
  "vat_amount",
  "total",
  "status",
  "notes",
  "payment_link",
];

const emptyMeta = () =>
  META_KEYS.reduce((acc, k) => ({ ...acc, [k]: "" }), {
    status: "draft",
    vat_rate: DEFAULT_VAT_RATE,
  });

const decodeItems = (s) => {
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalize = (p) => {
  const meta = { ...emptyMeta(), ...(p.meta || {}) };
  return {
    id: p.id,
    title: p.title?.rendered || p.title || "",
    authorId: p.author,
    date: p.date,
    modified: p.modified,
    meta,
    items: decodeItems(meta.items_json),
  };
};

export function computeTotals(items, vatRate = DEFAULT_VAT_RATE) {
  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.quantity || 0) * Number(it.price || 0),
    0
  );
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;
  return { subtotal, vatAmount, total };
}

export async function listQuotes(leadId) {
  const q = leadId ? `?meta_key=lead_id&meta_value=${leadId}` : "?per_page=100";
  const data = await api.get(`/quotes${q}`);
  return data.map(normalize);
}

export async function createQuote({
  title,
  leadId,
  clientName,
  serviceType,
  items,
  vatRate = DEFAULT_VAT_RATE,
  notes = "",
}) {
  const { subtotal, vatAmount, total } = computeTotals(items, vatRate);
  const data = await api.post("/quotes", {
    title,
    status: "publish",
    meta: {
      lead_id: Number(leadId) || 0,
      client_name: clientName || "",
      service_type: serviceType || "",
      items_json: JSON.stringify(items),
      subtotal,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total,
      status: "draft",
      notes,
    },
  });
  return normalize(data);
}

export async function updateQuote(id, { title, items, vatRate, status, notes }) {
  const body = { meta: {} };
  if (title !== undefined) body.title = title;
  if (items !== undefined) {
    const rate = vatRate ?? DEFAULT_VAT_RATE;
    const { subtotal, vatAmount, total } = computeTotals(items, rate);
    body.meta.items_json = JSON.stringify(items);
    body.meta.subtotal = subtotal;
    body.meta.vat_rate = rate;
    body.meta.vat_amount = vatAmount;
    body.meta.total = total;
  }
  if (status !== undefined) body.meta.status = status;
  if (notes !== undefined) body.meta.notes = notes;
  const data = await api.put(`/quotes/${id}`, body);
  return normalize(data);
}

export async function deleteQuote(id) {
  return api.del(`/quotes/${id}?force=true`);
}
