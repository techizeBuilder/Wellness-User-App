import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

export default function HealthPreferencesScreen() {
  const [selectedGoals, setSelectedGoals] = useState(['Weight Management', 'Stress Relief']);
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(['Vegetarian']);
  const [medicalConditions, setMedicalConditions] = useState([]);
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
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
                style={[
                  styles.optionCard,
                  selectedGoals.includes(goal) && styles.optionCardSelected
                ]}
                onPress={() => toggleSelection(goal, selectedGoals, setSelectedGoals)}
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
                style={[
                  styles.optionRow,
                  fitnessLevel === level && styles.optionRowSelected
                ]}
                onPress={() => setFitnessLevel(level)}
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
                style={[
                  styles.optionRow,
                  activityLevel === level && styles.optionRowSelected
                ]}
                onPress={() => setActivityLevel(level)}
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
                style={[
                  styles.optionCard,
                  dietaryRestrictions.includes(diet) && styles.optionCardSelected
                ]}
                onPress={() => toggleSelection(diet, dietaryRestrictions, setDietaryRestrictions)}
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
                style={[
                  styles.optionCard,
                  medicalConditions.includes(condition) && styles.optionCardSelected
                ]}
                onPress={() => toggleSelection(condition, medicalConditions, setMedicalConditions)}
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
    </View>
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
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.coralAccent,
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
    color: colors.deepTeal,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.charcoalGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: colors.lightMistTeal,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '45%',
  },
  optionCardSelected: {
    backgroundColor: colors.sageGreen,
    borderColor: colors.sageGreen,
  },
  optionText: {
    fontSize: 14,
    color: colors.deepTeal,
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    color: colors.white,
  },
  checkmark: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optionsColumn: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colors.lightMistTeal,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionRowSelected: {
    backgroundColor: colors.sageGreen + '20',
    borderColor: colors.sageGreen,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioButtonSelected: {
    borderColor: colors.sageGreen,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.sageGreen,
  },
  optionRowText: {
    fontSize: 16,
    color: colors.deepTeal,
    fontWeight: '500',
  },
  optionRowTextSelected: {
    color: colors.deepTeal,
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