/**
 * Utility Functions
 */

/**
 * Format number as Israeli Shekel currency
 */
export const formatCurrency = (n) => "₪" + (+n || 0).toLocaleString("he-IL");

/**
 * Get color from color key using COLORS object
 */
export const getColor = (colorKey, colors) => colors[colorKey] || colors.text;
