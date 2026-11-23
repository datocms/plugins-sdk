// An RGBA color. Each channel is an integer from 0 to 255. This is the
// same shape as the color of the DatoCMS API, but the package does not
// import the API client.
export type RgbaColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};
export type ColorValue = RgbaColor | null;

// The four colors of a custom theme, as CSS color strings: the colors that
// the customer picks for the light scheme. They are the input of customTheme.
export type ThemeColors = {
  primaryColor: string;
  accentColor: string;
  lightColor: string;
  darkColor: string;
};
