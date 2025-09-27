import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
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
          {filteredContent.map((item) => (
            <Pressable key={item.id} style={styles.contentCard}>
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
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/experts')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Experts</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>Sessions</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={[styles.navIcon, styles.navIconActive]}>📱</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Content</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.deepTeal,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.charcoalGray,
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: colors.warmGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.lightMistTeal,
  },
  categoryChipActive: {
    backgroundColor: colors.sageGreen,
    borderColor: colors.sageGreen,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  featuredScroll: {
    paddingLeft: 20,
  },
  featuredCard: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  featuredBadge: {
    backgroundColor: colors.royalGold,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredDuration: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: colors.warmGray,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  contentInfo: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  typeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIcon: {
    fontSize: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 12,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentDuration: {
    fontSize: 12,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  bottomSpacer: {
    height: 90,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightMistTeal,
    paddingTop: 8,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
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