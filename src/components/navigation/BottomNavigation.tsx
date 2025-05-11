import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'track' && styles.activeTab]} 
        onPress={() => onTabChange('track')}
      >
        <Text style={[styles.tabIcon, activeTab === 'track' && styles.activeTabIcon]}>
          🔍
        </Text>
        <Text style={[styles.tabText, activeTab === 'track' && styles.activeTabText]}>
          Відстеження
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'myPackages' && styles.activeTab]} 
        onPress={() => onTabChange('myPackages')}
      >
        <Text style={[styles.tabIcon, activeTab === 'myPackages' && styles.activeTabIcon]}>
          📦
        </Text>
        <Text style={[styles.tabText, activeTab === 'myPackages' && styles.activeTabText]}>
          Мої посилки
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'calculator' && styles.activeTab]} 
        onPress={() => onTabChange('calculator')}
      >
        <Text style={[styles.tabIcon, activeTab === 'calculator' && styles.activeTabIcon]}>
          🧮
        </Text>
        <Text style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>
          Калькулятор
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#FF6B08',
    backgroundColor: '#fff',
  },
  tabIcon: {
    fontSize: 24,
    color: '#666',
    marginBottom: 4,
  },
  activeTabIcon: {
    color: '#FF6B08',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B08',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
