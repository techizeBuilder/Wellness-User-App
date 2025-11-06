import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Footer, { FOOTER_HEIGHT } from '@/components/Footer';
import authService from '@/services/authService';
import {
    fontSizes,
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth,
    screenData
} from '@/utils/dimensions';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const expertsScrollRef = useRef<ScrollView>(null);

  // Check account type on component mount
  useEffect(() => {
    const checkAccountType = async () => {
      try {
        const accountType = await authService.getAccountType();
        console.log('Dashboard - Account Type:', accountType);
        
        // If user is an Expert, redirect to expert dashboard
        if (accountType === 'Expert') {
          console.log('Redirecting Expert to expert dashboard');
          router.replace('/(expert)/expert-dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking account type:', error);
      }
    };

    checkAccountType();
  }, []);

  const handleExpertsPress = () => {
    router.push('/(user)/experts');
  };

  const handleContentPress = () => {
    router.push('/(user)/content');
  };

  const handleProfilePress = () => {
    router.push('/(user)/profile');
  };

  // Expert navigation functions
  const navigateExpertLeft = () => {
    if (currentExpertIndex > 0) {
      const newIndex = currentExpertIndex - 1;
      setCurrentExpertIndex(newIndex);
      const cardWidth = 280; // Approximate width of expert card + margin
      expertsScrollRef.current?.scrollTo({
        x: newIndex * cardWidth,
        animated: true,
      });
    }
  };

  const navigateExpertRight = () => {
    if (currentExpertIndex < experts.length - 1) {
      const newIndex = currentExpertIndex + 1;
      setCurrentExpertIndex(newIndex);
      const cardWidth = 280; // Approximate width of expert card + margin
      expertsScrollRef.current?.scrollTo({
        x: newIndex * cardWidth,
        animated: true,
      });
    }
  };

  const handleExpertScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = 280;
    const newIndex = Math.round(scrollX / cardWidth);
    if (newIndex !== currentExpertIndex && newIndex >= 0 && newIndex < experts.length) {
      setCurrentExpertIndex(newIndex);
    }
  };

  // Auto-slider data
  const sliderData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=150&fit=crop',
      title: 'Wellness Journey',
      subtitle: 'Start your daily routine'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=150&fit=crop',
      title: 'Meditation Classes',
      subtitle: 'Find inner peace'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=150&fit=crop',
      title: 'Healthy Lifestyle',
      subtitle: 'Expert guidance'
    }
  ];

  // Auto-slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % sliderData.length;
        const scrollX = nextSlide * (width - 40);
        scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
        return nextSlide;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: 'Yoga', icon: '🧘‍♀️', backgroundColor: '#edebf0ff' },
    { name: 'Ayurveda', icon: '🌿', backgroundColor: '#edebf0ff' },
    { name: 'Diet', icon: '🥗', backgroundColor: '#edebf0ff' },
    { name: 'Astro Health', icon: '🔮', backgroundColor: '#edebf0ff' },
    { name: 'Meditation', icon: '🕯️', backgroundColor: '#edebf0ff' },
  ];

  const experts = [
    {
      id: 1,
      name: 'Dr. Anya Sharma',
      specialty: 'Yoga',
      experience: '5 years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      description: 'Certified yoga instructor specializing in Hatha and Vinyasa yoga with focus on mindfulness and breathing techniques.',
      sessionPrice: '₹800/session'
    },
    {
      id: 2,
      name: 'Dr. Rohan Verma',
      specialty: 'Ayurveda',
      experience: '8 years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      description: 'Traditional Ayurvedic medicine practitioner with expertise in Panchakarma and holistic wellness solutions.',
      sessionPrice: '₹1200/session'
    },
    {
      id: 3,
      name: 'Dr. Priya Kapoor',
      specialty: 'Nutrition',
      experience: '6 years',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      description: 'Certified nutritionist and dietitian focusing on plant-based nutrition and sustainable lifestyle changes.',
      sessionPrice: '₹900/session'
    }
  ];

  return (
    <LinearGradient
      colors={['#23a897ff', '#269184ff', '#188d83ff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning, Jeetu</Text>
              <Text style={styles.subGreeting}>Ready for your wellness journey?</Text>
            </View>
            <Pressable style={styles.profileButton} onPress={handleProfilePress}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
                style={styles.profileImage}
              />
            </Pressable>
          </View>
        </View>

        {/* Professional Auto Slider Advertisement Section */}
        <View style={styles.sliderSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            decelerationRate="fast"
            snapToInterval={width - 40}
          >
            {sliderData.map((item, index) => (
              <View key={item.id} style={styles.sliderItem}>
                <LinearGradient
                  colors={['rgba(77, 208, 225, 0.9)', 'rgba(129, 199, 132, 0.9)', 'rgba(186, 104, 200, 0.9)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sliderGradientOverlay}
                >
                  <Image source={{ uri: item.image }} style={styles.sliderImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.sliderTextOverlay}
                  >
                    <View style={styles.sliderContent}>
                      <Text style={styles.sliderTitle}>{item.title}</Text>
                      <Text style={styles.sliderSubtitle}>{item.subtitle}</Text>
                      <View style={styles.sliderButton}>
                        <Text style={styles.sliderButtonText}>Explore Now</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
          <View style={styles.sliderDots}>
            {sliderData.map((_, index) => (
              <LinearGradient
                key={index}
                colors={currentSlide === index ? ['#2DD4BF', '#14B8A6'] : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)']}
                style={[styles.dot, { opacity: currentSlide === index ? 1 : 0.5 }]}
              />
            ))}
          </View>
        </View>

        {/* Categories Horizontal Slider */}
        <View style={styles.categoriesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <View key={index} style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}>
                <Pressable style={styles.categoryPressable}>
                  <View style={styles.categoryIconWrapper}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Experts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Experts</Text>
            <View style={styles.navigationArrows}>
              <Pressable 
                style={[styles.arrowButton, { opacity: currentExpertIndex === 0 ? 0.5 : 1 }]}
                onPress={navigateExpertLeft}
                disabled={currentExpertIndex === 0}
              >
                <Text style={styles.arrowText}>←</Text>
              </Pressable>
              <Pressable 
                style={[styles.arrowButton, { opacity: currentExpertIndex === experts.length - 1 ? 0.5 : 1 }]}
                onPress={navigateExpertRight}
                disabled={currentExpertIndex === experts.length - 1}
              >
                <Text style={styles.arrowText}>→</Text>
              </Pressable>
            </View>
          </View>
          <ScrollView 
            ref={expertsScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.expertsScroll}
            onScroll={handleExpertScroll}
            scrollEventThrottle={16}
          >
            {experts.map((expert, index) => {
              const gradients: [string, string][] = [
                ['rgba(247, 246, 250, 0.9)', 'rgba(248, 248, 248, 0.9)'], // Purple gradient
                ['rgba(247, 246, 250, 0.9)', 'rgba(248, 248, 248, 0.9)'], // Green gradient  
                ['rgba(247, 246, 250, 0.9)', 'rgba(248, 248, 248, 0.9)'],// Pink gradient
              ];
              return (
                <LinearGradient
                  key={expert.id}
                  colors={gradients[index % gradients.length]}
                  style={styles.expertCard}
                >
                  <Pressable
                    style={styles.expertPressable}
                    onPress={() => router.push(`/expert-detail?id=${expert.id}`)}
                  >
                    <View style={styles.expertImageContainer}>
                      <Image source={{ uri: expert.image }} style={styles.expertImage} />
                      <Text style={styles.expertSpecialtyBadge}>{expert.specialty}</Text>
                    </View>
                    <View style={styles.expertContent}>
                      <View style={styles.expertHeader}>
                        <Text style={styles.expertName}>{expert.name}</Text>
                      </View>
                      
                      <View style={styles.expertDescriptionContainer}>
                        <Text style={styles.expertDescription} numberOfLines={2} ellipsizeMode="tail">
                          {expert.description}
                        </Text>
                      </View>
                      
                      <View style={styles.expertMetaInfo}>
                        <View style={styles.expertRating}>
                          <Text style={styles.expertRatingText}>⭐ {expert.rating}</Text>
                        </View>
                        <Text style={styles.expertPrice}>{expert.sessionPrice}</Text>
                      </View>
                      
                      <LinearGradient
                        colors={['#14B8A6', '#0D9488']}
                        style={styles.bookButton}
                      >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </LinearGradient>
                    </View>
                  </Pressable>
                </LinearGradient>
              );
            })}
          </ScrollView>
        </View>

        {/* Upcoming Session */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(241, 245, 243, 0.95)', 'rgba(241, 245, 241, 0.95)']}
            style={styles.sessionCard}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop' }}
              style={styles.sessionImage}
            />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Morning Yoga Flow</Text>
              <Text style={styles.sessionTime}>Today, at 8:00 AM</Text>
            </View>
            <LinearGradient
              colors={['#14B8A6', '#0D9488']}
              style={styles.joinButton}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Daily Wellness Tip */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(248, 248, 248, 0.9)', 'rgba(255, 248, 220, 0.9)']}
            style={styles.tipCard}
          >
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>💡</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Daily Wellness Tip</Text>
              <Text style={styles.tipDescription}>Start your day with 10 minutes of deep breathing for better focus.</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Health Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.9)', 'rgba(129, 199, 132, 0.9)']}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>🧘‍♀️</Text>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Sessions This Month</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(33, 150, 243, 0.9)', 'rgba(100, 181, 246, 0.9)']}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statNumber}>180</Text>
              <Text style={styles.statLabel}>Minutes Practiced</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(255, 193, 7, 0.9)', 'rgba(255, 235, 59, 0.9)']}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Weekly Goals */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Goals</Text>
            <Pressable style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
            </Pressable>
          </View>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            style={styles.goalsCard}
          >
            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Complete 5 Yoga Sessions</Text>
                <Text style={styles.goalProgress}>3/5 completed</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#2DD4BF', '#14B8A6']}
                  style={[styles.progressFill, { width: '60%' }]}
                />
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Meditate for 100 minutes</Text>
                <Text style={styles.goalProgress}>75/100 minutes</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#2DD4BF', '#14B8A6']}
                  style={[styles.progressFill, { width: '75%' }]}
                />
              </View>
            </View>
          </LinearGradient>
        </View> */}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <Pressable style={styles.quickActionCard}>
              <LinearGradient
                colors={['rgba(186, 104, 200, 0.9)', 'rgba(206, 147, 216, 0.9)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🧘‍♂️</Text>
                <Text style={styles.quickActionText}>5-Min Meditation</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.quickActionCard}>
              <LinearGradient
                colors={['rgba(255, 152, 0, 0.9)', 'rgba(255, 193, 7, 0.9)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>💪</Text>
                <Text style={styles.quickActionText}>Quick Workout</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.quickActionCard}>
              <LinearGradient
                colors={['rgba(76, 175, 80, 0.9)', 'rgba(129, 199, 132, 0.9)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🌱</Text>
                <Text style={styles.quickActionText}>Breathing Exercise</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.quickActionCard}>
              <LinearGradient
                colors={['rgba(33, 150, 243, 0.9)', 'rgba(100, 181, 246, 0.9)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>📖</Text>
                <Text style={styles.quickActionText}>Read Article</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Recent Articles */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Wellness Articles</Text>
            <Pressable style={styles.seeAllButton} onPress={handleContentPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              {
                id: 1,
                title: "Benefits of Morning Yoga",
                author: "Dr. Anya Sharma",
                readTime: "5 min read",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop"
              },
              {
                id: 2,
                title: "Ayurvedic Diet Guidelines",
                author: "Dr. Rohan Verma",
                readTime: "8 min read",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop"
              },
              {
                id: 3,
                title: "Mindful Eating Practices",
                author: "Dr. Priya Kapoor",
                readTime: "6 min read",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=120&fit=crop"
              }
            ].map((article) => (
              <Pressable key={article.id} style={styles.articleCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                  style={styles.articleCardGradient}
                >
                  <Image source={{ uri: article.image }} style={styles.articleImage} />
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                    <Text style={styles.articleAuthor}>by {article.author}</Text>
                    <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View> */}

        {/* Community Highlights */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Highlights</Text>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            style={styles.communityCard}
          >
            <View style={styles.communityStats}>
              <View style={styles.communityStatItem}>
                <Text style={styles.communityStatNumber}>2.5K+</Text>
                <Text style={styles.communityStatLabel}>Active Members</Text>
              </View>
              <View style={styles.communityStatItem}>
                <Text style={styles.communityStatNumber}>150+</Text>
                <Text style={styles.communityStatLabel}>Sessions Today</Text>
              </View>
              <View style={styles.communityStatItem}>
                <Text style={styles.communityStatNumber}>95%</Text>
                <Text style={styles.communityStatLabel}>Satisfaction Rate</Text>
              </View>
            </View>
            <Pressable style={styles.joinCommunityButton}>
              <LinearGradient
                colors={['#2DD4BF', '#14B8A6']}
                style={styles.joinCommunityGradient}
              >
                <Text style={styles.joinCommunityText}>Join Discussion</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </View> */}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer activeRoute="dashboard" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: getResponsiveHeight(screenData.isSmall ? 65 : 80), // Increased top spacing
    paddingBottom: getResponsivePadding(20),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 20),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: '#FFD54F',
    marginBottom: getResponsiveMargin(4),
  },
  subGreeting: {
    fontSize: fontSizes.md,
    color: '#ffffffff',
    opacity: 0.9,
  },
  profileButton: {
    width: getResponsiveWidth(50),
    height: getResponsiveHeight(50),
    borderRadius: getResponsiveBorderRadius(25),
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 20),
    marginTop: getResponsiveMargin(24),
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: getResponsiveMargin(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  navigationArrows: {
    flexDirection: 'row',
    gap: getResponsiveMargin(8),
  },
  arrowButton: {
    width: getResponsiveWidth(36),
    height: getResponsiveHeight(36),
    borderRadius: getResponsiveBorderRadius(18),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  arrowText: {
    color: '#ffffff',
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: fontSizes.md,
    marginTop: -2,
  },
  // Professional Slider styles
  sliderSection: {
    marginVertical: getResponsiveMargin(15),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 20),
  },
  sliderItem: {
    width: screenData.width - getResponsiveWidth(screenData.isSmall ? 32 : 40),
    height: getResponsiveHeight(screenData.isSmall ? 180 : 220),
    borderRadius: getResponsiveBorderRadius(25),
    overflow: 'hidden',
    position: 'relative',
    marginRight: getResponsiveMargin(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  sliderGradientOverlay: {
    flex: 1,
    borderRadius: getResponsiveBorderRadius(25),
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.85,
  },
  sliderTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    justifyContent: 'flex-end',
    borderRadius: getResponsiveBorderRadius(25),
  },
  sliderContent: {
    padding: getResponsivePadding(screenData.isSmall ? 20 : 25),
  },
  sliderTitle: {
    color: '#fff',
    fontSize: screenData.isSmall ? fontSizes.xl : fontSizes.xxl + 2,
    fontWeight: 'bold',
    marginBottom: getResponsiveMargin(8),
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  sliderSubtitle: {
    color: '#fff',
    fontSize: fontSizes.md,
    opacity: 0.95,
    marginBottom: getResponsiveMargin(15),
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sliderButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(25),
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#D97706',
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getResponsiveMargin(15),
  },
  dot: {
    width: getResponsiveWidth(10),
    height: getResponsiveHeight(10),
    borderRadius: getResponsiveBorderRadius(5),
    marginHorizontal: getResponsiveMargin(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  // Categories Slider styles
  categoriesSection: {
    marginTop: getResponsiveMargin(10),
    marginBottom: getResponsiveMargin(15),
  },
  categoriesContainer: {
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 20),
    gap: getResponsiveMargin(screenData.isSmall ? 12 : 15),
  },
  categoryCard: {
    width: getResponsiveWidth(screenData.isSmall ? 75 : 85),
    height: getResponsiveHeight(screenData.isSmall ? 75 : 85),
    borderRadius: getResponsiveBorderRadius(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: getResponsivePadding(8),
  },
  categoryIconWrapper: {
    marginBottom: getResponsiveMargin(4),
  },
  categoryIcon: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 24 : 28),
  },
  categoryName: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    lineHeight: fontSizes.xs + 2,
  },
  expertsScroll: {
    marginHorizontal: getResponsiveMargin(-20),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 20),
  },
  expertCard: {
    width: getResponsiveWidth(screenData.isSmall ? 280 : 320),
    height: getResponsiveHeight(screenData.isSmall ? 210 : 230),
    marginRight: getResponsiveMargin(16),
    borderRadius: getResponsiveBorderRadius(24),
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  expertPressable: {
    flexDirection: 'row',
    padding: getResponsivePadding(screenData.isSmall ? 16 : 20),
    flex: 1,
    alignItems: 'flex-start',
  },
  expertImageContainer: {
    marginRight: getResponsiveMargin(16),
    alignItems: 'center',
  },
  expertImage: {
    width: getResponsiveWidth(screenData.isSmall ? 70 : 80),
    height: getResponsiveHeight(screenData.isSmall ? 70 : 80),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 35 : 40),
    borderWidth: 3,
    borderColor: '#F59E0B',
    marginBottom: getResponsiveMargin(8),
  },
  expertSpecialtyBadge: {
    fontSize: fontSizes.xs,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(10),
    overflow: 'hidden',
  },
  expertContent: {
    flex: 1,
    justifyContent: 'space-between',
    height: getResponsiveHeight(screenData.isSmall ? 150 : 180),
    paddingVertical: getResponsivePadding(8),
  },
  expertHeader: {
    marginBottom: getResponsiveMargin(12),
  },
  expertName: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: getResponsiveMargin(4),
    lineHeight: fontSizes.lg + 4,
  },
  expertSpecialty: {
    fontSize: fontSizes.sm,
    color: '#666',
    fontWeight: '600',
    marginBottom: getResponsiveMargin(8),
  },
  expertDescriptionContainer: {
    marginBottom: getResponsiveMargin(12),
    paddingRight: getResponsivePadding(8),
  },
  expertDescription: {
    fontSize: fontSizes.xs,
    color: '#333',
    lineHeight: fontSizes.xs + 5,
    fontWeight: '400',
    textAlign: 'left',
  },
  expertMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: getResponsiveMargin(14),
    paddingRight: getResponsivePadding(8),
  },
  expertRating: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: '#D97706',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  expertRatingText: {
    fontSize: fontSizes.xs,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  expertPrice: {
    fontSize: fontSizes.md,
    color: '#2C2C2C',
    fontWeight: '700',
  },
  bookButton: {
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : 24),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 12 : 14),
    borderRadius: getResponsiveBorderRadius(20),
    shadowColor: '#4DD0E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'stretch',
  },
  bookButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(20),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionImage: {
    width: getResponsiveWidth(60),
    height: getResponsiveHeight(60),
    borderRadius: getResponsiveBorderRadius(12),
    marginRight: getResponsiveMargin(16),
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: getResponsiveMargin(4),
  },
  sessionTime: {
    fontSize: getResponsiveFontSize(14),
    color: '#F15A29',
  },
  joinButton: {
    backgroundColor: '#4DD0E1',
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(20),
  },
  joinButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: '#ffffff',
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(20),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipIconContainer: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: '#FFE5B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(16),
  },
  tipIcon: {
    fontSize: getResponsiveFontSize(20),
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: getResponsiveMargin(4),
  },
  tipDescription: {
    fontSize: getResponsiveFontSize(14),
    color: '#666',
    lineHeight: getResponsiveHeight(20),
  },
  // Health Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getResponsiveWidth(12),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: getResponsiveFontSize(24),
    marginBottom: getResponsiveMargin(8),
  },
  statNumber: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  // Weekly Goals Styles
  seeAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  seeAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  goalsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  goalItem: {
    marginBottom: 16,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  goalProgress: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    height: getResponsiveHeight(6),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: getResponsiveBorderRadius(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: getResponsiveBorderRadius(3),
  },
  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveWidth(12),
  },
  quickActionCard: {
    width: (width - getResponsiveWidth(64)) / 2,
    height: getResponsiveHeight(100),
    borderRadius: getResponsiveBorderRadius(16),
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: getResponsivePadding(16),
  },
  quickActionIcon: {
    fontSize: getResponsiveFontSize(28),
    marginBottom: getResponsiveMargin(8),
  },
  quickActionText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Articles Styles
  articleCard: {
    width: getResponsiveWidth(200),
    marginRight: getResponsiveMargin(16),
    borderRadius: getResponsiveBorderRadius(16),
    overflow: 'hidden',
  },
  articleCardGradient: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: getResponsiveBorderRadius(16),
  },
  articleImage: {
    width: '100%',
    height: getResponsiveHeight(120),
  },
  articleContent: {
    padding: getResponsivePadding(16),
  },
  articleTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(8),
    lineHeight: getResponsiveHeight(22),
  },
  articleAuthor: {
    fontSize: getResponsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: getResponsiveMargin(4),
  },
  articleReadTime: {
    fontSize: getResponsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Community Styles
  communityCard: {
    padding: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: getResponsiveMargin(20),
  },
  communityStatItem: {
    alignItems: 'center',
  },
  communityStatNumber: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(4),
  },
  communityStatLabel: {
    fontSize: getResponsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  joinCommunityButton: {
    borderRadius: getResponsiveBorderRadius(12),
    overflow: 'hidden',
  },
  joinCommunityGradient: {
    paddingVertical: getResponsivePadding(12),
    alignItems: 'center',
  },
  joinCommunityText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: FOOTER_HEIGHT + getResponsiveHeight(60), // Footer height + extra padding for better spacing
  },
});