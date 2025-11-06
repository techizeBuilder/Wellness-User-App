import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveWidth
} from '@/utils/dimensions';

// Export footer height for use in other components
export const EXPERT_FOOTER_HEIGHT = 75 + 25; // Base height + safe area buffer

interface ExpertFooterProps {
  activeRoute: string;
}

export default function ExpertFooter({ activeRoute }: ExpertFooterProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');
  
  const footerItems = [
    {
      id: 'expert-dashboard',
      icon: '📊',
      label: 'Dashboard',
      route: '/(expert)/expert-dashboard'
    },
    {
      id: 'appointments',
      icon: '📅',
      label: 'Schedule',
      route: '/(expert)/expert-appointments'
    },
    {
      id: 'patients',
      icon: '👥',
      label: 'Patients',
      route: '/(expert)/expert-patients'
    },
    {
      id: 'earnings',
      icon: '💰',
      label: 'Earnings',
      route: '/(expert)/expert-earnings'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      route: '/(user)/profile'
    }
  ];

  const handlePress = (route: string) => {
    // Special handling for profile route to keep expert context
    if (route === '/(user)/profile') {
      // Navigate to profile but store context that we came from expert dashboard
      router.push({ pathname: '/(user)/profile', params: { context: 'expert' } });
    } else {
      // Check if we're already on this route
      const isActive = activeRoute === 'expert-dashboard' && route === '/(expert)/expert-dashboard' ||
                       activeRoute === 'appointments' && route === '/(expert)/expert-appointments' ||
                       activeRoute === 'patients' && route === '/(expert)/expert-patients' ||
                       activeRoute === 'earnings' && route === '/(expert)/expert-earnings' ||
                       activeRoute === 'profile' && route === '/(user)/profile';
      
      if (!isActive) {
        // Type assertion for route strings - routes are validated at compile time via types/router.d.ts
        router.push(route as Parameters<typeof router.push>[0]);
      }
    }
  };

  return (
    <View style={[
      styles.bottomNav, 
      { 
        height: 75 + insets.bottom, // Add safe area to height
        paddingBottom: insets.bottom, // Safe area at bottom
      }
    ]}>
      <LinearGradient
        colors={['rgba(77, 208, 225, 0.95)', 'rgba(129, 199, 132, 0.85)']}
        style={styles.navGradient}
      >
        <View style={styles.navContent}>
          {footerItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <Pressable
                key={item.id}
                style={styles.navItem}
                onPress={() => handlePress(item.route)}
              >
                <View style={[
                  styles.navIconContainer,
                  isActive && styles.navIconContainerActive
                ]}>
                  <Text style={[
                    styles.navIcon,
                    { color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }
                  ]}>
                    {item.icon}
                  </Text>
                </View>
                <Text style={[
                  styles.navLabel,
                  { color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)' },
                  isActive && styles.navLabelActive
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(77, 208, 225, 0.95)',
    height: 75,
  },
  navGradient: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: getResponsiveWidth(65),
    flex: 1,
  },
  navIconContainer: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#4DD0E1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  navIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0.3,
    elevation: 3,
    transform: [{ scale: 1.05 }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  navIcon: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '600',
  },
  navLabel: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  navLabelActive: {
    fontWeight: '700',
  },
});