// AnimatedThemeView.js
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
type AnimatedProp = {
  isDark: boolean;
  children: React.ReactNode;
}
export default function AnimatedThemeView({ isDark, children }: AnimatedProp) {
  const bgColor = useSharedValue(isDark ? 0 : 1);

  useEffect(() => {
    bgColor.value = withTiming(isDark ? 0 : 1, { duration: 500 });
  }, [isDark]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = bgColor.value === 0 ? '#121212' : '#ffffff';
    return { backgroundColor };
  });

  return <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
