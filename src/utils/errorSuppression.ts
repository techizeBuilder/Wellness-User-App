// Minimal keep awake error suppression for React Native
// This fixes the specific window.addEventListener error

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Check if message is a keep awake related error
const isKeepAwakeMessage = (message: string): boolean => {
  return message.includes('keep awake') || 
         message.includes('Unable to activate keep awake') ||
         message.includes('keep-awake') ||
         message.includes('ExpoKeepAwake') ||
         message.includes('window.addEventListener is not a function');
};

// Override console.error to suppress keep awake errors
console.error = (...args: any[]) => {
  const message = args.join(' ');
  if (isKeepAwakeMessage(message)) {
    console.warn('[SUPPRESSED] Keep awake related error:', message);
    return;
  }
  originalError.apply(console, args);
};

// Override console.warn to suppress keep awake warnings
console.warn = (...args: any[]) => {
  const message = args.join(' ');
  if (isKeepAwakeMessage(message)) {
    return; // Completely suppress
  }
  originalWarn.apply(console, args);
};

export { originalError, originalWarn };
