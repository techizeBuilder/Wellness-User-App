import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../src/utils/colors';

export default function HealthPreferencesScreen() {
  const [selectedGoals, setSelectedGoals] = useState(['Weight Management', 'Stress Relief']);
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(['Vegetarian']);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState('Moderately Active');

  const wellnessGoals = [
    'Weight Management', 'Stress Relief', 'Better Sleep', 'Increased Energy',
    'Flexibility', 'Mental Health', 'Pain Relief', 'Spiritual Growth'
  ];

  const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  
  const dietaryOptions = [
    'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Keto', 'Low-Carb', 'Mediterranean', 'Other'
  ];

  const activityLevels = [
    'Sedentary', 'Lightly Active', 'Moderately Active', 
    'Very Active', 'Extremely Active'
  ];

  const medicalOptions = [
    'None', 'Diabetes', 'High Blood Pressure', 'Heart Conditions',
    'Arthritis', 'Back Problems', 'Anxiety', 'Depression', 'Other'
  ];

  const toggleSelection = (item: string, currentList: string[], setter: (list: string[]) => void) => {
    if (currentList.includes(item)) {
      setter(currentList.filter(i => i !== item));
    } else {
      setter([...currentList, item]);
    }
  };

  const handleSave = () => {
    // Save preferences logic
    console.log('Preferences saved:', {
      selectedGoals,
      fitnessLevel,
      dietaryRestrictions,
      medicalConditions,
      activityLevel
    });
    router.back();
  };

  return (
    <LinearGradient
      colors={['#4DD0E1', '#81C784', '#BA68C8']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Health Preferences</Text>
        <Pressable style={styles.saveHeaderButton} onPress={handleSave}>
          <Text style={styles.saveHeaderText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Wellness Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Wellness Goals</Text>
          <Text style={styles.sectionSubtitle}>What do you want to achieve? (Select multiple)</Text>
          
          <View style={styles.optionsGrid}>
            {wellnessGoals.map((goal) => (
              <Pressable
                key={goal}
                onPress={() => toggleSelection(goal, selectedGoals, setSelectedGoals)}
              >
                <LinearGradient
                  colors={selectedGoals.includes(goal) 
                    ? ['#4DD0E1', '#BA68C8'] 
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
                  style={styles.optionCard}
                >
                  <Text style={[
                    styles.optionText,
                    selectedGoals.includes(goal) && styles.optionTextSelected
                  ]}>
                    {goal}
                  </Text>
                  {selectedGoals.includes(goal) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Fitness Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Fitness Level</Text>
          <Text style={styles.sectionSubtitle}>How would you describe your current fitness level?</Text>
          
          <View style={styles.optionsColumn}>
            {fitnessLevels.map((level) => (
              <Pressable
                key={level}
                onPress={() => setFitnessLevel(level)}
              >
                <LinearGradient
                  colors={fitnessLevel === level 
                    ? ['#81C784', '#4DD0E1'] 
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
                  style={styles.optionRow}
                >
                  <View style={[
                    styles.radioButton,
                    fitnessLevel === level && styles.radioButtonSelected
                  ]}>
                    {fitnessLevel === level && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[
                    styles.optionRowText,
                    fitnessLevel === level && styles.optionRowTextSelected
                  ]}>
                    {level}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏃‍♀️ Activity Level</Text>
          <Text style={styles.sectionSubtitle}>How active are you in your daily life?</Text>
          
          <View style={styles.optionsColumn}>
            {activityLevels.map((level) => (
              <Pressable
                key={level}
                onPress={() => setActivityLevel(level)}
              >
                <LinearGradient
                  colors={activityLevel === level 
                    ? ['#81C784', '#4DD0E1'] 
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
                  style={styles.optionRow}
                >
                  <View style={[
                    styles.radioButton,
                    activityLevel === level && styles.radioButtonSelected
                  ]}>
                    {activityLevel === level && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[
                    styles.optionRowText,
                    activityLevel === level && styles.optionRowTextSelected
                  ]}>
                    {level}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥗 Dietary Preferences</Text>
          <Text style={styles.sectionSubtitle}>Any dietary restrictions or preferences?</Text>
          
          <View style={styles.optionsGrid}>
            {dietaryOptions.map((diet) => (
              <Pressable
                key={diet}
                onPress={() => toggleSelection(diet, dietaryRestrictions, setDietaryRestrictions)}
              >
                <LinearGradient
                  colors={dietaryRestrictions.includes(diet) 
                    ? ['#81C784', '#4DD0E1'] 
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
                  style={styles.optionCard}
                >
                  <Text style={[
                    styles.optionText,
                    dietaryRestrictions.includes(diet) && styles.optionTextSelected
                  ]}>
                    {diet}
                  </Text>
                  {dietaryRestrictions.includes(diet) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Medical Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Medical Considerations</Text>
          <Text style={styles.sectionSubtitle}>Any medical conditions we should be aware of?</Text>
          
          <View style={styles.optionsGrid}>
            {medicalOptions.map((condition) => (
              <Pressable
                key={condition}
                onPress={() => toggleSelection(condition, medicalConditions, setMedicalConditions)}
              >
                <LinearGradient
                  colors={medicalConditions.includes(condition) 
                    ? ['#81C784', '#4DD0E1'] 
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
                  style={styles.optionCard}
                >
                  <Text style={[
                    styles.optionText,
                    medicalConditions.includes(condition) && styles.optionTextSelected
                  ]}>
                    {condition}
                  </Text>
                  {medicalConditions.includes(condition) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationIcon}>💡</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Personalized Recommendations</Text>
              <Text style={styles.recommendationText}>
                Based on your preferences, we'll suggest the best experts, sessions, and content tailored specifically for your wellness journey.
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.section}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightMistTeal,
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(129, 199, 132, 0.3)',
  },
  saveHeaderText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '45%',
  },
  checkmark: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optionsColumn: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioButtonSelected: {
    borderColor: 'white',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  optionRowText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  optionRowTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: colors.royalGold + '20',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.royalGold + '30',
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.charcoalGray,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: colors.coralAccent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.coralAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  bottomSpacer: {
    height: 40,
  },
});