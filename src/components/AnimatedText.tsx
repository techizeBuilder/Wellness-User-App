import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 0,
  duration = 600,
  style,
  ...textProps
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    translateY.value = withDelay(delay, withTiming(0, { duration }));
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={style} {...textProps}>
        {children}
      </Text>
    </Animated.View>
  );
};

export default AnimatedText;