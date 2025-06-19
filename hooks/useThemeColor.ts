/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { DarkTheme, LightTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof LightTheme.colors & keyof typeof DarkTheme.colors
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme === "light"
      ? LightTheme.colors[colorName]
      : DarkTheme.colors[colorName];
  }
}
