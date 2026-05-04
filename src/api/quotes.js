import { api } from "./client.js";

export const DEFAULT_VAT_RATE = 18;

export function computeTotals(items, vatRate = DEFAULT_VAT_RATE) {
  const subtotal  = items.reduce((sum, it) => sum + Number(it.quantity || 0) * Number(it.price || 0), 0);
  const vatAmount = subtotal * (vatRate / 100);
  return { subtotal, vatAmount, total: subtotal + vatAmount };
}

export async function listQuotes(leadId) {
  const data = await api.post("quotes-list", leadId ? { leadId } : {});
  return data.quotes;
}

export async function getQuote(id) {
  const data = await api.post("quote-get", { id });
  return data.quote;
}

export async function saveQuote(quote) {
  const data = await api.post("quote-save", quote);
  return data.quote;
}

export async function createQuote({ title, leadId, clientName, clientPhone = "", serviceType, items, vatRate = DEFAULT_VAT_RATE, notes = "" }) {
  const { subtotal, vatAmount, total } = computeTotals(items, vatRate);
  return saveQuote({
    title,
    leadId,
    clientName,
    clientPhone,
    serviceType,
    items,
    subtotal,
    vatRate,
    vatAmount,
    total,
    notes,
    quoteStatus: "draft",
  });
}

export async function sendQuote(quote) {
  const data = await api.post("quote-send", quote);
  return data;
}

export async function nextQuoteNum() {
  const data = await api.get("quote-next-num");
  return data.num;
}

export async function deleteQuote(id) {
  return api.post("quote-delete", { id });
}
