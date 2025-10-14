import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '../src/utils/dimensions';

export default function AllReviewsScreen() {
  // All reviews data - in a real app this would come from API with expert ID
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5.0,
      comment: 'Amazing yoga sessions! Dr. Anya helped me improve my flexibility and find inner peace.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=50&h=50&fit=crop&crop=face',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 4.8,
      comment: 'Very knowledgeable and patient instructor. The meditation techniques are life-changing.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emma Davis',
      rating: 5.0,
      comment: 'Dr. Anya is absolutely wonderful! Her approach to yoga is both traditional and modern. I have learned so much.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'James Wilson',
      rating: 4.9,
      comment: 'Excellent sessions that helped me reduce stress and improve posture. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '1 month ago'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      rating: 4.7,
      comment: 'Great instructor with deep knowledge of yoga philosophy. The sessions are well structured.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=50&h=50&fit=crop&crop=face',
      date: '2 months ago'
    },
    {
      id: 6,
      name: 'David Martinez',
      rating: 5.0,
      comment: 'Life-changing experience! Dr. Anya helped me find balance in both body and mind.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      date: '1 week ago'
    },
    {
      id: 7,
      name: 'Rachel Green',
      rating: 4.8,
      comment: 'Professional and caring approach. The meditation techniques have really helped with my anxiety.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      date: '3 weeks ago'
    },
    {
      id: 8,
      name: 'Tom Anderson',
      rating: 4.9,
      comment: 'Amazing flexibility improvements and stress relief. Dr. Anya is the best yoga instructor I have worked with.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '2 weeks ago'
    }
  ];

  const expert = {
    name: 'Dr. Anya Sharma',
    reviews: 156,
    rating: 4.9
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#37b9a8ff', '#37b9a8ff', '#37b9a8ff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#37b9a8ff" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>All Reviews</Text>
          <Text style={styles.subtitle}>{reviews.length} total reviews for {expert.name}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Reviews List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.reviewsContainer}>
          {reviews.map((review, index) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.image }} style={styles.reviewerImage} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.reviewMeta}>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} style={styles.reviewStar}>
                          {star <= review.rating ? '★' : '☆'}
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              
              {/* Review Actions */}
              <View style={styles.reviewActions}>
                <Pressable style={styles.helpfulButton}>
                  <Text style={styles.helpfulIcon}>👍</Text>
                  <Text style={styles.helpfulText}>Helpful</Text>
                </Pressable>
                <Pressable style={styles.replyButton}>
                  <Text style={styles.replyText}>Reply</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(24),
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: getResponsiveMargin(4),
  },
  subtitle: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  headerSpacer: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  reviewsContainer: {
    paddingHorizontal: getResponsivePadding(20),
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 5,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  reviewerImage: {
    width: getResponsiveWidth(60),
    height: getResponsiveHeight(60),
    borderRadius: getResponsiveBorderRadius(30),
    marginRight: getResponsiveMargin(16),
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: getResponsiveMargin(6),
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: getResponsiveMargin(12),
  },
  reviewStar: {
    fontSize: getResponsiveFontSize(16),
    color: '#F59E0B',
    marginRight: getResponsiveMargin(2),
  },
  reviewDate: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
  },
  ratingBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: getResponsiveBorderRadius(8),
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
  },
  ratingText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reviewComment: {
    fontSize: getResponsiveFontSize(16),
    color: '#374151',
    lineHeight: getResponsiveHeight(24),
    marginBottom: getResponsiveMargin(16),
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: getResponsivePadding(16),
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: '#37b9a8',
  },
  helpfulIcon: {
    fontSize: getResponsiveFontSize(16),
    marginRight: getResponsiveMargin(6),
  },
  helpfulText: {
    fontSize: getResponsiveFontSize(14),
    color: '#37b9a8',
    fontWeight: '600',
  },
  replyButton: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  replyText: {
    fontSize: getResponsiveFontSize(14),
    color: '#F59E0B',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: getResponsiveHeight(40),
  },
});