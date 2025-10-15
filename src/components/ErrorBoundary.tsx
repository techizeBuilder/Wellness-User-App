import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if it's a keep awake error and suppress it
    if (error.message?.includes('keep awake') || 
        error.message?.includes('Unable to activate keep awake')) {
      console.warn('Keep awake error caught and suppressed:', error.message);
      return { hasError: false }; // Don't show error UI for keep awake issues
    }
    
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if it's a keep awake error and suppress it
    if (error.message?.includes('keep awake') || 
        error.message?.includes('Unable to activate keep awake')) {
      console.warn('Keep awake error boundary triggered and suppressed:', error.message);
      return;
    }
    
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#004D4D',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});