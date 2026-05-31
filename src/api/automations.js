import { api } from "./client.js";
import { TRACK_URL, TOKEN_KEY } from "./config.js";

// ── Settings ──────────────────────────────────────────────────
export async function getAutomationSettings() {
  const data = await api.get("settings-get");
  return data.settings;
}
export async function saveAutomationSettings(settings) {
  return api.post("settings-save", settings);
}

// ── WhatsApp ──────────────────────────────────────────────────
export async function sendWhatsApp(phone, message) {
  return api.post("send-whatsapp", { phone, message });
}

// ── Quote lifecycle ───────────────────────────────────────────
export async function sendQuoteToClient(quote) {
  const data = await api.post("quote-send", quote);
  return data;
}

export async function trackQuoteView(id, durationSeconds = 0) {
  return fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action: "view", durationSeconds }),
  }).then((r) => r.json());
}

export async function signQuote(id, { signerName, paymentMethod, signature, contractHtml }) {
  return fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action: "sign", signerName, paymentMethod, signature, contractHtml }),
  }).then((r) => r.json());
}

export async function uploadContractToDrive(quoteId, htmlContent) {
  const data = await api.post("contract-drive-upload", { quoteId, htmlContent });
  return data;
}

// ── GROW payments ─────────────────────────────────────────────
export async function createPaymentLink({ id, clientName, clientPhone, total, proposalNum }) {
  const data = await api.post("quote-create-payment", { id, clientName, clientPhone, total, proposalNum });
  return data;
}
export async function testGrowConnection() {
  return api.post("grow-test", {});
}

// ── Reminders ─────────────────────────────────────────────────
export async function runReminders(type = "all") {
  return api.post("run-reminders", { type });
}
