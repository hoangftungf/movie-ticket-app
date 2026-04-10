import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Kiem Tra 5</Text>
        <View style={styles.divider} />
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardGradient, { backgroundColor: '#667eea' }]}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>1</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Man hinh Login</Text>
            <Text style={styles.cardDescription}>Thiet ke giao dien dang nhap voi Facebook & Google</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Booking')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardGradient, { backgroundColor: '#f093fb' }]}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>2</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Dat ve may bay</Text>
            <Text style={styles.cardDescription}>App dat ve voi tinh nang tinh tien va danh gia</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>React Native + Expo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#667eea',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 20,
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: '#667eea',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: 12,
  },
});
