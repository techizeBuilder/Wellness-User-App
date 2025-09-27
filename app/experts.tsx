import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

export default function ExpertsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Experts</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for experts"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
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

          {/* Category Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Language</Text>
            <View style={styles.filterOptions}>
              <Pressable style={styles.filterChip}>
                <Text style={styles.filterChipText}>All</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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

      {/* Experts List */}
      <ScrollView style={styles.expertsContainer} showsVerticalScrollIndicator={false}>
        {filteredExperts.map((expert) => (
          <Pressable
            key={expert.id}
            style={styles.expertCard}
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
                <Pressable style={styles.viewProfileButton}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
    backgroundColor: colors.white,
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
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.charcoalGray,
  },
  filtersContainer: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  filterGroup: {
    marginRight: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.warmGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightMistTeal,
  },
  filterChipActive: {
    backgroundColor: colors.sageGreen,
    borderColor: colors.sageGreen,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 16,
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
    backgroundColor: colors.deepTeal,
    borderColor: colors.deepTeal,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  expertsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  expertCard: {
    flexDirection: 'row',
    backgroundColor: colors.warmGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expertImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: colors.sageGreen,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  expertSpecialty: {
    fontSize: 14,
    color: colors.royalGold,
    fontWeight: '600',
    marginBottom: 2,
  },
  expertExperience: {
    fontSize: 12,
    color: colors.charcoalGray,
    marginBottom: 8,
  },
  expertDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 12,
  },
  expertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: colors.coralAccent,
    fontWeight: 'bold',
  },
  viewProfileButton: {
    backgroundColor: colors.sageGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewProfileText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
});