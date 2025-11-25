import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiService, handleApiError } from '@/services/apiService';
import { colors } from '@/utils/colors';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
} from '@/utils/dimensions';

const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const formatUpdatedAt = (date: Date | null) => {
  if (!date) return 'Not updated yet';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function HealthVitalsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const extractUserPayload = (payload: any) => {
    if (!payload) {
      return null;
    }
    if (payload.data?.user) {
      return payload.data.user;
    }
    if (payload.user) {
      return payload.user;
    }
    if (payload.data) {
      return payload.data;
    }
    return payload;
  };

  const hydrateFromProfile = useCallback((rawProfile: any) => {
    if (!rawProfile) {
      return;
    }

    const healthSource = rawProfile.healthProfile ?? rawProfile;
    const storedBloodGroup = healthSource.bloodGroup || '';
    const storedWeight =
      typeof healthSource.weightKg === 'number' && !Number.isNaN(healthSource.weightKg)
        ? String(healthSource.weightKg)
        : '';
    const storedBloodPressure = healthSource.bloodPressure || '';
    const updatedAtValue =
      rawProfile.healthProfileUpdatedAt || healthSource.healthProfileUpdatedAt || null;

    setBloodGroup(storedBloodGroup);
    setWeight(storedWeight);
    setBloodPressure(storedBloodPressure);
    setLastUpdatedAt(updatedAtValue ? new Date(updatedAtValue) : null);
  }, []);

  const fetchHealthProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserProfile();
      const profilePayload = extractUserPayload(response);
      hydrateFromProfile(profilePayload);
    } catch (error) {
      const message = handleApiError(error);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }, [hydrateFromProfile]);

  useEffect(() => {
    fetchHealthProfile();
  }, [fetchHealthProfile]);

  const handleSave = useCallback(async () => {
    const trimmedWeight = weight.trim();
    const trimmedBloodPressure = bloodPressure.trim();
    const normalizedBloodGroup = bloodGroup.trim();

    if (trimmedWeight) {
      const parsed = Number(trimmedWeight);
      if (Number.isNaN(parsed) || parsed <= 0 || parsed > 500) {
        Alert.alert('Check weight', 'Please enter a valid weight in kilograms.');
        return;
      }
    }

    if (trimmedBloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(trimmedBloodPressure)) {
      Alert.alert(
        'Check blood pressure',
        'Use the S/D format (e.g., 118/76). Only numbers are allowed.',
      );
      return;
    }

    const payload: Record<string, any> = {
      bloodGroup: normalizedBloodGroup || null,
      weightKg: trimmedWeight ? Number(trimmedWeight) : null,
      bloodPressure: trimmedBloodPressure || null,
    };

    setSaving(true);
    try {
      const response = await apiService.updateUserProfile(payload);
      const updatedProfile = extractUserPayload(response);
      hydrateFromProfile(updatedProfile);
      Alert.alert('Saved', 'Health details updated successfully.');
    } catch (error) {
      const message = handleApiError(error);
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  }, [bloodGroup, bloodPressure, hydrateFromProfile, weight]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      <LinearGradient
        colors={['#0F766E', '#134E4A', '#042F2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Health Details</Text>
        <View style={styles.headerRight}>
          {saving && <ActivityIndicator color={colors.white} size="small" />}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Fetching your vitals…</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Emergency ready</Text>
            <Text style={styles.cardSubtitle}>
              Share key vitals so your assigned experts can personalise sessions or respond faster
              during emergencies.
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Last updated:</Text>
              <Text style={styles.metaValue}>{formatUpdatedAt(lastUpdatedAt)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blood Group</Text>
            <Text style={styles.sectionDescription}>Pick one option that matches your records.</Text>
            <View style={styles.optionsGrid}>
              {BLOOD_GROUP_OPTIONS.map((option) => {
                const selected = option === bloodGroup;
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionChip,
                      selected && styles.optionChipSelected,
                    ]}
                    onPress={() =>
                      setBloodGroup((current) => (current === option ? '' : option))
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight (kg)</Text>
            <Text style={styles.sectionDescription}>
              Helps experts tailor intensity and nutrition advice.
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="e.g., 62.5"
                placeholderTextColor="rgba(15, 118, 110, 0.45)"
              />
              <Text style={styles.inputSuffix}>kg</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blood Pressure</Text>
            <Text style={styles.sectionDescription}>
              Record your typical reading in the S/D format.
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={bloodPressure}
                onChangeText={setBloodPressure}
                keyboardType="numbers-and-punctuation"
                placeholder="120/80"
                placeholderTextColor="rgba(15, 118, 110, 0.45)"
                maxLength={7}
              />
              <Text style={styles.inputSuffix}>mmHg</Text>
            </View>
          </View>

          <View style={styles.infoBanner}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Your privacy first</Text>
              <Text style={styles.infoText}>
                These vitals are only visible to the experts you book sessions with. You can clear
                them at any time.
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save health details'}</Text>
          </Pressable>
        </ScrollView>
      )}
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
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    width: getResponsiveWidth(44),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveBorderRadius(22),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(22),
    color: colors.white,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRight: {
    width: getResponsiveWidth(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(24),
  },
  loadingText: {
    marginTop: getResponsiveMargin(12),
    fontSize: fontSizes.md,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.85,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(40),
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    color: colors.white,
    fontWeight: '600',
    marginBottom: getResponsiveMargin(6),
  },
  cardSubtitle: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: getResponsiveHeight(20),
    marginBottom: getResponsiveMargin(12),
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  metaValue: {
    fontSize: fontSizes.sm,
    color: colors.white,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(18),
    padding: getResponsivePadding(18),
    marginBottom: getResponsiveMargin(18),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: getResponsiveMargin(6),
  },
  sectionDescription: {
    fontSize: fontSizes.sm,
    color: '#4B5563',
    marginBottom: getResponsiveMargin(12),
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -getResponsiveMargin(4),
    marginBottom: -getResponsiveMargin(8),
  },
  optionChip: {
    minWidth: getResponsiveWidth(60),
    paddingVertical: getResponsivePadding(8),
    paddingHorizontal: getResponsivePadding(14),
    borderRadius: getResponsiveBorderRadius(999),
    borderWidth: 1,
    borderColor: '#CCFBF1',
    backgroundColor: '#ECFEFF',
    marginHorizontal: getResponsiveMargin(4),
    marginBottom: getResponsiveMargin(8),
  },
  optionChipSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
    shadowColor: '#0F766E',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  optionText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: getResponsiveBorderRadius(14),
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: getResponsivePadding(14),
  },
  input: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: '#0F172A',
    paddingVertical: getResponsivePadding(12),
    fontWeight: '600',
  },
  inputSuffix: {
    fontSize: fontSizes.md,
    color: '#0F766E',
    fontWeight: '600',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: getResponsiveMargin(24),
  },
  infoIcon: {
    fontSize: fontSizes.lg,
    marginRight: getResponsiveMargin(12),
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: '600',
    marginBottom: getResponsiveMargin(4),
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: getResponsiveHeight(20),
  },
  saveButton: {
    backgroundColor: '#FBBF24',
    borderRadius: getResponsiveBorderRadius(14),
    paddingVertical: getResponsivePadding(16),
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: '#0F172A',
  },
});

