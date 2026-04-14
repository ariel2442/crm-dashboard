/**
 * Global Styles - CSS Constants
 */
import { COLORS, FONT_FAMILY } from "../constants/colors.js";

export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');

/* ── Reset ── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#root {
  height: 100%;
}

body {
  font-family: ${FONT_FAMILY};
  background: ${COLORS.bg};
  color: ${COLORS.text};
  direction: rtl;
  overflow: hidden;
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* ── Form Elements ── */
button,
input,
select {
  font-family: ${FONT_FAMILY};
  direction: rtl;
  cursor: pointer;
}

button {
  border: none;
  outline: none;
}

/* ── Animations ── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes barGrow {
  from {
    width: 0;
  }
  to {
    width: var(--w);
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Animation Utilities ── */
.fu {
  animation: fadeUp 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.s1 {
  animation-delay: 0.05s;
}
.s2 {
  animation-delay: 0.1s;
}
.s3 {
  animation-delay: 0.15s;
}
.s4 {
  animation-delay: 0.2s;
}
.s5 {
  animation-delay: 0.25s;
}
.s6 {
  animation-delay: 0.3s;
}
.s7 {
  animation-delay: 0.35s;
}
.s8 {
  animation-delay: 0.4s;
}

/* ── Interactions ── */
.hov {
  transition: border-color 0.2s, background 0.2s, transform 0.18s,
    box-shadow 0.2s;
}

.hov:hover {
  border-color: ${COLORS.borderHov} !important;
  background: ${COLORS.cardHov} !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px ${COLORS.cyanGlow};
}

.row {
  transition: background 0.12s;
}

.row:hover {
  background: rgba(255, 255, 255, 0.03) !important;
}

.bar {
  animation: barGrow 1s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.15s;
}

/* ── Grid Background ── */
.grid-bg {
  background-image: linear-gradient(
      ${COLORS.bgGrid} 1px,
      transparent 1px
    ),
    linear-gradient(90deg, ${COLORS.bgGrid} 1px, transparent 1px);
  background-size: 44px 44px;
}
`;
