import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface FooterProps {
  activeRoute: string;
}

export default function Footer({ activeRoute }: FooterProps) {
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
    <View style={styles.bottomNav}>
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
  },
  navGradient: {
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
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
    fontSize: 22,
    fontWeight: '600',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  navLabelActive: {
    fontWeight: '700',
  },
});