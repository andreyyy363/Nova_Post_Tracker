import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, Text} from 'react-native';
import Calculator from '../components/calculator/Calculator';

const CalculatorScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Калькулятор вартості</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
});

export default CalculatorScreen;
