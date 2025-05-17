import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Calculator from '../components/calculator/Calculator';

const CalculatorScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Calculator />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, 
  }
});

export default CalculatorScreen;