import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack 
        screenOptions={{
          headerShown: false, // This removes the header with route names
          contentStyle: { backgroundColor: '#004D4D' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="onboarding-simple" />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
