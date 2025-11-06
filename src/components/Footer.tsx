import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsiveWidth
} from '@/utils/dimensions';

// Export footer height for use in other components (WhatsApp-style)
export const FOOTER_HEIGHT = 75 + 25; // Base height + safe area buffer

interface FooterProps {
  activeRoute: string;
}

export default function Footer({ activeRoute }: FooterProps) {
  const insets = useSafeAreaInsets();
  
  const footerItems = [
    {
      id: 'dashboard',
      icon: '⌂',
      label: 'Home',
      route: '/(user)/dashboard'
    },
    {
      id: 'experts',
      icon: '👥',
      label: 'Experts',
      route: '/(user)/experts'
    },
    {
      id: 'sessions',
      icon: '📅',
      label: 'Sessions',
      route: '/(user)/sessions'
    },
    {
      id: 'content',
      icon: '📚',
      label: 'Content',
      route: '/(user)/content'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      route: '/(user)/profile'
    }
  ];

  const handlePress = (route: string) => {
    // Check if we're already on this route
    const currentRoute = activeRoute === 'dashboard' ? 'dashboard' :
                         activeRoute === 'experts' ? 'experts' :
                         activeRoute === 'sessions' ? 'sessions' :
                         activeRoute === 'content' ? 'content' :
                         activeRoute === 'profile' ? 'profile' : '';
    
    if (route !== `/(user)/${currentRoute}`) {
      // Type assertion for route strings - routes are validated at compile time via types/router.d.ts
      router.push(route as Parameters<typeof router.push>[0]);
    }
  };

  return (
    <View style={[
      styles.bottomNav, 
      { 
        height: 75 + insets.bottom, // Add safe area to height
        paddingBottom: insets.bottom, // Safe area at bottom like WhatsApp
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
    marginBottom: getResponsiveMargin(4),
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
    fontSize: fontSizes.xs,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  navLabelActive: {
    fontWeight: '700',
  },
});