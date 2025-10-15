import { activateKeepAwakeAsync, deactivateKeepAwakeAsync } from 'expo-keep-awake';
import { useEffect, useState } from 'react';

/**
 * Safely activate keep awake functionality with error handling
 */
export const safeActivateKeepAwake = async (tag?: string): Promise<boolean> => {
  try {
    await activateKeepAwakeAsync(tag);
    return true;
  } catch (error) {
    console.warn('Failed to activate keep awake:', error);
    return false;
  }
};

/**
 * Safely deactivate keep awake functionality with error handling
 */
export const safeDeactivateKeepAwake = async (tag?: string): Promise<boolean> => {
  try {
    await deactivateKeepAwakeAsync(tag);
    return true;
  } catch (error) {
    console.warn('Failed to deactivate keep awake:', error);
    return false;
  }
};

/**
 * Hook to manage keep awake state safely
 */
export const useKeepAwakeSafe = (isActive: boolean, tag?: string) => {
  const [isKeepAwakeActive, setIsKeepAwakeActive] = useState(false);

  useEffect(() => {
    if (isActive && !isKeepAwakeActive) {
      safeActivateKeepAwake(tag).then(success => {
        if (success) {
          setIsKeepAwakeActive(true);
        }
      });
    } else if (!isActive && isKeepAwakeActive) {
      safeDeactivateKeepAwake(tag).then(success => {
        if (success) {
          setIsKeepAwakeActive(false);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (isKeepAwakeActive) {
        safeDeactivateKeepAwake(tag);
      }
    };
  }, [isActive, isKeepAwakeActive, tag]);

  return isKeepAwakeActive;
};