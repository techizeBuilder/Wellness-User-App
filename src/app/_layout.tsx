import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/utils/consoleOverride'; // Global console override for clean UX
import '@/utils/errorSuppression'; // Must be first import

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Stack 
          screenOptions={{
            headerShown: false, // This removes the header with route names
            contentStyle: { backgroundColor: '#004D4D' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
