/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#173D2B',
    tint: '#174C32',
    background: '#F7F8F3',
    foreground: '#173D2B',
    card: '#FFFFFF',
    cardForeground: '#173D2B',
    primary: '#174C32',
    primaryForeground: '#ffffff',
    secondary: '#F3E9D9',
    secondaryForeground: '#75451E',
    muted: '#EEF1EA',
    mutedForeground: '#748075',
    accent: '#EE8A2D',
    accentForeground: '#FFFFFF',
    destructive: '#B53F32',
    destructiveForeground: '#FFFFFF',
    border: '#E1E7DE',
    input: '#E1E7DE',
  },

  radius: 18,
};

export default colors;
