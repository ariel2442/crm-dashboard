/**
 * WhatsApp Hub - CRM WhatsApp Web Integration
 */
import { useState, useRef, useEffect } from "react";
import { COLORS } from "../../constants/colors.js";
import { WA_CONTACTS } from "../../data/mock-data.js";

const WA_GREEN = "#25D366";
const WA_GREEN_DIM = "rgba(37,211,102,0.12)";
const WA_GREEN_DARK = "#128C7E";

export default function WhatsAppHub() {
  const [contacts, setContacts] = useState(WA_CONTACTS);
  const [selectedId, setSelectedId] = useState(WA_CONTACTS[0].id);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  const selected = contacts.find((c) => c.id === selectedId);

  const filtered = contacts.filter(
    (c) =>
      c.name.includes(search) ||
      c.company.includes(search) ||
      c.phone.includes(search)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, selected?.messages?.length]);

  const handleSelectContact = (id) => {
    setSelectedId(id);
    // Mark as read
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id !== selectedId) return c;
        return {
          ...c,
          lastMsg: text,
          lastTime: time,
          messages: [
            ...c.messages,
            {
              id: c.messages.length + 1,
              from: "me",
              text,
              time,
              date: "היום",
            },
          ],
        };
      })
    );
    setInputText("");
  };

  const handleOpenWA = (phone) => {
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const totalUnread = contacts.reduce((s, c) => s + c.unread, 0);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        direction: "rtl",
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* ===== LEFT PANEL: Contact List ===== */}
      <div
        style={{
          width: 320,
          flexShrink: 0,
          background: COLORS.panel,
          borderLeft: `1.5px solid ${COLORS.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${COLORS.border}`,
            background: `linear-gradient(180deg, ${COLORS.card} 0%, ${COLORS.panel} 100%)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${WA_GREEN_DARK} 0%, ${WA_GREEN} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: `0 4px 14px ${WA_GREEN}33`,
              }}
            >
              💬
            </div>
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}
              >
                וואטסאפ CRM
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                {totalUnread > 0
                  ? `${totalUnread} הודעות חדשות`
                  : "כל השיחות"}
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש שיחה..."
              style={{
                width: "100%",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "8px 36px 8px 12px",
                color: COLORS.text,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                direction: "rtl",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                opacity: 0.4,
              }}
            >
              🔍
            </span>
          </div>
        </div>

        {/* Contact List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((contact) => {
            const isActive = contact.id === selectedId;
            return (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: isActive ? WA_GREEN_DIM : "transparent",
                  border: "none",
                  borderBottom: `1px solid ${COLORS.border}40`,
                  borderRight: isActive
                    ? `3px solid ${WA_GREEN}`
                    : "3px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "right",
                }}
              >
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${WA_GREEN_DARK}80 0%, ${WA_GREEN}80 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      border: isActive
                        ? `2px solid ${WA_GREEN}`
                        : `2px solid ${COLORS.border}`,
                    }}
                  >
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 1,
                        left: 1,
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: WA_GREEN,
                        border: `2px solid ${COLORS.panel}`,
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: contact.unread > 0 ? 700 : 500,
                        color: COLORS.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {contact.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color:
                          contact.unread > 0 ? WA_GREEN : COLORS.textMuted,
                        flexShrink: 0,
                        marginRight: 4,
                      }}
                    >
                      {contact.lastTime}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color:
                          contact.unread > 0
                            ? COLORS.textSub
                            : COLORS.textMuted,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {contact.lastMsg}
                    </span>
                    {contact.unread > 0 && (
                      <div
                        style={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: 10,
                          background: WA_GREEN,
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 5px",
                          marginRight: 6,
                          flexShrink: 0,
                        }}
                      >
                        {contact.unread}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: COLORS.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {contact.company}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== RIGHT PANEL: Chat ===== */}
      {selected ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: COLORS.bg,
            backgroundImage: `radial-gradient(${COLORS.bgGrid} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "12px 20px",
              background: COLORS.card,
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${WA_GREEN_DARK}80 0%, ${WA_GREEN}80 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  border: `2px solid ${WA_GREEN}60`,
                }}
              >
                {selected.avatar}
              </div>
              {selected.online && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 1,
                    left: 1,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: WA_GREEN,
                    border: `2px solid ${COLORS.card}`,
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}
              >
                {selected.name}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                {selected.online ? (
                  <span style={{ color: WA_GREEN }}>מחובר</span>
                ) : (
                  selected.company
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => handleOpenWA(selected.phone)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  background: `linear-gradient(135deg, ${WA_GREEN_DARK} 0%, ${WA_GREEN} 100%)`,
                  border: "none",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 4px 14px ${WA_GREEN}33`,
                }}
              >
                <span>📱</span>
                <span>פתח WhatsApp</span>
              </button>
              <div
                style={{
                  padding: "7px 12px",
                  background: COLORS.panel,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 9,
                  color: COLORS.textMuted,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ color: WA_GREEN }}>◉</span>
                <span>{selected.status}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {(() => {
              let lastDate = null;
              return selected.messages.map((msg) => {
                const isMe = msg.from === "me";
                const showDate = msg.date !== lastDate;
                lastDate = msg.date;
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div
                        style={{
                          textAlign: "center",
                          margin: "10px 0 8px",
                        }}
                      >
                        <span
                          style={{
                            background: COLORS.card,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 20,
                            padding: "3px 14px",
                            fontSize: 11,
                            color: COLORS.textMuted,
                          }}
                        >
                          {msg.date}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: isMe ? "flex-start" : "flex-end",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "65%",
                          background: isMe
                            ? `linear-gradient(135deg, ${WA_GREEN_DARK}CC 0%, ${WA_GREEN}99 100%)`
                            : COLORS.card,
                          border: isMe
                            ? `1px solid ${WA_GREEN}40`
                            : `1px solid ${COLORS.border}`,
                          borderRadius: isMe
                            ? "16px 16px 16px 4px"
                            : "16px 16px 4px 16px",
                          padding: "10px 14px 8px",
                          boxShadow: isMe
                            ? `0 2px 10px ${WA_GREEN}22`
                            : "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            color: COLORS.text,
                            lineHeight: 1.5,
                            direction: "rtl",
                          }}
                        >
                          {msg.text}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: isMe
                              ? "rgba(255,255,255,0.55)"
                              : COLORS.textMuted,
                            marginTop: 4,
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            justifyContent: "flex-end",
                          }}
                        >
                          {msg.time}
                          {isMe && (
                            <span style={{ color: WA_GREEN, fontSize: 11 }}>
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 20px",
              background: COLORS.card,
              borderTop: `1px solid ${COLORS.border}`,
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: inputText.trim()
                  ? `linear-gradient(135deg, ${WA_GREEN_DARK} 0%, ${WA_GREEN} 100%)`
                  : COLORS.panel,
                border: `1px solid ${inputText.trim() ? WA_GREEN : COLORS.border}`,
                color: inputText.trim() ? "#fff" : COLORS.textMuted,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: inputText.trim() ? "pointer" : "default",
                flexShrink: 0,
                transition: "all 0.15s",
                boxShadow: inputText.trim()
                  ? `0 4px 12px ${WA_GREEN}33`
                  : "none",
              }}
            >
              ➤
            </button>
            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="הקלד הודעה..."
                rows={1}
                style={{
                  width: "100%",
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  color: COLORS.text,
                  fontSize: 13,
                  resize: "none",
                  outline: "none",
                  direction: "rtl",
                  fontFamily: "'Rubik', sans-serif",
                  lineHeight: 1.5,
                  boxSizing: "border-box",
                  maxHeight: 120,
                  overflow: "auto",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = `${WA_GREEN}60`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.border;
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                color: COLORS.textMuted,
                flexShrink: 0,
                paddingBottom: 12,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Enter
              <br />
              לשליחה
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.textMuted,
            fontSize: 14,
          }}
        >
          בחר שיחה מהרשימה
        </div>
      )}
    </div>
  );
}
