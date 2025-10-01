import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../src/utils/colors';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  return (
    <LinearGradient
      colors={['#4DD0E1', '#81C784', '#BA68C8']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          {languages.map((language) => (
            <Pressable
              key={language.code}
              onPress={() => setSelectedLanguage(language.name)}
            >
              <LinearGradient
                colors={selectedLanguage === language.name 
                  ? ['#81C784', '#4DD0E1'] 
                  : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
                style={styles.languageItem}
              >
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === language.name && styles.languageNameSelected
                  ]}>{language.name}</Text>
                  <Text style={[
                    styles.languageNative,
                    selectedLanguage === language.name && styles.languageNativeSelected
                  ]}>{language.nativeName}</Text>
                </View>
                {selectedLanguage === language.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </LinearGradient>
            </Pressable>
          ))}
        </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  languageNameSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  languageNative: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  languageNativeSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkmark: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});