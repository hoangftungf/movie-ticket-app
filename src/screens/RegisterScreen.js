import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { registerUser } from '../services/authService';
import { useToast } from '../context/ToastContext';

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      showError('Vui long nhap day du thong tin!');
      return;
    }

    if (password !== confirmPassword) {
      showError('Mat khau xac nhan khong khop!');
      return;
    }

    if (password.length < 6) {
      showError('Mat khau phai co it nhat 6 ky tu!');
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, displayName);
    setLoading(false);

    if (result.success) {
      showSuccess('Dang ky thanh cong! Chao mung ban!');
      setTimeout(() => {
        navigation.navigate('MovieList');
      }, 1000);
    } else {
      showError('Loi: ' + result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎬</Text>
          <Text style={styles.title}>Dang Ky</Text>
          <Text style={styles.subtitle}>Tao tai khoan moi</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ho va ten</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhap ho va ten"
              placeholderTextColor="#999"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhap email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mat khau</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhap mat khau (it nhat 6 ky tu)"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xac nhan mat khau</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhap lai mat khau"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Dang Ky</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Da co tai khoan? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Dang nhap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    padding: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#6c5ce7',
    fontSize: 14,
    fontWeight: '600',
  },
});
