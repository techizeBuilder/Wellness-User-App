import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";
import { apiService, handleApiError } from "@/services/apiService";
import { getProfileImageWithFallback } from "@/utils/imageHelpers";

type ExpertPlan = {
  _id: string;
  name: string;
  type: "single" | "monthly";
  description?: string;
  sessionClassType?: string;
  sessionFormat?: "one-on-one" | "one-to-many";
  price: number;
  monthlyPrice?: number;
  classesPerMonth?: number;
  duration?: number;
};

const WEEK_DAYS = [
  { label: "Sunday", key: "sunday" },
  { label: "Monday", key: "monday" },
  { label: "Tuesday", key: "tuesday" },
  { label: "Wednesday", key: "wednesday" },
  { label: "Thursday", key: "thursday" },
  { label: "Friday", key: "friday" },
  { label: "Saturday", key: "saturday" },
];

export default function ExpertDetailScreen() {
  const { id } = useLocalSearchParams();
  const expertId = Array.isArray(id) ? id[0] : id;
  const [expertData, setExpertData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [bookSessionAnim] = useState(new Animated.Value(1));
  const [plans, setPlans] = useState<ExpertPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const fetchExpertDetails = useCallback(async () => {
    if (!expertId) {
      setExpertData(null);
      setError("Expert not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getExpertProfile(expertId);
      const expertResponse =
        response?.data?.expert ??
        response?.data?.data?.expert ??
        response?.expert ??
        response?.data ??
        null;
      setExpertData(expertResponse ?? null);
    } catch (err) {
      setExpertData(null);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    fetchExpertDetails();
  }, [fetchExpertDetails]);

  const fetchExpertPlans = useCallback(async () => {
    if (!expertId) {
      setPlans([]);
      return;
    }

    try {
      setPlansLoading(true);
      const response = await apiService.getExpertPlans(expertId);
      const planResponse =
        response?.data?.plans ||
        response?.data?.data?.plans ||
        response?.plans ||
        response?.data ||
        [];
      setPlans(planResponse);
    } catch (error) {
      console.error("Error loading expert plans:", error);
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    fetchExpertPlans();
  }, [fetchExpertPlans]);

  // Auto-scroll state and ref
  const suggestedExpertsScrollRef = useRef(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const expert = useMemo(() => {
    const fallbackText = "Not available";
    const fullName = expertData
      ? [expertData.firstName, expertData.lastName]
          .filter(Boolean)
          .join(" ")
          .trim()
      : "";
    const specialization = expertData?.specialization?.trim();
    const hourlyRate =
      typeof expertData?.hourlyRate === "number" &&
      !Number.isNaN(expertData.hourlyRate)
        ? expertData.hourlyRate
        : null;
    const ratingValue =
      typeof expertData?.rating?.average === "number" &&
      !Number.isNaN(expertData.rating.average)
        ? expertData.rating.average
        : null;
    const reviewsValue =
      typeof expertData?.rating?.count === "number" &&
      !Number.isNaN(expertData.rating.count)
        ? expertData.rating.count
        : null;

    // let languages: string[] =
    //   Array.isArray(expertData?.languages) && expertData.languages.length > 0
    //     ? expertData.languages.filter(Boolean)
    //     : [];
    // if (languages.length === 0) {
    //   languages = [fallbackText];
    // }

    let sessionTypes: string[] =
      Array.isArray(expertData?.consultationMethods) &&
      expertData.consultationMethods.length > 0
        ? expertData.consultationMethods.filter(Boolean)
        : [];
    if (sessionTypes.length === 0) {
      sessionTypes = [fallbackText];
    }

    let specialties: string[] = specialization ? [specialization] : [];
    if (specialties.length === 0) {
      specialties = [fallbackText];
    }

    let qualifications: string[] = [];
    if (
      Array.isArray(expertData?.qualifications) &&
      expertData.qualifications.length > 0
    ) {
      qualifications = expertData.qualifications
        .map((qualification: any) => {
          if (!qualification) return null;
          const parts = [
            qualification.degree,
            qualification.institution,
            qualification.year ? String(qualification.year) : null,
          ].filter(Boolean);
          return parts.join(" • ") || null;
        })
        .filter(Boolean) as string[];
    }
    if (qualifications.length === 0) {
      qualifications = [fallbackText];
    }

    let certifications: string[] = [];
    if (
      Array.isArray(expertData?.certifications) &&
      expertData.certifications.length > 0
    ) {
      certifications = expertData.certifications
        .map((certification: any) => {
          if (!certification) return null;
          return (
            certification.name || certification.issuingOrganization || null
          );
        })
        .filter(Boolean) as string[];
    }
    if (certifications.length === 0) {
      certifications = [fallbackText];
    }

    const profileImage =
      getProfileImageWithFallback(expertData?.profileImage, fullName || "Expert") ||
      (fullName
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName
          )}&background=37b9a8&color=fff&size=300`
        : `https://ui-avatars.com/api/?name=Expert&background=37b9a8&color=fff&size=300`);

    const experienceText =
      typeof expertData?.experience === "number" && expertData.experience > 0
        ? `${expertData.experience} year${
            expertData.experience === 1 ? "" : "s"
          } experience`
        : fallbackText;

    return {
      id: expertData?._id ?? expertId ?? "",
      name: fullName || expertData?.name || fallbackText,
      title: specialization ? `${specialization} Expert` : fallbackText,
      specialty: specialization || fallbackText,
      experience: experienceText,
      rating: ratingValue ?? 0,
      ratingAvailable: ratingValue !== null,
      reviews: reviewsValue ?? 0,
      reviewsAvailable: reviewsValue !== null,
      price: hourlyRate !== null ? `₹${hourlyRate}` : fallbackText,
      sessionPrice:
        hourlyRate !== null ? `₹${hourlyRate}/session` : fallbackText,
      image: profileImage,
      verified:
        (expertData?.verificationStatus || "").toLowerCase() === "approved",
      about: expertData?.bio?.trim() || fallbackText,
      specialties,
      // languages,
      education: expertData?.education?.trim() || fallbackText,
      certifications,
      sessionTypes,
      consultationAreas:
        Array.isArray(expertData?.consultationAreas) &&
        expertData.consultationAreas.length > 0
          ? expertData.consultationAreas
          : [fallbackText],
      availabilityNote:
        expertData?.availability &&
        Object.keys(expertData.availability || {}).length > 0
          ? "Availability schedule provided"
          : fallbackText,
    };
  }, [expertData, expertId]);

  const formatTimeLabel = useCallback((value?: string) => {
    if (!value || typeof value !== "string") {
      return "";
    }
    const [hourString, minuteString = "00"] = value.split(":");
    const hours = parseInt(hourString, 10);
    const minutes = parseInt(minuteString, 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return value;
    }
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
  }, []);

  const weeklyAvailability = useMemo(() => {
    const availabilityData = expertData?.availability;

    return WEEK_DAYS.map((day) => {
      if (Array.isArray(availabilityData)) {
        const dayEntry = availabilityData.find(
          (entry: any) =>
            (entry?.day || "").toLowerCase() === day.label.toLowerCase()
        );

        if (!dayEntry || !dayEntry.isOpen) {
          return { ...day, isOpen: false, timeRanges: [] as string[] };
        }

        const timeRanges =
          dayEntry.timeRanges
            ?.map((range: any) => {
              if (!range?.startTime || !range?.endTime) {
                return null;
              }
              return `${formatTimeLabel(range.startTime)} - ${formatTimeLabel(
                range.endTime
              )}`;
            })
            .filter(Boolean) ?? [];

        return {
          ...day,
          isOpen: dayEntry.isOpen,
          timeRanges,
        };
      }

      if (availabilityData && typeof availabilityData === "object") {
        const keyMatch =
          availabilityData[day.key] ||
          availabilityData[day.label] ||
          availabilityData[day.label.toLowerCase()];

        if (!keyMatch || keyMatch.available === false) {
          return { ...day, isOpen: false, timeRanges: [] as string[] };
        }

        const startLabel = formatTimeLabel(keyMatch.start);
        const endLabel = formatTimeLabel(keyMatch.end);
        const timeRanges =
          startLabel && endLabel ? [`${startLabel} - ${endLabel}`] : [];

        return {
          ...day,
          isOpen: true,
          timeRanges,
        };
      }

      return { ...day, isOpen: false, timeRanges: [] as string[] };
    });
  }, [expertData?.availability, formatTimeLabel]);

  const hasSharedAvailability = useMemo(
    () =>
      weeklyAvailability.some(
        (day) =>
          day.isOpen && Array.isArray(day.timeRanges) && day.timeRanges.length > 0
      ),
    [weeklyAvailability]
  );

  const ratingDisplay = expert.ratingAvailable
    ? expert.rating.toFixed(1)
    : "Not available";
  const reviewsDisplay = expert.reviewsAvailable
    ? expert.reviews.toString()
    : "Not available";
  const nameSegmentsRaw =
    expert.name && expert.name !== "Not available"
      ? expert.name.trim().split(" ")
      : [expert.name || "Expert"];
  let primaryNameText = nameSegmentsRaw[0] || "Expert";
  let secondaryNameText = nameSegmentsRaw.slice(1).join(" ");
  if (expert.name === "Not available") {
    primaryNameText = expert.name;
    secondaryNameText = "";
  }

  const rawFeedback =
    Array.isArray((expertData as any)?.recentFeedback) &&
    (expertData as any)?.recentFeedback.length > 0
      ? (expertData as any).recentFeedback
      : [];

  const reviews = rawFeedback.map((feedback: any, index: number) => {
    const reviewerName =
      feedback?.user?.name ||
      `${feedback?.user?.firstName || ''} ${feedback?.user?.lastName || ''}`.trim() ||
      'Client';
    const reviewerImage =
      getProfileImageWithFallback(feedback?.user?.profileImage, reviewerName) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=37b9a8&color=fff&size=128`;

    const submittedAt = feedback?.submittedAt || feedback?.sessionDate;
    const formattedDate = submittedAt
      ? new Date(submittedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Recently';

    return {
      id: feedback?.id || feedback?._id || `review-${index}`,
      name: reviewerName,
      comment: feedback?.comment || '',
      rating: feedback?.rating || 0,
      date: formattedDate,
      image: reviewerImage,
    };
  });

  const suggestedExperts = [
    {
      id: 2,
      name: "Dr. Rohan Verma",
      specialty: "Ayurveda",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Arjun Patel",
      specialty: "Meditation",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Dr. Priya Singh",
      specialty: "Nutrition",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Rahul Sharma",
      specialty: "Fitness",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "Dr. Meera Joshi",
      specialty: "Mental Health",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1594824475520-b1de9d1b7a34?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 7,
      name: "Vikram Kumar",
      specialty: "Yoga Therapy",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
  ];

  // Auto-scroll effect for suggested experts
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        suggestedExpertsScrollRef.current &&
        suggestedExperts.length > 0 &&
        !isUserScrolling
      ) {
        const nextIndex = (currentScrollIndex + 1) % suggestedExperts.length;
        const cardWidth = getResponsiveWidth(155) + getResponsiveMargin(12); // card width + margin

        suggestedExpertsScrollRef.current.scrollTo({
          x: nextIndex * cardWidth,
          animated: true,
        });

        setCurrentScrollIndex(nextIndex);
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [currentScrollIndex, isUserScrolling, suggestedExperts.length]);

  const handleBackPress = () => {
    router.back();
  };

  const handleBookSession = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(bookSessionAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bookSessionAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (!expertId) {
      Alert.alert("Unavailable", "Expert information not available.");
      return;
    }

    router.push({
      pathname: "/booking",
      params: { expertId },
    });
  };

  const handleMoreInfo = () => {
    setShowMoreInfo(true);
  };

  return (
    <LinearGradient
      colors={["#37b9a8ff", "#37b9a8ff", "#37b9a8ff"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.loadingBanner}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.loadingBannerText}>
              Loading expert details…
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
            <Pressable
              style={styles.errorBannerButton}
              onPress={fetchExpertDetails}
            >
              <Text style={styles.errorBannerButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Header with Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: expert.image }} style={styles.headerImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
            locations={[0, 0.4, 1]}
            style={styles.headerGradient}
          >
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <View style={styles.headerInfo}>
              <View style={styles.expertNameContainer}>
                <Text style={styles.expertNameWhite}>{primaryNameText} </Text>
                {secondaryNameText.length > 0 && (
                  <Text style={styles.expertNameYellow}>
                    {secondaryNameText}
                  </Text>
                )}
              </View>
              {/* <Text style={styles.expertTitle}>{expert.title}</Text> */}
              <Text
                style={styles.headerDescription}
                numberOfLines={6}
                ellipsizeMode="tail"
              >
                {expert.about}
              </Text>
              <View style={styles.expertMeta}>
                <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
                {expert.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>

              {/* Netflix-style Action Buttons */}
              <View style={styles.actionButtons}>
                <Animated.View
                  style={[
                    styles.playButtonContainer,
                    { transform: [{ scale: bookSessionAnim }] },
                  ]}
                >
                  <Pressable
                    style={styles.playButton}
                    onPress={handleBookSession}
                  >
                    <Text style={styles.playIcon}>▶</Text>
                    <Text style={styles.playText}>Book Session</Text>
                  </Pressable>
                </Animated.View>
                <Pressable style={styles.infoButton} onPress={handleMoreInfo}>
                  <Text style={styles.infoIcon}>ⓘ</Text>
                  <Text style={styles.infoText}>More Info</Text>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNumber}>{ratingDisplay}</Text>
            <Text style={styles.statLabel}>
              {expert.reviewsAvailable
                ? `${reviewsDisplay} reviews`
                : "Reviews not available"}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statNumber}>
              {expert.experience.replace(" experience", "")}
            </Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statNumber}>{expert.price}</Text>
            <Text style={styles.statLabel}>Per session</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>
              About
            </Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>{expert.about}</Text>
          </View>

          {/* Credentials Cards */}
          <View style={styles.credentialsContainer}>
            {/* Education Card */}
            <View style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Text style={styles.credentialIcon}>🎓</Text>
                <Text style={styles.credentialTitle}>Education</Text>
              </View>
              <Text style={styles.credentialContent}>{expert.education}</Text>
            </View>

            {/* Certifications Card */}
            <View style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Text style={styles.credentialIcon}>📜</Text>
                <Text style={styles.credentialTitle}>Certifications</Text>
              </View>
              <View style={styles.certificationsContainer}>
                {expert.certifications.map((cert, index) => (
                  <View key={index} style={styles.certificationItem}>
                    <Text style={styles.certificationBullet}>•</Text>
                    <Text style={styles.certificationText}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Specialties Card */}
            <View style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Text style={styles.credentialIcon}>🎯</Text>
                <Text style={styles.credentialTitle}>Specialties</Text>
              </View>
              <View style={styles.specialtiesContainer}>
                {expert.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Languages Card */}
            {/* <View style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Text style={styles.credentialIcon}>🌍</Text>
                <Text style={styles.credentialTitle}>Languages</Text>
              </View>
              <Text style={styles.credentialContent}>{expert.languages.join(', ')}</Text>
            </View> */}

            {/* Session Types Card */}
            <View style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Text style={styles.credentialIcon}>💼</Text>
                <Text style={styles.credentialTitle}>Session Types</Text>
              </View>
              <View style={styles.sessionTypesContainer}>
                {expert.sessionTypes.map((type, index) => (
                  <View key={index} style={styles.sessionTypeItem}>
                    <Text style={styles.sessionTypeBullet}>✓</Text>
                    <Text style={styles.sessionTypeText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Availability Schedule Card */}
            <View style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <Text style={styles.credentialIcon}>🕒</Text>
                <Text style={styles.credentialTitle}>
                  Availability Schedule
                </Text>
              </View>
              <View style={styles.availabilitySchedule}>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleIcon}>📅</Text>
                  <Text style={styles.scheduleText}>Monday - Saturday</Text>
                </View>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleIcon}>⏰</Text>
                  <Text style={styles.scheduleText}>9:00 AM - 6:00 PM IST</Text>
                </View>
                <View style={styles.scheduleStatus}>
                  <Text style={styles.statusIcon}>🟢</Text>
                  <Text style={styles.statusText}>Available Today</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Plan Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Plan</Text>
          <Text style={styles.planSectionHint}>
            Review the available plans here; you can choose one during booking.
          </Text>
          {plansLoading ? (
            <View style={styles.planLoadingState}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.planLoadingText}>Loading plans...</Text>
            </View>
          ) : plans.length === 0 ? (
            <View style={styles.planEmptyState}>
              <Text style={styles.planEmptyTitle}>No plans published</Text>
              <Text style={styles.planEmptySubtitle}>
                This expert hasn&apos;t shared yoga plans yet.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.planOptionsScroll}
              contentContainerStyle={styles.planOptionsContainer}
            >
              {plans.map((plan) => {
                const planPrice =
                  plan.type === "monthly"
                    ? `₹${(plan.monthlyPrice || plan.price).toLocaleString()}/month`
                    : `₹${plan.price.toLocaleString()} per class`;
                const planMeta =
                  plan.type === "monthly"
                    ? `${plan.classesPerMonth || 0} classes/month`
                    : `${plan.duration || 60} min session`;
                return (
                  <View key={plan._id} style={styles.planOptionCard}>
                    <View style={styles.planOptionHeader}>
                      <Text style={styles.planOptionTitle}>{plan.name}</Text>
                      <Text
                        style={[
                          styles.planTypePill,
                          plan.type === "monthly"
                            ? styles.planTypeMonthly
                            : styles.planTypeSingle,
                        ]}
                      >
                        {plan.type === "monthly" ? "Monthly" : "Single"}
                      </Text>
                    </View>
                    <Text style={styles.planOptionPrice}>{planPrice}</Text>
                    <Text style={styles.planOptionMeta}>{planMeta}</Text>
                    {plan.sessionClassType && (
                      <Text style={styles.planOptionSubtext}>
                        Focus: {plan.sessionClassType}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Availability</Text>
          <Text style={styles.planSectionHint}>
            {hasSharedAvailability
              ? "Shared schedule from the expert. Exact slots are finalized on the booking screen."
              : "This expert hasn’t shared weekly timings yet. You can still request a slot on the booking screen."}
          </Text>

          {hasSharedAvailability ? (
            <View style={styles.weeklyAvailabilityGrid}>
              {weeklyAvailability.map((day) => (
                <View
                  key={day.label}
                  style={[
                    styles.weeklyDayCard,
                    !day.isOpen && styles.weeklyDayCardClosed,
                  ]}
                >
                  <View style={styles.weeklyDayHeader}>
                    <View style={styles.weeklyDayBadge}>
                      <Text
                        style={[
                          styles.weeklyDayBadgeText,
                          day.isOpen && styles.weeklyDayBadgeTextOpen,
                        ]}
                      >
                        {day.label.slice(0, 1)}
                      </Text>
                    </View>
                    <View style={styles.weeklyDayInfo}>
                      <Text
                        style={[
                          styles.weeklyDayName,
                          !day.isOpen && styles.weeklyDayNameClosed,
                        ]}
                      >
                        {day.label}
                      </Text>
                      <Text
                        style={[
                          styles.weeklyDayStatus,
                          day.isOpen
                            ? styles.weeklyDayStatusOpen
                            : styles.weeklyDayStatusClosed,
                        ]}
                      >
                        {day.isOpen ? "Open" : "Closed"}
                      </Text>
                    </View>
                  </View>
                  {day.isOpen && day.timeRanges.length > 0 ? (
                    <View style={styles.weeklySlotsContainer}>
                      {day.timeRanges.map((slot, index) => (
                        <View
                          key={`${day.label}-${index}`}
                          style={styles.weeklySlotPill}
                        >
                          <Text style={styles.weeklySlotText}>{slot}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.weeklySlotTextMuted}>
                      {day.isOpen
                        ? "Timings not specified"
                        : "Not taking sessions"}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.planEmptyState}>
              <Text style={styles.planEmptyTitle}>Availability not shared</Text>
              <Text style={styles.planEmptySubtitle}>
                Timings will be confirmed after you tap “Book Session”.
              </Text>
            </View>
          )}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews ({reviewsDisplay})</Text>
            <Pressable
              style={styles.seeAllButton}
              onPress={() => router.push("/all-reviews")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>

          {/* Overall Rating Summary */}
          <View style={styles.ratingsSummary}>
            <View style={styles.averageRating}>
              <Text style={styles.averageScore}>{ratingDisplay}</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.star}>
                    {star <= Math.floor(expert.rating)
                      ? "★"
                      : star <= expert.rating
                      ? "☆"
                      : "☆"}
                  </Text>
                ))}
              </View>
              <Text style={styles.reviewCount}>
                {expert.reviewsAvailable
                  ? `${reviewsDisplay} reviews`
                  : "Reviews not available"}
              </Text>
            </View>
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <View key={rating} style={styles.ratingBarRow}>
                  <Text style={styles.ratingNumber}>{rating}</Text>
                  <Text style={styles.starSmall}>★</Text>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingBarFill,
                        {
                          width: `${
                            rating === 5 ? 70 : rating === 4 ? 25 : 5
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Individual Reviews - Show only first 2 */}
          {reviews.length === 0 ? (
            <Text style={styles.noReviewsText}>Reviews not available</Text>
          ) : (
            reviews.slice(0, 2).map((review: any, index: number) => {
              const reviewerName = review?.name || "Anonymous";
              const reviewerComment =
                review?.comment || "No review text provided.";
              const reviewerRating =
                typeof review?.rating === "number" &&
                !Number.isNaN(review.rating)
                  ? review.rating
                  : 0;
              const reviewerDate = review?.date || "Date not available";
              const reviewerImage =
                review?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  reviewerName
                )}&background=37b9a8&color=fff&size=128`;

              return (
                <View key={review?.id ?? index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: reviewerImage }}
                      style={styles.reviewerImage}
                    />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewerName}>{reviewerName}</Text>
                      <View style={styles.reviewMeta}>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Text key={star} style={styles.reviewStar}>
                              {star <= Math.round(reviewerRating) ? "★" : "☆"}
                            </Text>
                          ))}
                        </View>
                        <Text style={styles.reviewDate}>{reviewerDate}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{reviewerComment}</Text>

                  {/* Helpful Actions */}
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
              );
            })
          )}
        </View>

        {/* Suggested Experts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Experts</Text>

          <ScrollView
            ref={suggestedExpertsScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
            decelerationRate="fast"
            snapToInterval={getResponsiveWidth(155) + getResponsiveMargin(12)}
            snapToAlignment="start"
            contentContainerStyle={styles.suggestedScrollContainer}
            automaticallyAdjustContentInsets={false}
            bounces={true}
            onScrollBeginDrag={() => setIsUserScrolling(true)}
            onMomentumScrollEnd={(event) => {
              const cardWidth =
                getResponsiveWidth(155) + getResponsiveMargin(12);
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / cardWidth
              );
              setCurrentScrollIndex(newIndex);
              // Resume auto-scroll after 5 seconds of user inactivity
              setTimeout(() => setIsUserScrolling(false), 5000);
            }}
          >
            {suggestedExperts.map((suggestedExpert) => (
              <Pressable
                key={suggestedExpert.id}
                style={styles.suggestedCard}
                onPress={() =>
                  router.push(`/expert-detail?id=${suggestedExpert.id}`)
                }
              >
                <Image
                  source={{ uri: suggestedExpert.image }}
                  style={styles.suggestedImage}
                />
                <View style={styles.suggestedContent}>
                  <Text style={styles.suggestedName}>
                    {suggestedExpert.name}
                  </Text>
                  <Text style={styles.suggestedSpecialty}>
                    {suggestedExpert.specialty}
                  </Text>
                  <View style={styles.suggestedRatingContainer}>
                    <Text style={styles.suggestedRating}>
                      ⭐ {suggestedExpert.rating}
                    </Text>
                    <Text style={styles.bookNowText}>Book Now</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* More Info Bottom Sheet */}
      <Modal
        visible={showMoreInfo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMoreInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowMoreInfo(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetHandle} />
              <Text style={styles.bottomSheetTitle}>Expert Details</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowMoreInfo(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.bottomSheetContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>🎯</Text>
                  <Text style={styles.infoTitle}>Specialties</Text>
                </View>
                <Text style={styles.infoContent}>
                  {expert.specialties.join(", ")}
                </Text>
              </View>

              {/* <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>🌍</Text>
                  <Text style={styles.infoTitle}>Languages</Text>
                </View>
                <Text style={styles.infoContent}>{expert.languages.join(', ')}</Text>
              </View> */}

              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>🎓</Text>
                  <Text style={styles.infoTitle}>Education</Text>
                </View>
                <Text style={styles.infoContent}>{expert.education}</Text>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>📜</Text>
                  <Text style={styles.infoTitle}>Certifications</Text>
                </View>
                <Text style={styles.infoContent}>
                  {expert.certifications.join(", ")}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>📅</Text>
                  <Text style={styles.infoTitle}>Session Types</Text>
                </View>
                <Text style={styles.infoContent}>
                  {expert.sessionTypes.join(", ")}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>💡</Text>
                  <Text style={styles.infoTitle}>Consultation Areas</Text>
                </View>
                <Text style={styles.infoContent}>
                  {expert.consultationAreas.join(", ")}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Text style={styles.modalInfoIcon}>🕒</Text>
                  <Text style={styles.infoTitle}>Availability</Text>
                </View>
                <Text style={styles.infoContent}>
                  {expert.availabilityNote}
                </Text>
              </View>

              <View style={styles.bottomSheetSpacer} />
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  headerContainer: {
    height: getResponsiveHeight(500),
    position: "relative",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: getResponsiveHeight(8) },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 8,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingTop: getResponsivePadding(50),
    paddingBottom: getResponsivePadding(40),
    paddingHorizontal: getResponsivePadding(24),
  },
  backButton: {
    width: getResponsiveWidth(44),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveBorderRadius(22),
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: getResponsiveHeight(4) },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 6,
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerInfo: {
    alignItems: "flex-start",
  },
  expertName: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: getResponsiveMargin(6),
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: getResponsiveHeight(3) },
    textShadowRadius: getResponsiveBorderRadius(6),
  },
  expertNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(6),
  },
  expertNameWhite: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: getResponsiveHeight(40),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 0, height: getResponsiveHeight(4) },
    textShadowRadius: getResponsiveBorderRadius(8),
  },
  expertNameYellow: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: "bold",
    color: "#F59E0B",
    lineHeight: getResponsiveHeight(40),
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 0, height: getResponsiveHeight(4) },
    textShadowRadius: getResponsiveBorderRadius(8),
  },
  expertTitle: {
    fontSize: getResponsiveFontSize(18),
    color: "#F59E0B",
    fontWeight: "600",
    lineHeight: getResponsiveHeight(26),
    letterSpacing: 0.3,
    marginBottom: getResponsiveMargin(12),
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: getResponsiveHeight(3) },
    textShadowRadius: getResponsiveBorderRadius(6),
  },
  headerDescription: {
    fontSize: getResponsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: getResponsiveHeight(26),
    letterSpacing: 0.2,
    marginBottom: getResponsiveMargin(16),
    maxWidth: "90%",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: getResponsiveHeight(2) },
    textShadowRadius: getResponsiveBorderRadius(4),
  },
  expertMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveWidth(12),
  },
  expertSpecialty: {
    fontSize: getResponsiveFontSize(18),
    color: "#F59E0B",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: getResponsiveHeight(2) },
    textShadowRadius: getResponsiveBorderRadius(4),
  },
  verifiedBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
  },
  verifiedText: {
    fontSize: getResponsiveFontSize(12),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveMargin(20),
    gap: getResponsiveWidth(16),
  },
  playButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#059669",
    minWidth: getResponsiveWidth(140),
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 8,
  },
  playIcon: {
    fontSize: getResponsiveFontSize(16),
    color: "#FFFFFF",
    marginRight: getResponsiveMargin(8),
  },
  playText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoButton: {
    backgroundColor: "rgba(109, 109, 110, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(6),
    borderWidth: 2,
    borderColor: "#F59E0B",
    minWidth: getResponsiveWidth(120),
    justifyContent: "center",
  },
  infoIcon: {
    fontSize: getResponsiveFontSize(16),
    color: "#FFFFFF",
    marginRight: getResponsiveMargin(8),
  },
  infoText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  planSectionHint: {
    fontSize: getResponsiveFontSize(12),
    color: "rgba(255,255,255,0.8)",
    marginTop: getResponsiveMargin(4),
    marginBottom: getResponsiveMargin(16),
  },
  planLoadingState: {
    alignItems: "center",
    paddingVertical: getResponsivePadding(20),
    gap: getResponsivePadding(8),
  },
  planLoadingText: {
    color: "#ffffff",
    opacity: 0.8,
  },
  planEmptyState: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    alignItems: "center",
  },
  planEmptyTitle: {
    fontSize: getResponsiveFontSize(16),
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: getResponsiveMargin(4),
  },
  planEmptySubtitle: {
    fontSize: getResponsiveFontSize(13),
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  planOptionsScroll: {
    marginTop: getResponsiveMargin(12),
  },
  planOptionsContainer: {
    flexDirection: "row",
    gap: getResponsiveMargin(12),
    paddingRight: getResponsivePadding(10),
  },
  planOptionCard: {
    width: getResponsiveWidth(260),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  planOptionCardActive: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245,158,11,0.18)",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  planOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveMargin(4),
  },
  planOptionTitle: {
    fontSize: getResponsiveFontSize(16),
    color: "#ffffff",
    fontWeight: "600",
  },
  planOptionTitleActive: {
    color: "#FDE68A",
  },
  planTypePill: {
    fontSize: getResponsiveFontSize(10),
    paddingHorizontal: getResponsivePadding(10),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
    textTransform: "uppercase",
    fontWeight: "700",
  },
  planTypeMonthly: {
    backgroundColor: "rgba(59,130,246,0.25)",
    color: "#BFDBFE",
  },
  planTypeSingle: {
    backgroundColor: "rgba(16,185,129,0.25)",
    color: "#A7F3D0",
  },
  planOptionPrice: {
    fontSize: getResponsiveFontSize(14),
    color: "#FCD34D",
    fontWeight: "700",
    marginBottom: getResponsiveMargin(4),
  },
  planOptionMeta: {
    fontSize: getResponsiveFontSize(12),
    color: "rgba(255,255,255,0.9)",
  },
  planOptionSubtext: {
    fontSize: getResponsiveFontSize(11),
    color: "rgba(255,255,255,0.75)",
    marginTop: getResponsiveMargin(4),
  },
  weeklyAvailabilityGrid: {
    gap: getResponsiveMargin(12),
  },
  weeklyDayCard: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: getResponsiveHeight(3) },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 3,
  },
  weeklyDayCardClosed: {
    opacity: 0.8,
  },
  weeklyDayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(10),
  },
  weeklyDayBadge: {
    width: getResponsiveWidth(36),
    height: getResponsiveHeight(36),
    borderRadius: getResponsiveBorderRadius(18),
    backgroundColor: "rgba(55, 185, 168, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: getResponsiveMargin(12),
  },
  weeklyDayBadgeText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "700",
    color: "#0f766e",
  },
  weeklyDayBadgeTextOpen: {
    color: "#0f172a",
  },
  weeklyDayInfo: {
    flex: 1,
  },
  weeklyDayName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "700",
    color: "#0f172a",
  },
  weeklyDayNameClosed: {
    color: "#6b7280",
  },
  weeklyDayStatus: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
  weeklyDayStatusOpen: {
    color: "#10b981",
  },
  weeklyDayStatusClosed: {
    color: "#dc2626",
  },
  weeklySlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: getResponsiveMargin(8),
  },
  weeklySlotPill: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.4)",
    borderWidth: 1,
    borderRadius: getResponsiveBorderRadius(10),
    paddingVertical: getResponsivePadding(6),
    paddingHorizontal: getResponsivePadding(10),
  },
  weeklySlotText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
    color: "#065f46",
  },
  weeklySlotTextMuted: {
    fontSize: getResponsiveFontSize(12),
    fontStyle: "italic",
    color: "#6b7280",
  },
  loadingBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(16),
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  loadingBannerText: {
    marginLeft: getResponsiveMargin(10),
    color: "#ffffff",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(16),
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.6)",
  },
  errorBannerText: {
    flex: 1,
    color: "#fee2e2",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
    marginRight: getResponsiveMargin(12),
  },
  errorBannerButton: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(20),
  },
  errorBannerButtonText: {
    color: "#dc2626",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "700",
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: getResponsiveMargin(20),
    marginTop: getResponsiveMargin(20),
    borderRadius: getResponsiveBorderRadius(16),
    paddingVertical: getResponsivePadding(14),
    paddingHorizontal: getResponsivePadding(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    fontSize: getResponsiveFontSize(20),
    marginBottom: getResponsiveMargin(4),
  },
  statNumber: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: getResponsiveMargin(2),
    textAlign: "center",
  },
  statLabel: {
    fontSize: getResponsiveFontSize(11),
    color: "#666666",
    textAlign: "center",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: getResponsiveHeight(40),
    backgroundColor: "#E5E5E5",
    marginHorizontal: getResponsiveMargin(12),
  },
  section: {
    paddingHorizontal: getResponsivePadding(16),
    paddingTop: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(12),
    marginBottom: getResponsiveMargin(4),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveMargin(16),
    paddingBottom: getResponsivePadding(8),
    paddingLeft: getResponsivePadding(4),
    paddingRight: getResponsivePadding(4),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveMargin(16),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingLeft: getResponsivePadding(4),
  },
  sectionTitleWithIcon: {
    paddingLeft: 0,
    marginBottom: 0,
  },
  seeAllText: {
    fontSize: getResponsiveFontSize(14),
    color: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  detailRow: {
    marginBottom: getResponsiveMargin(12),
  },
  detailLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#F59E0B",
    marginBottom: getResponsiveMargin(4),
  },
  detailValue: {
    fontSize: getResponsiveFontSize(14),
    color: "#333333",
    lineHeight: getResponsiveHeight(20),
  },
  subTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(8),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingLeft: getResponsivePadding(4),
  },
  datesContainer: {
    marginBottom: getResponsiveMargin(24),
  },
  dateCard: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(20),
    marginRight: getResponsiveMargin(12),
    alignItems: "center",
    minWidth: getResponsiveWidth(80),
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(3),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 3,
  },
  dateCardDisabled: {
    backgroundColor: "#ffffff",
    borderColor: "#F59E0B",
    borderWidth: 2,
    opacity: 0.6,
  },
  dateCardSelected: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
    borderWidth: 3,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(10),
    elevation: 10,
  },
  dateNumber: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: getResponsiveMargin(4),
  },
  dateDay: {
    fontSize: getResponsiveFontSize(13),
    color: "#6b7280",
    fontWeight: "600",
  },
  dateTextDisabled: {
    color: "#1f2937",
    opacity: 0.6,
  },
  dateTextSelected: {
    color: "#ffffff",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: getResponsiveMargin(16),
    paddingHorizontal: getResponsivePadding(2),
  },
  timeSlot: {
    backgroundColor: "#ffffff",
    paddingVertical: getResponsivePadding(18),
    paddingHorizontal: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(25),
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(3),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 3,
    width: "31.5%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: getResponsiveMargin(12),
  },
  timeSlotSelected: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
    borderWidth: 3,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(10),
    elevation: 10,
    width: "31.5%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: getResponsiveMargin(12),
  },
  timeSlotText: {
    fontSize: getResponsiveFontSize(14),
    color: "#1f2937",
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  timeSlotTextSelected: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
    borderWidth: 3,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(6),
    },
    shadowOpacity: 0.12,
    shadowRadius: getResponsiveBorderRadius(10),
    elevation: 6,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(12),
  },
  reviewerImage: {
    width: getResponsiveWidth(50),
    height: getResponsiveHeight(50),
    borderRadius: getResponsiveBorderRadius(25),
    marginRight: getResponsiveMargin(12),
    borderWidth: 3,
    borderColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 6,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#333333",
    marginBottom: getResponsiveMargin(4),
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveWidth(12),
  },
  reviewRating: {
    fontSize: getResponsiveFontSize(12),
    color: "#FFD700",
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: getResponsiveFontSize(12),
    color: "#666666",
  },
  reviewComment: {
    fontSize: getResponsiveFontSize(14),
    color: "#333333",
    lineHeight: getResponsiveHeight(20),
    marginBottom: getResponsiveMargin(12),
  },
  // Enhanced Review Styles
  seeAllButton: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  ratingsSummary: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(20),
    borderWidth: 1,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 4,
  },
  averageRating: {
    flex: 1,
    alignItems: "center",
    paddingRight: getResponsivePadding(20),
  },
  averageScore: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: getResponsiveMargin(8),
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: getResponsiveMargin(8),
  },
  star: {
    fontSize: getResponsiveFontSize(16),
    color: "#FFD700",
    marginHorizontal: getResponsiveMargin(1),
  },
  reviewCount: {
    fontSize: getResponsiveFontSize(12),
    color: "#666",
    textAlign: "center",
  },
  ratingBars: {
    flex: 2,
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(6),
  },
  ratingNumber: {
    fontSize: getResponsiveFontSize(12),
    color: "#666",
    width: getResponsiveWidth(12),
  },
  starSmall: {
    fontSize: getResponsiveFontSize(12),
    color: "#FFD700",
    marginHorizontal: getResponsiveMargin(6),
  },
  ratingBar: {
    flex: 1,
    height: getResponsiveHeight(6),
    backgroundColor: "#E5E7EB",
    borderRadius: getResponsiveBorderRadius(3),
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: "#FFD700",
  },
  reviewStars: {
    flexDirection: "row",
  },
  reviewStar: {
    fontSize: getResponsiveFontSize(12),
    color: "#FFD700",
    marginRight: getResponsiveMargin(1),
  },
  reviewActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveMargin(16),
  },
  noReviewsText: {
    fontSize: getResponsiveFontSize(13),
    color: "#fefefe",
    opacity: 0.85,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: getResponsiveMargin(8),
  },
  helpfulButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#10B981",
  },
  helpfulIcon: {
    fontSize: getResponsiveFontSize(12),
    marginRight: getResponsiveMargin(4),
  },
  helpfulText: {
    fontSize: getResponsiveFontSize(12),
    color: "#10B981",
    fontWeight: "600",
  },
  replyButton: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  replyText: {
    fontSize: getResponsiveFontSize(12),
    color: "#F59E0B",
    fontWeight: "600",
  },
  suggestedCard: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(18),
    marginRight: getResponsiveMargin(12),
    alignItems: "center",
    width: getResponsiveWidth(155),
    minHeight: getResponsiveHeight(200),
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(6),
    },
    shadowOpacity: 0.25,
    shadowRadius: getResponsiveBorderRadius(15),
    elevation: 12,
    justifyContent: "space-between",
  },
  suggestedImage: {
    width: getResponsiveWidth(75),
    height: getResponsiveHeight(75),
    borderRadius: getResponsiveBorderRadius(37.5),
    marginBottom: getResponsiveMargin(10),
    borderWidth: 3,
    borderColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(3),
    },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 8,
  },
  suggestedContent: {
    alignItems: "center",
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  suggestedName: {
    fontSize: getResponsiveFontSize(15),
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: getResponsiveMargin(4),
    letterSpacing: 0.3,
    lineHeight: getResponsiveHeight(18),
  },
  suggestedSpecialty: {
    fontSize: getResponsiveFontSize(12),
    color: "#6b7280",
    textAlign: "center",
    marginBottom: getResponsiveMargin(10),
    fontWeight: "500",
    lineHeight: getResponsiveHeight(15),
  },
  suggestedRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: getResponsivePadding(5),
  },
  suggestedRating: {
    fontSize: getResponsiveFontSize(12),
    color: "#F59E0B",
    fontWeight: "700",
  },
  bookNowText: {
    fontSize: getResponsiveFontSize(10),
    color: "#37b9a8",
    fontWeight: "600",
    backgroundColor: "#f0fffe",
    paddingHorizontal: getResponsivePadding(6),
    paddingVertical: getResponsivePadding(2),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#37b9a8",
  },
  suggestedScrollContainer: {
    paddingLeft: 0,
    paddingRight: getResponsivePadding(15),
  },
  bottomSpacer: {
    height: getResponsiveHeight(100),
  },
  bookingFooter: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(16),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  bookButton: {
    borderRadius: getResponsiveBorderRadius(12),
    overflow: "hidden",
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: getResponsivePadding(16),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F59E0B",
    borderRadius: getResponsiveBorderRadius(12),
  },
  bookButtonText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  // Enhanced Action Button Styles
  playButtonContainer: {
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: getResponsiveBorderRadius(20),
    borderTopRightRadius: getResponsiveBorderRadius(20),
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(-4),
    },
    shadowOpacity: 0.25,
    shadowRadius: getResponsiveBorderRadius(16),
    elevation: 16,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: getResponsivePadding(20),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bottomSheetHandle: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(4),
    backgroundColor: "#ddd",
    borderRadius: getResponsiveBorderRadius(2),
    position: "absolute",
    top: getResponsivePadding(-12),
    left: "50%",
    transform: [{ translateX: -20 }],
  },
  bottomSheetTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    width: getResponsiveWidth(30),
    height: getResponsiveHeight(30),
    borderRadius: getResponsiveBorderRadius(15),
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: "#666",
    fontWeight: "bold",
  },
  bottomSheetContent: {
    padding: getResponsivePadding(20),
  },
  infoSection: {
    marginBottom: getResponsiveMargin(24),
    backgroundColor: "#f8f9fa",
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(8),
  },
  modalInfoIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveMargin(12),
  },
  infoTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#F59E0B",
  },
  infoContent: {
    fontSize: getResponsiveFontSize(14),
    color: "#333",
    lineHeight: getResponsiveHeight(22),
    marginLeft: getResponsiveMargin(32),
  },
  bottomSheetSpacer: {
    height: getResponsiveHeight(20),
  },
  // Enhanced About Section Styles
  sectionHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: getResponsiveMargin(20),
    paddingLeft: getResponsivePadding(4),
  },
  sectionIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveMargin(10),
    textAlign: "center",
    width: getResponsiveWidth(28),
    height: getResponsiveHeight(28),
    lineHeight: getResponsiveHeight(28),
    color: "#FFFFFF",
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    padding: getResponsivePadding(14),
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(14),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.08,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  aboutText: {
    fontSize: getResponsiveFontSize(14),
    color: "#4b5563",
    lineHeight: getResponsiveHeight(22),
    letterSpacing: 0.1,
  },
  credentialsContainer: {
    gap: getResponsiveMargin(12),
  },
  credentialCard: {
    backgroundColor: "#ffffff",
    padding: getResponsivePadding(14),
    borderRadius: getResponsiveBorderRadius(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.08,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  credentialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(10),
    paddingBottom: getResponsivePadding(8),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  credentialIcon: {
    fontSize: getResponsiveFontSize(22),
    marginRight: getResponsiveMargin(12),
  },
  credentialTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#1f2937",
    letterSpacing: 0.3,
  },
  credentialContent: {
    fontSize: getResponsiveFontSize(15),
    color: "#4b5563",
    lineHeight: getResponsiveHeight(24),
    letterSpacing: 0.2,
  },
  certificationsContainer: {
    gap: getResponsiveMargin(8),
  },
  certificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: getResponsiveMargin(6),
  },
  certificationBullet: {
    fontSize: getResponsiveFontSize(16),
    color: "#F59E0B",
    marginRight: getResponsiveMargin(8),
    fontWeight: "bold",
  },
  certificationText: {
    fontSize: getResponsiveFontSize(14),
    color: "#4b5563",
    lineHeight: getResponsiveHeight(22),
    letterSpacing: 0.2,
    flex: 1,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: getResponsiveMargin(8),
  },
  specialtyTag: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(20),
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  specialtyText: {
    fontSize: getResponsiveFontSize(13),
    color: "#15803d",
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  sessionTypesContainer: {
    gap: getResponsiveMargin(8),
  },
  sessionTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(6),
  },
  sessionTypeBullet: {
    fontSize: getResponsiveFontSize(14),
    color: "#10b981",
    marginRight: getResponsiveMargin(8),
    fontWeight: "bold",
  },
  sessionTypeText: {
    fontSize: getResponsiveFontSize(14),
    color: "#4b5563",
    lineHeight: getResponsiveHeight(22),
    letterSpacing: 0.2,
  },
  availabilitySchedule: {
    gap: getResponsiveMargin(12),
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
  },
  scheduleIcon: {
    fontSize: getResponsiveFontSize(16),
    marginRight: getResponsiveMargin(10),
  },
  scheduleText: {
    fontSize: getResponsiveFontSize(14),
    color: "#374151",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  scheduleStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  statusIcon: {
    fontSize: getResponsiveFontSize(12),
    marginRight: getResponsiveMargin(8),
  },
  statusText: {
    fontSize: getResponsiveFontSize(14),
    color: "#15803d",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  // Booking Confirmation Styles
  bookingConfirmation: {
    marginTop: getResponsiveMargin(24),
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.2,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 8,
  },
  selectionSummary: {
    marginBottom: getResponsiveMargin(20),
    backgroundColor: "#fef3c7",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(8),
  },
  summaryIcon: {
    fontSize: getResponsiveFontSize(16),
    marginRight: getResponsiveMargin(10),
  },
  summaryLabel: {
    fontSize: getResponsiveFontSize(14),
    color: "#92400e",
    fontWeight: "600",
    marginRight: getResponsiveMargin(8),
    minWidth: getResponsiveWidth(100),
  },
  summaryValue: {
    fontSize: getResponsiveFontSize(14),
    color: "#451a03",
    fontWeight: "bold",
    flex: 1,
  },
  confirmButtonContainer: {
    width: "100%",
  },
  confirmButton: {
    borderRadius: getResponsiveBorderRadius(12),
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 8,
  },
  confirmButtonContent: {
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(24),
  },
  confirmButtonIcon: {
    fontSize: getResponsiveFontSize(18),
    color: "#ffffff",
    marginRight: getResponsiveMargin(8),
    fontWeight: "bold",
  },
  confirmButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  // Enhanced Suggested Experts Styles
  suggestedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: getResponsiveMargin(20),
    backgroundColor: "#ffffff",
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 2,
  },
  suggestedHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  suggestedIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(12),
  },
  suggestedHeaderText: {
    flex: 1,
  },
  suggestedSubtitle: {
    fontSize: getResponsiveFontSize(12),
    color: "#37b9a8",
    marginTop: getResponsiveMargin(2),
    fontWeight: "500",
    fontStyle: "italic",
  },
  viewAllButton: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  viewAllText: {
    fontSize: getResponsiveFontSize(12),
    color: "#15803d",
    fontWeight: "600",
  },
  // Date Picker Styles
  datePickerButton: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 2,
    borderColor: "#F59E0B",
    marginBottom: getResponsiveMargin(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(3),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 3,
  },
  datePickerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(20),
  },
  datePickerIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveMargin(12),
  },
  datePickerText: {
    fontSize: getResponsiveFontSize(16),
    color: "#1f2937",
    fontWeight: "600",
    flex: 1,
  },
  datePickerArrow: {
    fontSize: getResponsiveFontSize(12),
    color: "#F59E0B",
    fontWeight: "bold",
  },
  datePickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: getResponsiveWidth(12),
  },
  datePickerCard: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(20),
    paddingHorizontal: getResponsivePadding(16),
    alignItems: "center",
    width: "30%",
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(3),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 3,
    marginBottom: getResponsiveMargin(12),
    position: "relative",
  },
  datePickerCardDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderColor: "#D1D5DB",
    opacity: 0.6,
  },
  datePickerCardSelected: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
    borderWidth: 3,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(10),
    elevation: 10,
  },
  datePickerNumber: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: getResponsiveMargin(4),
  },
  datePickerDay: {
    fontSize: getResponsiveFontSize(14),
    color: "#6b7280",
    fontWeight: "600",
  },
  datePickerTextDisabled: {
    color: "#9CA3AF",
  },
  datePickerTextSelected: {
    color: "#ffffff",
  },
  selectedCheck: {
    position: "absolute",
    top: getResponsivePadding(8),
    right: getResponsivePadding(8),
    fontSize: getResponsiveFontSize(16),
    color: "#ffffff",
    fontWeight: "bold",
  },

  // Calendar Styles
  calendarBottomSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: getResponsiveBorderRadius(20),
    borderTopRightRadius: getResponsiveBorderRadius(20),
    paddingTop: getResponsivePadding(15),
    paddingHorizontal: 0,
    maxHeight: "80%",
    minHeight: "65%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20),
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: getResponsivePadding(20),
    paddingHorizontal: getResponsivePadding(5),
    marginBottom: getResponsiveMargin(15),
  },
  monthNavButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavIcon: {
    fontSize: getResponsiveFontSize(20),
    color: "#666",
    fontWeight: "600",
  },
  monthYearContainer: {
    alignItems: "center",
    flex: 1,
  },
  monthYearText: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "600",
    color: "#333",
    marginBottom: getResponsiveMargin(2),
  },
  monthYearSubtext: {
    fontSize: getResponsiveFontSize(12),
    color: "#888",
    fontWeight: "400",
  },
  daysHeader: {
    flexDirection: "row",
    paddingHorizontal: 0,
    marginBottom: getResponsiveMargin(10),
    paddingVertical: getResponsivePadding(8),
  },
  dayHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "500",
    color: "#888",
    paddingVertical: getResponsivePadding(5),
  },
  calendarScrollView: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 0,
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: getResponsiveMargin(5),
    borderRadius: getResponsiveBorderRadius(8),
    position: "relative",
    backgroundColor: "transparent",
  },
  calendarDayEmpty: {
    backgroundColor: "transparent",
  },
  calendarDayDisabled: {
    backgroundColor: "transparent",
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#37b9a8",
  },
  calendarDaySelected: {
    backgroundColor: "#37b9a8",
    borderWidth: 0,
  },
  calendarDayText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "500",
    color: "#333",
  },
  calendarDayTextDisabled: {
    color: "#ccc",
    fontWeight: "400",
  },
  calendarDayTextToday: {
    color: "#37b9a8",
    fontWeight: "600",
  },
  calendarDayTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  todayIndicator: {
    position: "absolute",
    bottom: getResponsivePadding(4),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(10),
    paddingHorizontal: getResponsivePadding(6),
    paddingVertical: getResponsivePadding(2),
    elevation: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  todayIndicatorText: {
    fontSize: getResponsiveFontSize(9),
    color: "#4CAF50",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  selectedIndicator: {
    position: "absolute",
    top: getResponsivePadding(3),
    right: getResponsivePadding(3),
    width: getResponsiveWidth(24),
    height: getResponsiveHeight(24),
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#ff6b35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedIndicatorText: {
    fontSize: getResponsiveFontSize(14),
    color: "#ff6b35",
    fontWeight: "900",
  },
  availableIndicatorWrapper: {
    position: "absolute",
    bottom: getResponsivePadding(3),
    alignItems: "center",
    justifyContent: "center",
  },
  availableIndicatorPulse: {
    position: "absolute",
    width: getResponsiveWidth(16),
    height: getResponsiveHeight(16),
    borderRadius: getResponsiveBorderRadius(8),
    backgroundColor: "#37b9a8",
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
  },
  availableIndicatorCore: {
    width: getResponsiveWidth(10),
    height: getResponsiveHeight(10),
    borderRadius: getResponsiveBorderRadius(5),
    backgroundColor: "#37b9a8",
    elevation: 2,
    shadowColor: "#37b9a8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  calendarFooter: {
    paddingHorizontal: 0,
    paddingTop: getResponsivePadding(20),
    marginTop: getResponsiveMargin(15),
  },
  selectedDateInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: getResponsiveBorderRadius(10),
    padding: getResponsivePadding(15),
    alignItems: "center",
    marginBottom: getResponsiveMargin(10),
  },
  selectedDateText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: getResponsiveMargin(4),
  },
  selectedDateSubtext: {
    fontSize: getResponsiveFontSize(12),
    color: "#666",
  },
});
