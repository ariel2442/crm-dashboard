/**
 * Sidebar Component - Main navigation panel
 */
import { useState } from "react";
import { COLORS } from "../../constants/colors.js";
import { NAV_GROUPS } from "../../data/navigation.js";

export default function Sidebar({ page, setPage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const W = collapsed ? 68 : 224;

  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;

  const handleItemClick = (item) => {
    if (item.submenu && !collapsed) {
      // Toggle expanded state for items with submenu AND navigate
      setPage(item.id);
      setExpandedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    } else if (!item.submenu) {
      // Navigate to page only if no submenu
      setPage(item.id);
    }
  };

  return (
    <aside
      style={{
        width: W,
        flexShrink: 0,
        background: `linear-gradient(180deg, ${COLORS.panel} 0%, ${COLORS.card}22 100%)`,
        borderLeft: `1.5px solid ${COLORS.border}40`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        transition: "width 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        overflow: "hidden",
        zIndex: 50,
        backdropFilter: "blur(10px)",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "18px 0" : "20px 18px 16px",
          borderBottom: `1.5px solid ${COLORS.border}40`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
          flexShrink: 0,
          transition: "padding 0.25s",
          background: `linear-gradient(180deg, ${COLORS.panel} 0%, ${COLORS.card}15 100%)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 900,
            color: "#fff",
            boxShadow: `0 8px 20px ${COLORS.cyan}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
            backdropFilter: "blur(4px)",
          }}
        >
          W
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: COLORS.text,
              }}
            >
              WebCRM
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>
              בניית אתרים
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? "10px 6px" : "10px 10px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: COLORS.textMuted,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  padding: "10px 8px 4px",
                  opacity: 0.55,
                }}
              >
                {group.label}
              </div>
            )}
            {collapsed && gi > 0 && (
              <div
                style={{
                  height: 1,
                  background: COLORS.border,
                  margin: "8px 4px",
                }}
              />
            )}

            {group.items.map((item) => {
              const active = page === item.id;
              const itemColor = getColor(item.colorKey);
              const isExpanded = expandedItems[item.id];
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    title={collapsed ? item.label : ""}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 10,
                      marginBottom: 2,
                      padding: collapsed ? "11px 0" : "10px 12px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: active ? itemColor + "18" : "transparent",
                      color: active ? itemColor : COLORS.textSub,
                      fontWeight: active ? 700 : 400,
                      fontSize: 13,
                      border: "none",
                      borderRight: active
                        ? `3px solid ${itemColor}`
                        : "3px solid transparent",
                      transition: "all 0.15s",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            flex: 1,
                            textAlign: "right",
                          }}
                        >
                          {item.label}
                        </span>
                        {hasSubmenu && (
                          <span
                            style={{
                              fontSize: 12,
                              color: itemColor,
                              transition: "transform 0.2s",
                              transform: isExpanded
                                ? "rotate(-90deg)"
                                : "rotate(0deg)",
                            }}
                          >
                            ›
                          </span>
                        )}
                      </>
                    )}
                    {!collapsed && item.badge && !hasSubmenu && (
                      <span
                        style={{
                          background: COLORS.rose,
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "1px 7px",
                          borderRadius: 10,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 7,
                          left: 8,
                          width: 15,
                          height: 15,
                          borderRadius: "50%",
                          background: COLORS.rose,
                          color: "#fff",
                          fontSize: 9,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px solid ${COLORS.panel}`,
                        }}
                      >
                        {item.badge}
                      </div>
                    )}
                  </button>

                  {/* Submenu Items */}
                  {hasSubmenu && isExpanded && !collapsed && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        paddingRight: 4,
                        marginBottom: 4,
                      }}
                    >
                      {item.submenu.map((subitem) => {
                        const subActive = page === subitem.id;
                        const subColor = getColor(subitem.colorKey);

                        return (
                          <button
                            key={subitem.id}
                            onClick={() => setPage(subitem.id)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              borderRadius: 8,
                              padding: "8px 12px 8px 24px",
                              background: subActive
                                ? subColor + "12"
                                : "transparent",
                              color: subActive ? subColor : COLORS.textMuted,
                              fontWeight: subActive ? 600 : 400,
                              fontSize: 12,
                              border: "none",
                              borderRight: subActive
                                ? `2px solid ${subColor}`
                                : "transparent",
                              transition: "all 0.15s",
                              cursor: "pointer",
                            }}
                          >
                            <span style={{ fontSize: 13, flexShrink: 0 }}>
                              {subitem.icon}
                            </span>
                            <span
                              style={{
                                whiteSpace: "nowrap",
                                flex: 1,
                                textAlign: "right",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {subitem.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User Section */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "100%",
            padding: "9px 0",
            background: "transparent",
            border: "none",
            color: COLORS.textMuted,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s",
            }}
          >
            ⟨
          </span>
          {!collapsed && (
            <span style={{ fontSize: 11, opacity: 0.5 }}>כווץ</span>
          )}
        </button>
        <div
          style={{
            padding: collapsed ? "12px 0" : "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              flexShrink: 0,
              background: `linear-gradient(135deg,${COLORS.violet},${COLORS.cyan})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            י
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.text,
                  whiteSpace: "nowrap",
                }}
              >
                יאיר כהן
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.textMuted,
                  whiteSpace: "nowrap",
                }}
              >
                מפתח WordPress
              </div>
            </div>
          )}
          {!collapsed && (
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: COLORS.emerald,
                boxShadow: `0 0 6px ${COLORS.emerald}`,
                animation: "pulse 2.5s infinite",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
