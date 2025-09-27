import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

export default function DashboardScreen() {
  const handleExpertsPress = () => {
    router.push('/experts');
  };

  const handleContentPress = () => {
    router.push('/content');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const categories = [
    { name: 'Yoga', icon: '🧘‍♀️', color: colors.sageGreen },
    { name: 'Ayurveda', icon: '🌿', color: colors.deepTeal },
    { name: 'Diet', icon: '🥗', color: colors.coralAccent },
    { name: 'Meditation', icon: '🕯️', color: colors.royalGold },
  ];

  const experts = [
    {
      id: 1,
      name: 'Dr. Anya Sharma',
      specialty: 'Yoga',
      experience: '5 years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Rohan Verma',
      specialty: 'Ayurveda',
      experience: '8 years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Dr. Priya Kapoor',
      specialty: 'Diet',
      experience: '6 years',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.lightMistTeal, colors.white]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning, Jeetu! 🌞</Text>
              <Text style={styles.subGreeting}>Ready for your wellness journey?</Text>
            </View>
            <Pressable style={styles.profileButton} onPress={handleProfilePress}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
                style={styles.profileImage}
              />
            </Pressable>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Pressable key={index} style={[styles.categoryCard, { backgroundColor: category.color + '20' }]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, { color: category.color }]}>{category.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured Experts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Experts</Text>
            <Pressable onPress={handleExpertsPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.expertsScroll}>
            {experts.map((expert) => (
              <Pressable
                key={expert.id}
                style={styles.expertCard}
                onPress={() => router.push(`/expert-detail?id=${expert.id}`)}
              >
                <Image source={{ uri: expert.image }} style={styles.expertImage} />
                <Text style={styles.expertName}>{expert.name}</Text>
                <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
                <View style={styles.expertRating}>
                  <Text style={styles.expertRatingText}>⭐ {expert.rating}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Session */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Session</Text>
          <View style={styles.sessionCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop' }}
              style={styles.sessionImage}
            />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Morning Yoga Flow</Text>
              <Text style={styles.sessionSubtitle}>With Anya Sharma</Text>
              <Text style={styles.sessionTime}>Today, 8:00 AM</Text>
            </View>
            <Pressable style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </Pressable>
          </View>
        </View>

        {/* Daily Wellness Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Wellness Tip</Text>
          <LinearGradient
            colors={[colors.deepTeal, '#006666']}
            style={styles.tipCard}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=80&fit=crop' }}
              style={styles.tipImage}
            />
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipDescription}>
              Drink at least 8 glasses of water today to boost your energy and focus.
            </Text>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={[styles.actionButton, { backgroundColor: colors.sageGreen }]} onPress={handleExpertsPress}>
            <Text style={styles.actionButtonText}>Book Session</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, { backgroundColor: colors.coralAccent }]} onPress={handleContentPress}>
            <Text style={styles.actionButtonText}>Explore Content</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modern Bottom Navigation */}
      <View style={styles.bottomNav}>
        <LinearGradient
          colors={[colors.white, colors.lightMistTeal]}
          style={styles.navGradient}
        >
          <View style={styles.navContent}>
            <Pressable style={styles.navItem}>
              <View style={[styles.navIconContainer, styles.navIconContainerActive]}>
                <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
              </View>
              <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={handleExpertsPress}>
              <View style={styles.navIconContainer}>
                <Text style={styles.navIcon}>👥</Text>
              </View>
              <Text style={styles.navLabel}>Experts</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <View style={styles.navIconContainer}>
                <Text style={styles.navIcon}>📅</Text>
              </View>
              <Text style={styles.navLabel}>Sessions</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={handleContentPress}>
              <View style={styles.navIconContainer}>
                <Text style={styles.navIcon}>📱</Text>
              </View>
              <Text style={styles.navLabel}>Content</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={handleProfilePress}>
              <View style={styles.navIconContainer}>
                <Text style={styles.navIcon}>👤</Text>
              </View>
              <Text style={styles.navLabel}>Profile</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.charcoalGray,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.royalGold,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  expertsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  expertCard: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: colors.warmGray,
    borderRadius: 16,
    padding: 16,
  },
  expertImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  expertName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.deepTeal,
    textAlign: 'center',
    marginBottom: 4,
  },
  expertSpecialty: {
    fontSize: 12,
    color: colors.charcoalGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  expertRating: {
    backgroundColor: colors.royalGold + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expertRatingText: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: 'bold',
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: colors.warmGray,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  sessionImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 14,
    color: colors.charcoalGray,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: colors.sageGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  tipCard: {
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  tipImage: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 80,
    height: 60,
    borderRadius: 8,
    opacity: 0.3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
    paddingRight: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  bottomSpacer: {
    height: 90,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navGradient: {
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 50,
  },
  navIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navIconContainerActive: {
    backgroundColor: colors.deepTeal + '20',
  },
  navIcon: {
    fontSize: 18,
    color: colors.charcoalGray,
  },
  navIconActive: {
    color: colors.deepTeal,
  },
  navLabel: {
    fontSize: 11,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colors.deepTeal,
    fontWeight: '600',
  },
});