// import messaging from '@react-native-firebase/messaging';
// import { Alert } from 'react-native';

// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   } else {
//     Alert.alert('Permission denied', 'You will not receive notifications');
//   }
// }

// export async function getFcmToken() {
//   let fcmToken = await messaging().getToken();
//   if (fcmToken) {
//     console.log('FCM Token:', fcmToken);
//     return fcmToken;
//   } else {
//     console.log('Failed to get FCM token');
//     return null;
//   }
// }

// export function listenForForegroundMessages() {
//   messaging().onMessage(async (remoteMessage) => {
//     Alert.alert('New Notification', remoteMessage.notification?.title || '');
//   });
// }

// export function listenForBackgroundMessages() {
//   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
// }
