import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Footer from '../src/components/Footer';
import { colors } from '../src/utils/colors';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '../src/utils/dimensions';

export default function ContentScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Yoga', 'Ayurveda', 'Diet', 'Meditation'];

  const contentItems = [
    {
      id: 1,
      title: 'The Power of Mindful Eating',
      description: 'Learn how to eat with intention and awareness to improve your relationship with food.',
      category: 'Diet',
      type: 'article',
      duration: '6 min read',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'Yoga for Stress Relief',
      description: 'Unwind with a gentle Yoga flow focused on relaxation.',
      category: 'Yoga',
      type: 'video',
      duration: '15 min read',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: 'Ayurvedic Tips for Better Sleep',
      description: 'Discover ancient wisdom to improve your sleep quality.',
      category: 'Ayurveda',
      type: 'article',
      duration: '7 min read',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      featured: true
    },
    {
      id: 4,
      title: 'Morning Meditation Practice',
      description: '10-minute guided meditation to start your day with clarity.',
      category: 'Meditation',
      type: 'audio',
      duration: '10 min',
      image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=300&h=200&fit=crop',
      featured: false
    },
    {
      id: 5,
      title: 'Detox Water Recipes',
      description: 'Refresh your body with these natural detox water combinations.',
      category: 'Diet',
      type: 'article',
      duration: '4 min read',
      image: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=300&h=200&fit=crop',
      featured: false
    },
    {
      id: 6,
      title: 'Sun Salutation Sequence',
      description: 'Master the classic Sun Salutation with step-by-step guidance.',
      category: 'Yoga',
      type: 'video',
      duration: '20 min',
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=200&fit=crop',
      featured: true
    },
    {
      id: 7,
      title: 'Breathing Techniques for Anxiety',
      description: 'Simple pranayama techniques to calm your mind instantly.',
      category: 'Meditation',
      type: 'video',
      duration: '8 min',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=300&h=200&fit=crop',
      featured: false
    },
    {
      id: 8,
      title: 'Herbs for Natural Healing',
      description: 'Explore the healing properties of common Ayurvedic herbs.',
      category: 'Ayurveda',
      type: 'article',
      duration: '12 min read',
      image: 'https://images.unsplash.com/photo-1556909975-f50d8e750609?w=300&h=200&fit=crop',
      featured: false
    }
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredContent = contentItems.filter(item => item.featured);

  const handleBackPress = () => {
    router.back();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎧';
      case 'article': default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return colors.coralAccent;
      case 'audio': return colors.royalGold;
      case 'article': default: return colors.deepTeal;
    }
  };

  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Wellness Content</Text>
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search content..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive
                ]}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Content */}
        {selectedCategory === 'All' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Content</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
              {featuredContent.map((item) => (
                <Pressable key={item.id} style={styles.featuredCard}>
                  <Image source={{ uri: item.image }} style={styles.featuredImage} />
                  <View style={styles.featuredOverlay}>
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>Featured</Text>
                    </View>
                    <Text style={styles.featuredTitle}>{item.title}</Text>
                    <Text style={styles.featuredDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.featuredMeta}>
                      <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]}>
                        <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
                      </View>
                      <Text style={styles.featuredDuration}>{item.duration}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Content' : `${selectedCategory} Content`}
          </Text>
          {filteredContent.map((item, index) => {
            const gradients = [
              ['rgba(247, 246, 250, 0.9)', 'rgba(248, 248, 248, 0.9)'], // Purple gradient
                ['rgba(247, 246, 250, 0.9)', 'rgba(248, 248, 248, 0.9)'], // Green gradient  
                ['rgba(247, 246, 250, 0.9)', 'rgba(248, 248, 248, 0.9)'],// Pink gradient
            ];
            return (
              <LinearGradient
                key={item.id}
                colors={gradients[index % gradients.length]}
                style={styles.contentCard}
              >
                <Pressable style={styles.contentCardPressable}>
                  <Image source={{ uri: item.image }} style={styles.contentImage} />
                  <View style={styles.contentInfo}>
                    <View style={styles.contentHeader}>
                      <View style={[styles.categoryBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                        <Text style={[styles.categoryBadgeText, { color: getTypeColor(item.type) }]}>
                          {item.category}
                        </Text>
                      </View>
                      <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]}>
                        <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
                      </View>
                    </View>
                    <Text style={styles.contentTitle}>{item.title}</Text>
                    <Text style={styles.contentDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.contentFooter}>
                      <Text style={styles.contentDuration}>{item.duration}</Text>
                      <View style={styles.bookmarkButton}>
                        <Text style={styles.bookmarkIcon}>🔖</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </LinearGradient>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer activeRoute="content" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: getResponsivePadding(60),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(18),
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchIcon: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: '#333',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getResponsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 3,
  },
  categoriesContainer: {
    paddingLeft: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(24),
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(20),
    marginRight: getResponsiveMargin(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  categoryChipText: {
    fontSize: getResponsiveFontSize(14),
    color: '#ffffff',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  section: {
    marginBottom: getResponsiveMargin(32),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
  },
  featuredScroll: {
    paddingLeft: getResponsivePadding(20),
  },
  featuredCard: {
    width: getResponsiveWidth(280),
    height: getResponsiveHeight(180),
    marginRight: getResponsiveMargin(16),
    borderRadius: getResponsiveBorderRadius(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: getResponsivePadding(16),
    justifyContent: 'space-between',
  },
  featuredBadge: {
    backgroundColor: '#F59E0B',
    alignSelf: 'flex-start',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
  },
  featuredBadgeText: {
    fontSize: getResponsiveFontSize(10),
    color: colors.white,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: getResponsiveMargin(4),
  },
  featuredDescription: {
    fontSize: getResponsiveFontSize(14),
    color: colors.white,
    opacity: 0.9,
    marginBottom: getResponsiveMargin(8),
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredDuration: {
    fontSize: getResponsiveFontSize(12),
    color: colors.white,
    fontWeight: '600',
  },
  contentCard: {
    borderRadius: getResponsiveBorderRadius(20),
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getResponsiveHeight(6) },
    shadowOpacity: 0.15,
    shadowRadius: getResponsiveBorderRadius(10),
    elevation: 6,
  },
  contentCardPressable: {
    flexDirection: 'row',
    padding: getResponsivePadding(16),
  },
  contentImage: {
    width: getResponsiveWidth(80),
    height: getResponsiveHeight(80),
    borderRadius: getResponsiveBorderRadius(12),
    marginRight: getResponsiveMargin(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  contentInfo: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  categoryBadge: {
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(8),
  },
  categoryBadgeText: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: 'bold',
  },
  typeIndicator: {
    width: getResponsiveWidth(24),
    height: getResponsiveHeight(24),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIcon: {
    fontSize: getResponsiveFontSize(12),
  },
  contentTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: getResponsiveMargin(4),
  },
  contentDescription: {
    fontSize: getResponsiveFontSize(12),
    color: '#555',
    lineHeight: getResponsiveHeight(16),
    marginBottom: getResponsiveMargin(12),
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentDuration: {
    fontSize: getResponsiveFontSize(12),
    color: '#666',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: getResponsivePadding(4),
  },
  bookmarkIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  bottomSpacer: {
    height: getResponsiveHeight(100),
  },
});