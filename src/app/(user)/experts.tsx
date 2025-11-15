import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Footer, { FOOTER_HEIGHT } from '@/components/Footer';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '@/utils/dimensions';
import { apiService, handleApiError } from '@/services/apiService';

type Expert = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  specialization?: string;
  experience?: number;
  hourlyRate?: number;
  bio?: string;
  profileImage?: string;
  verificationStatus?: string;
  rating?: {
    average?: number;
    totalReviews?: number;
  };
};

const PRICE_FILTERS: { label: string; min: number; max: number }[] = [
  { label: 'All', min: 0, max: Number.POSITIVE_INFINITY },
  { label: '₹0-499', min: 0, max: 499 },
  { label: '₹500-999', min: 500, max: 999 },
  { label: '₹1000+', min: 1000, max: Number.POSITIVE_INFINITY }
];

const RATING_FILTERS = ['All', '4.5+', '4.0+', '3.5+'];
const RESULTS_PER_PAGE = 10;

export default function ExpertsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState<string>(RATING_FILTERS[0]);
  const [selectedPrice, setSelectedPrice] = useState<string>(PRICE_FILTERS[0].label);
  const [showFilters, setShowFilters] = useState(false);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    experts.forEach((expert) => {
      if (expert.specialization) {
        unique.add(expert.specialization);
      }
    });
    const categoryList = Array.from(unique).sort((a, b) => a.localeCompare(b));
    return ['All', ...categoryList];
  }, [experts]);

  useEffect(() => {
    if (selectedCategory !== 'All' && !categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  const fetchExperts = useCallback(
    async (options?: { refresh?: boolean; page?: number }) => {
      const targetPage = options?.page ?? 1;
      const isRefresh = options?.refresh ?? targetPage === 1;
      const isInitialLoad = targetPage === 1 && !isRefresh;

      if (isRefresh) {
        setRefreshing(true);
      } else if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      if (targetPage === 1) {
        setHasNextPage(true);
      }

      setError(null);

      try {
        const response = await apiService.getAllExperts({
          page: targetPage,
          limit: RESULTS_PER_PAGE,
          sortBy: 'createdAt',
        });

        const data =
          response?.data?.experts ??
          response?.data?.data?.experts ??
          response?.experts ??
          (Array.isArray(response) ? response : []);

        const pagination =
          response?.data?.pagination ??
          response?.data?.data?.pagination ??
          response?.pagination ??
          null;

        const expertsArray = Array.isArray(data) ? data : [];

        setExperts((prev) => {
          if (targetPage === 1) {
            return expertsArray;
          }

          const existingIds = new Set(prev.map((expert) => expert._id ?? expert.id));
          const newExperts = expertsArray.filter((expert) => {
            const identifier = expert._id ?? expert.id;
            return identifier ? !existingIds.has(identifier) : true;
          });

          return [...prev, ...newExperts];
        });

        setCurrentPage(targetPage);

        if (pagination && typeof pagination.hasNext !== 'undefined') {
          setHasNextPage(Boolean(pagination.hasNext));
        } else {
          setHasNextPage(expertsArray.length === RESULTS_PER_PAGE);
        }
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else if (isInitialLoad) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const onRefresh = useCallback(() => {
    fetchExperts({ refresh: true, page: 1 });
  }, [fetchExperts]);

  const filteredExperts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const ratingThreshold = selectedRating === 'All' ? null : parseFloat(selectedRating);
    const priceRange = PRICE_FILTERS.find((filter) => filter.label === selectedPrice);

    return experts.filter((expert) => {
      const fullName = [expert.firstName, expert.lastName].filter(Boolean).join(' ').trim();
      const displayName = fullName || expert.name || '';
      const specialization = expert.specialization || '';
      const bio = expert.bio || '';

      const matchesSearch =
        query.length === 0 ||
        displayName.toLowerCase().includes(query) ||
        specialization.toLowerCase().includes(query) ||
        bio.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' ||
        specialization.toLowerCase() === selectedCategory.toLowerCase();

      const expertRating =
        typeof expert.rating?.average === 'number'
          ? expert.rating.average
          : typeof (expert as any).averageRating === 'number'
          ? (expert as any).averageRating
          : 0;

      const matchesRating =
        ratingThreshold === null || expertRating >= ratingThreshold;

      const hourlyRate =
        typeof expert.hourlyRate === 'number' ? expert.hourlyRate : 0;

      const matchesPrice =
        !priceRange ||
        priceRange.label === 'All' ||
        (hourlyRate >= priceRange.min && hourlyRate <= priceRange.max);

      return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });
  }, [experts, searchQuery, selectedCategory, selectedRating, selectedPrice]);

  const handleExpertPress = (expertId?: string) => {
    if (!expertId) {
      return;
    }
    router.push({ pathname: '/expert-detail', params: { id: expertId } });
  };

  return (
    <LinearGradient
      colors={['#2da898ff', '#abeee6ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
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
            placeholderTextColor="#999999"
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
                {RATING_FILTERS.map((rating) => (
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
                {PRICE_FILTERS.map((priceRange) => (
                  <Pressable
                    key={priceRange.label}
                    style={[
                      styles.filterChip,
                      selectedPrice === priceRange.label && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedPrice(priceRange.label)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedPrice === priceRange.label && styles.filterChipTextActive
                    ]}>
                      {priceRange.label}
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
      <ScrollView
        style={styles.expertsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2da898"
            colors={['#2da898']}
          />
        }
        contentContainerStyle={styles.expertsContentContainer}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => fetchExperts()}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {loading && experts.length > 0 && (
          <View style={styles.loadingInlineContainer}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.loadingInlineText}>Refreshing experts...</Text>
          </View>
        )}

        {loading && experts.length === 0 ? (
          <View style={styles.loadingStateContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading experts...</Text>
          </View>
        ) : filteredExperts.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No experts found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your filters or search query.
            </Text>
            {hasNextPage && (
              <Pressable
                style={[styles.loadMoreButton, styles.emptyLoadMoreButton]}
                onPress={() => fetchExperts({ page: currentPage + 1 })}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#2da898" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More Experts</Text>
                )}
              </Pressable>
            )}
            <Pressable
              style={styles.resetFiltersButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedRating(RATING_FILTERS[0]);
                setSelectedPrice(PRICE_FILTERS[0].label);
                fetchExperts({ page: 1 });
              }}
            >
              <Text style={styles.resetFiltersText}>Reset filters</Text>
            </Pressable>
          </View>
        ) : (
          filteredExperts.map((expert, index) => {
            const gradients = [
              ['#ffffff', '#f8f9fa'],
              ['#ffffff', '#f8f9fa'],
              ['#ffffff', '#f8f9fa']
            ];
            const expertId = expert._id || expert.id || `expert-${index}`;
            const fullName = [expert.firstName, expert.lastName].filter(Boolean).join(' ').trim();
            const displayName = fullName || expert.name || expert.email || 'Expert';
            const specialization = expert.specialization || 'Specialist';
            const experienceYears =
              typeof expert.experience === 'number' ? expert.experience : undefined;
            const experienceText =
              typeof experienceYears === 'number' && experienceYears > 0
                ? `${experienceYears} year${experienceYears > 1 ? 's' : ''} experience`
                : 'Experience info coming soon';
            const expertRating =
              typeof expert.rating?.average === 'number'
                ? expert.rating.average
                : typeof (expert as any).averageRating === 'number'
                ? (expert as any).averageRating
                : 0;
            const ratingDisplay = expertRating > 0 ? expertRating.toFixed(1) : 'New';
            const priceDisplay =
              typeof expert.hourlyRate === 'number' && expert.hourlyRate > 0
                ? `₹${expert.hourlyRate}/hr`
                : 'Contact for price';
            const bio = expert.bio || 'Bio coming soon';
            const verified =
              (expert.verificationStatus || '').toLowerCase() === 'approved';
            const avatarName = encodeURIComponent(displayName || 'Expert');
            const profileImage =
              expert.profileImage ||
              `https://ui-avatars.com/api/?name=${avatarName}&background=37b9a8&color=fff&size=128`;

            return (
              <LinearGradient
                key={expertId}
                colors={gradients[index % gradients.length]}
                style={styles.expertCard}
              >
                <Pressable
                  style={styles.expertCardPressable}
                  onPress={() => handleExpertPress(expertId)}
                >
                  <Image source={{ uri: profileImage }} style={styles.expertImage} />
                  <View style={styles.expertInfo}>
                    <View style={styles.expertHeader}>
                      <Text style={styles.expertName}>{displayName}</Text>
                      {verified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.expertSpecialty}>{specialization}</Text>
                    <Text style={styles.expertExperience}>{experienceText}</Text>
                    <Text style={styles.expertDescription} numberOfLines={2}>
                      {bio}
                    </Text>
                    <View style={styles.expertFooter}>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {ratingDisplay}</Text>
                        <Text style={styles.price}>{priceDisplay}</Text>
                      </View>
                      <View style={styles.buttonContainer}>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleExpertPress(expertId);
                          }}
                        >
                          <LinearGradient
                            colors={['#2da898ff', '#2da898ff']}
                            style={styles.viewProfileButton}
                          >
                            <Text style={styles.viewProfileText}>View Profile</Text>
                          </LinearGradient>
                        </Pressable>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push({ pathname: '/booking', params: { expertId: expertId } });
                          }}
                          style={styles.bookSessionButton}
                        >
                          <Text style={styles.bookSessionText}>Book Session</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </LinearGradient>
            );
          })
        )}
        {filteredExperts.length > 0 && hasNextPage && (
          <Pressable
            style={styles.loadMoreButton}
            onPress={() => fetchExperts({ page: currentPage + 1 })}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color="#2da898" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </Pressable>
        )}
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
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: '#575623ff',
    borderColor: '#575623ff',
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
    color: '#575623ff',
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
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
    color: '#575623ff',
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
    backgroundColor: '#575623ff',
    borderColor: '#575623ff',
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
  expertsContentContainer: {
    paddingBottom: getResponsivePadding(16),
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: getResponsiveMargin(16),
    marginBottom: getResponsiveMargin(16),
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorText: {
    color: '#ffffff',
    fontSize: getResponsiveFontSize(13),
    marginBottom: getResponsiveMargin(8),
    fontWeight: '500',
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(20),
  },
  retryButtonText: {
    color: '#2da898',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  loadingInlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: getResponsiveMargin(16),
    marginBottom: getResponsiveMargin(16),
    gap: getResponsiveWidth(8),
  },
  loadingInlineText: {
    color: '#ffffff',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '500',
  },
  loadingStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsivePadding(32),
  },
  loadingText: {
    marginTop: getResponsiveMargin(12),
    color: '#ffffff',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsivePadding(40),
    paddingHorizontal: getResponsivePadding(20),
  },
  emptyStateTitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: getResponsiveMargin(8),
  },
  emptyStateSubtitle: {
    fontSize: getResponsiveFontSize(13),
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  resetFiltersButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(20),
  },
  resetFiltersText: {
    color: '#2da898',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  loadMoreButton: {
    marginHorizontal: getResponsiveMargin(16),
    marginTop: getResponsiveMargin(12),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(24),
    borderWidth: 2,
    borderColor: '#2da898',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  loadMoreText: {
    color: '#2da898',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyLoadMoreButton: {
    marginTop: getResponsiveMargin(8),
    marginBottom: getResponsiveMargin(12),
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
    color: '#575623ff',
    fontWeight: '600',
    marginBottom: getResponsiveMargin(2),
  },
  expertExperience: {
    fontSize: getResponsiveFontSize(11),
    color: '#575623ff',
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
  buttonContainer: {
    flexDirection: 'column',
    gap: getResponsiveMargin(6),
    alignItems: 'flex-end',
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
    shadowColor: '#2da898ff',
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
  bookSessionButton: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  bookSessionText: {
    fontSize: getResponsiveFontSize(11),
    color: '#ffffff',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: FOOTER_HEIGHT + getResponsiveHeight(60), // Footer height + extra padding for better spacing
  },
});