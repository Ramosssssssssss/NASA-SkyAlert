export interface AppColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  placeholder: string;
  border: string;
  borderFocused: string;
  primary: string;
  primaryText: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  separator: string;
  pillBg: string;
  pillIndicator: string;
  pillShadow: string;
  inputBg: string;
  overlay: string;
}

const LightColors: AppColors = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  placeholder: '#C7C7CC',
  border: '#E5E5EA',
  borderFocused: '#C7C7CC',
  primary: '#000000',
  primaryText: '#FFFFFF',
  error: '#FF3B30',
  errorBg: '#FFF2F2',
  errorBorder: '#FFE0E0',
  separator: '#E5E5EA',
  pillBg: '#F2F2F7',
  pillIndicator: '#FFFFFF',
  pillShadow: 'rgba(0,0,0,0.06)',
  inputBg: '#F2F2F7',
  overlay: 'rgba(0,0,0,0.55)',
};

const DarkColors: AppColors = {
  background: '#000000',
  surface: '#1C1C1E',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  placeholder: '#48484A',
  border: '#38383A',
  borderFocused: '#48484A',
  primary: '#FFFFFF',
  primaryText: '#000000',
  error: '#FF453A',
  errorBg: '#3A1C1C',
  errorBorder: '#5C2C2C',
  separator: '#38383A',
  pillBg: '#1C1C1E',
  pillIndicator: '#2C2C2E',
  pillShadow: 'rgba(0,0,0,0.3)',
  inputBg: '#1C1C1E',
  overlay: 'rgba(0,0,0,0.7)',
};

export function getColors(isDark: boolean): AppColors {
  return isDark ? DarkColors : LightColors;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const FontSize = {
  caption: 12,
  footnote: 13,
  body: 15,
  callout: 16,
  headline: 17,
  title3: 20,
  title2: 22,
  title1: 28,
  largeTitle: 34,
};
