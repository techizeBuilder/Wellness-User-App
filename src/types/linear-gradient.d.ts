declare module 'expo-linear-gradient' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export interface LinearGradientProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
  }

  export class LinearGradient extends Component<LinearGradientProps> {}
}