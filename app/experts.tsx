import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Footer, { FOOTER_HEIGHT } from '../src/components/Footer';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '../src/utils/dimensions';

const { width } = Dimensions.get('window');

export default function ExpertsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Yoga', 'Ayurveda', 'Diet', 'Meditation', 'Fitness'];
  const ratingFilters = ['All', '4.5+', '4.0+', '3.5+'];
  const priceFilters = ['All', '$', '$$', '$$$'];

  const experts = [
    {
      id: 1,
      name: 'Dr. Anya Sharma',
      specialty: 'Yoga',
      experience: '5 years experience',
      rating: 4.9,
      price: '$$$',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      description: 'Anya is a certified Yoga master dedicated to helping you find inner peace and physical well-being through ancient practices.',
      verified: true
    },
    {
      id: 2,
      name: 'Dr. Rohan Verma',
      specialty: 'Ayurveda',
      experience: '8 years experience',
      rating: 4.8,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      description: 'Rohan offers holistic healing through Ayurveda, focusing on balancing the body\'s doshas for optimal health.',
      verified: true
    },
    {
      id: 3,
      name: 'Dr. Priya Kapoor',
      specialty: 'Diet',
      experience: '6 years experience',
      rating: 5.0,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      description: 'Priya creates personalized diet plans that nourish your body and mind, helping you achieve your wellness goals.',
      verified: true
    },
    {
      id: 4,
      name: 'Arjun Patel',
      specialty: 'Meditation',
      experience: '4 years experience',
      rating: 4.7,
      price: '$',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      description: 'Arjun specializes in mindfulness meditation techniques to reduce stress and improve mental clarity.',
      verified: true
    },
    {
      id: 5,
      name: 'Dr. Kavya Singh',
      specialty: 'Fitness',
      experience: '7 years experience',
      rating: 4.9,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=150&h=150&fit=crop&crop=face',
      description: 'Kavya combines traditional fitness with modern techniques for comprehensive physical wellness.',
      verified: true
    },
    {
      id: 6,
      name: 'Ravi Kumar',
      specialty: 'Yoga',
      experience: '3 years experience',
      rating: 4.6,
      price: '$',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      description: 'Ravi teaches traditional Hatha Yoga with focus on alignment and breathwork.',
      verified: false
    }
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || expert.specialty === selectedCategory;
    const matchesRating = selectedRating === 'All' || expert.rating >= parseFloat(selectedRating);
    const matchesPrice = selectedPrice === 'All' || expert.price === selectedPrice;
    
    return matchesSearch && matchesCategory && matchesRating && matchesPrice;
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleExpertPress = (expertId: number) => {
    router.push(`/expert-detail?id=${expertId}`);
  };

  return (
    <LinearGradient
     colors={['#23a897ff', '#269184ff', '#188d83ff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Compact Header */}
      <View style={styles.compactHeader}>
        {/* <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable> */}
        <Text style={styles.headerTitle}>Experts</Text>
        <Pressable 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </Pressable>
      </View>

      {/* Compact Search */}
      <View style={styles.compactSearchContainer}>
        <View style={styles.compactSearchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for experts"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Collapsible Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Rating Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Rating</Text>
              <View style={styles.filterOptions}>
                {ratingFilters.map((rating) => (
                  <Pressable
                    key={rating}
                    style={[
                      styles.filterChip,
                      selectedRating === rating && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedRating(rating)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedRating === rating && styles.filterChipTextActive
                    ]}>
                      {rating}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Price Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Price</Text>
              <View style={styles.filterOptions}>
                {priceFilters.map((price) => (
                  <Pressable
                    key={price}
                    style={[
                      styles.filterChip,
                      selectedPrice === price && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedPrice(price)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedPrice === price && styles.filterChipTextActive
                    ]}>
                      {price}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Compact Categories */}
      <View style={styles.compactCategoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.compactCategoryChip,
                selectedCategory === category && styles.compactCategoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.compactCategoryChipText,
                selectedCategory === category && styles.compactCategoryChipTextActive
              ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Experts List */}
      <ScrollView style={styles.expertsContainer} showsVerticalScrollIndicator={false}>
        {filteredExperts.map((expert, index) => {
          const gradients = [
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
                style={styles.expertCardPressable}
                onPress={() => handleExpertPress(expert.id)}
              >
                <Image source={{ uri: expert.image }} style={styles.expertImage} />
                <View style={styles.expertInfo}>
                  <View style={styles.expertHeader}>
                    <Text style={styles.expertName}>{expert.name}</Text>
                    {expert.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
                  <Text style={styles.expertExperience}>{expert.experience}</Text>
                  <Text style={styles.expertDescription} numberOfLines={2}>
                    {expert.description}
                  </Text>
                  <View style={styles.expertFooter}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.rating}>⭐ {expert.rating}</Text>
                      <Text style={styles.price}>{expert.price}</Text>
                    </View>
                    <LinearGradient
                      colors={['#4DD0E1', '#00CED1']}
                      style={styles.viewProfileButton}
                    >
                      <Text style={styles.viewProfileText}>View Profile</Text>
                    </LinearGradient>
                  </View>
                </View>
              </Pressable>
            </LinearGradient>
          );
        })}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <Footer activeRoute="experts" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Compact Header Styles
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterIcon: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
  },
  // Compact Search Styles
  compactSearchContainer: {
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(12),
  },
  compactSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: getResponsiveBorderRadius(25),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  // Compact Categories Styles
  compactCategoriesContainer: {
    paddingLeft: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
  },
  compactCategoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(20),
    marginRight: getResponsiveMargin(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  compactCategoryChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  compactCategoryChipText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  compactCategoryChipTextActive: {
    color: '#ffffff',
  },
  // Keep existing styles but update some measurements
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
  headerRight: {
    width: getResponsiveWidth(40),
  },
  searchContainer: {
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: getResponsiveFontSize(16),
    marginRight: getResponsiveMargin(12),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
  },
  filtersContainer: {
    paddingLeft: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(12),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
  },
  filterGroup: {
    marginRight: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  filterChipText: {
    fontSize: getResponsiveFontSize(12),
    color: '#ffffff',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  categoriesContainer: {
    paddingLeft: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  categoryChipText: {
    fontSize: getResponsiveFontSize(14),
    color: '#ffffff',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#333',
  },
  expertsContainer: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(16),
  },
  expertCard: {
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(16),
    padding: getResponsivePadding(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  expertCardPressable: {
    flexDirection: 'row',
    padding: getResponsivePadding(12),
  },
  expertImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  expertInfo: {
    flex: 1,
  },
  expertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  expertName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#F59E0B',
    width: getResponsiveWidth(18),
    height: getResponsiveHeight(18),
    borderRadius: getResponsiveBorderRadius(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: getResponsiveFontSize(10),
    color: '#ffffff',
    fontWeight: 'bold',
  },
  expertSpecialty: {
    fontSize: getResponsiveFontSize(12),
    color: '#666',
    fontWeight: '600',
    marginBottom: getResponsiveMargin(2),
  },
  expertExperience: {
    fontSize: getResponsiveFontSize(11),
    color: '#555',
    marginBottom: getResponsiveMargin(6),
  },
  expertDescription: {
    fontSize: getResponsiveFontSize(11),
    color: '#444',
    lineHeight: getResponsiveHeight(14),
    marginBottom: getResponsiveMargin(8),
  },
  expertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveWidth(12),
  },
  rating: {
    fontSize: getResponsiveFontSize(11),
    color: '#B8860B',
    fontWeight: 'bold',
  },
  price: {
    fontSize: getResponsiveFontSize(12),
    color: '#333',
    fontWeight: 'bold',
  },
  viewProfileButton: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(12),
    shadowColor: '#4DD0E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  viewProfileText: {
    fontSize: getResponsiveFontSize(11),
    color: '#ffffff',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: FOOTER_HEIGHT + getResponsiveHeight(30), // Footer height + extra padding
  },
});