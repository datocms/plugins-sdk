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

// The four canonical theme colors plugins and non-CSS consumers see (Mux
// player accent, drag-preview canvas, GraphiQL primary). Stored as
// CSS-ready RGB strings. In monochromatic mode they are derived from the
// pigment ramp at fixed stops (light=50, primary=450, accent=550,
// dark=800) converted from OKLCH; in custom mode they are the four
// explicit RGB colors the customer chose.
export type ThemeColors = {
  primaryColor: string;
  accentColor: string;
  lightColor: string;
  darkColor: string;
};
