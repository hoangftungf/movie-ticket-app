import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MovieListScreen from './src/screens/MovieListScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import TicketListScreen from './src/screens/TicketListScreen';

import { ToastProvider } from './src/context/ToastContext';
import { subscribeToAuthChanges } from './src/services/authService';
import { registerForPushNotifications, addNotificationResponseListener } from './src/services/notificationService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lang nghe trang thai dang nhap
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Dang ky push notification
    registerForPushNotifications();

    // Lang nghe khi user nhan notification
    const notificationSubscription = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped:', data);
      // Co the navigate den man hinh tuong ung
    });

    return () => {
      unsubscribe();
      notificationSubscription.remove();
    };
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  return (
    <ToastProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
        initialRouteName={user ? 'MovieList' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#0f0c29',
          },
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Dang Ky',
            headerStyle: { backgroundColor: '#1a1a2e' },
          }}
        />

        {/* Main Screens */}
        <Stack.Screen
          name="MovieList"
          component={MovieListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{
            title: 'Chi tiet phim',
            headerTransparent: true,
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="TicketList"
          component={TicketListScreen}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
