import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Cau hinh notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Dang ky push notification
export const registerForPushNotifications = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

// Gui notification local (nhac gio chieu)
export const scheduleShowtimeReminder = async (movieTitle, showtime, ticketId) => {
  // Parse showtime string to Date
  const showtimeDate = new Date(showtime);

  // Nhac truoc 30 phut
  const reminderTime = new Date(showtimeDate.getTime() - 30 * 60 * 1000);

  // Chi schedule neu thoi gian nhac lon hon hien tai
  if (reminderTime > new Date()) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhac lich chieu phim',
        body: `Phim "${movieTitle}" se chieu sau 30 phut nua!`,
        data: { ticketId, type: 'showtime_reminder' },
        sound: true,
      },
      trigger: {
        date: reminderTime,
      },
    });

    return notificationId;
  }

  return null;
};

// Gui notification ngay lap tuc (test)
export const sendImmediateNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // null = gui ngay
  });
};

// Huy notification
export const cancelNotification = async (notificationId) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

// Huy tat ca notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Lang nghe notification
export const addNotificationListener = (callback) => {
  const subscription = Notifications.addNotificationReceivedListener(callback);
  return subscription;
};

// Lang nghe khi user nhan vao notification
export const addNotificationResponseListener = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(callback);
  return subscription;
};
