const COLORS = {
  LightTheme: {
    primary_a0: "#3586DB",
    primary_a10: "#4684d1",
    primary_a20: "#5384c6",
    primary_a30: "#5d83bc",
    primary_a40: "#6583b2",
    primary_a50: "#6c82a8",

    surface_a0: "#ffffff",
    surface_a10: "#f0f0f0",
    surface_a20: "#e1e1e1",
    surface_a30: "#d3d3d3",
    surface_a40: "#c5c5c5",
    surface_a50: "#b6b6b6",

    tonal_a0: "#eef2fc",
    tonal_a10: "#e1e5ed",
    tonal_a20: "#d5d8df",
    tonal_a30: "#c8cbd1",
    tonal_a40: "#bcbec3",
    tonal_a50: "#afb1b5",
  },
  DarkTheme: {
    primary_a0: "#3585db",
    primary_a10: "#5692df",
    primary_a20: "#709fe4",
    primary_a30: "#87ace8",
    primary_a40: "#9cb9ec",
    primary_a50: "#b1c7f0",

    surface_a0: "#121212",
    surface_a10: "#282828",
    surface_a20: "#3f3f3f",
    surface_a30: "#575757",
    surface_a40: "#717171",
    surface_a50: "#8b8b8b",

    tonal_a0: "#191c23",
    tonal_a10: "#2e3138",
    tonal_a20: "#45474d",
    tonal_a30: "#5c5f64",
    tonal_a40: "#75777c",
    tonal_a50: "#8f9195",
  },
};
export const LightTheme = {
  dark: false,
  colors: {
    textColor: "#000000",
    base: "#000000",

    primary_a0: "#3586DB",
    primary_a05: "#f1f6fa",
    primary_a10: "#4684d1",
    primary_a20: "#5384c6",
    primary_a30: "#5d83bc",
    primary_a40: "#6583b2",
    primary_a50: "#6c82a8",

    surface_a0: "#ffffff",
    surface_a10: "#f0f0f0",
    surface_a20: "#e1e1e1",
    surface_a30: "#d3d3d3",
    surface_a40: "#c5c5c5",
    surface_a50: "#b6b6b6",

    tonal_a0: "#eef2fc",
    tonal_a10: "#e1e5ed",
    tonal_a20: "#d5d8df",
    tonal_a30: "#c8cbd1",
    tonal_a40: "#bcbec3",
    tonal_a50: "#afb1b5",

    blurViewTopBorder: "rgba(255, 255, 255, 0.3)", // Light theme border color for blur view
    tabBarFocused: "#5d83bc", // Color for focused tab bar items
    tabBarUnfocused: "#b0b0b0", // Color for unfocused tab bar items
    statusBar: "dark-content", // Status bar color for light theme
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    textColor: "#ffffff",
    base: "#ffffff",

    primary_a0: "#3585db",
    primary_a10: "#5692df",
    primary_a05: "#1c314f",
    primary_a20: "#709fe4",
    primary_a30: "#87ace8",
    primary_a40: "#9cb9ec",
    primary_a50: "#b1c7f0",

    surface_a0: "#121212",
    surface_a10: "#282828",
    surface_a20: "#3f3f3f",
    surface_a30: "#575757",
    surface_a40: "#717171",
    surface_a50: "#8b8b8b",

    tonal_a0: "#191c23",
    tonal_a10: "#2e3138",
    tonal_a20: "#45474d",
    tonal_a30: "#5c5f64",
    tonal_a40: "#75777c",
    tonal_a50: "#8f9195",

    blurViewTopBorder: "rgba(18, 18, 18, 0.3)", // Dark theme border color for blur view
    tabBarFocused: "#87ace8", // Color for focused tab bar items
    tabBarUnfocused: "#b0b0b0", // Color for unfocused
    statusBar: "light-content", // Status bar color for dark theme

    // Text color for
  },
};
