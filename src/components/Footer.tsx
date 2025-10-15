import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsiveWidth
} from '../utils/dimensions';

// Export footer height for use in other components (WhatsApp-style)
export const FOOTER_HEIGHT = 75 + 25; // Base height + safe area buffer

interface FooterProps {
  activeRoute: string;
}

export default function Footer({ activeRoute }: FooterProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');
  
  const footerItems = [
    {
      id: 'dashboard',
      icon: '⌂',
      label: 'Home',
      route: '/dashboard'
    },
    {
      id: 'experts',
      icon: '👥',
      label: 'Experts',
      route: '/experts'
    },
    {
      id: 'sessions',
      icon: '📅',
      label: 'Sessions',
      route: '/sessions'
    },
    {
      id: 'content',
      icon: '📚',
      label: 'Content',
      route: '/content'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      route: '/profile'
    }
  ];

  const handlePress = (route: string) => {
    if (route !== `/${activeRoute}`) {
      router.push(route as any);
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
    zIndex: 1000,
    backgroundColor: 'rgba(77, 208, 225, 0.95)', // Add background color as fallback
    height: 75,
  },
  navGradient: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 0, // Absolutely no bottom padding
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    justifyContent: 'center',
    marginBottom: 0,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4, // Minimal horizontal padding like WhatsApp
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4, // Reduced padding like WhatsApp
    paddingHorizontal: 4,
    minWidth: getResponsiveWidth(60),
    flex: 1,
  },
  navIconContainer: {
    width: getResponsiveWidth(38), // Slightly smaller like WhatsApp
    height: getResponsiveHeight(38),
    borderRadius: getResponsiveBorderRadius(19),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(2), // Reduced margin
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#4DD0E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },
  navIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    shadowOpacity: 0.4,
    elevation: 4,
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  navIcon: {
    fontSize: getResponsiveFontSize(21),
    fontWeight: '600',
  },
  navLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  navLabelActive: {
    fontWeight: '700',
  },
});