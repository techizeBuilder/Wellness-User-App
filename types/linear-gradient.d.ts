declare module 'expo-linear-gradient' {
  import { Component } from 'react';
    import { ViewProps } from 'react-native';

  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
    children?: React.ReactNode;
  }

  export class LinearGradient extends Component<LinearGradientProps> {}
}