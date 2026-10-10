import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'famili-menu-repas';
const NOTIFICATION_IDS_KEY = 'famili-menu:notification-ids:v1';

export const DAILY_REMINDERS = [
  { hour: 7, title: 'Le petit-déjeuner approche', body: 'Il est bientôt temps de préparer le premier repas de la journée.' },
  { hour: 12, title: 'Le déjeuner approche', body: 'Votre rappel FamiliMenu pour le déjeuner.' },
  { hour: 17, title: 'Le dîner approche', body: 'Pensez au repas du soir avec FamiliMenu.' },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleDailyMealReminders(): Promise<
  { ok: true } | { ok: false; reason: 'web' | 'permission' }
> {
  if (Platform.OS === 'web') return { ok: false, reason: 'web' };
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Rappels FamiliMenu',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#174C32',
    });
  }

  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return { ok: false, reason: 'permission' };

  await cancelDailyMealReminders();
  const identifiers: string[] = [];
  for (const reminder of DAILY_REMINDERS) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: 0,
        ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
      },
    });
    identifiers.push(identifier);
  }
  await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(identifiers));
  return { ok: true };
}

export async function cancelDailyMealReminders(): Promise<void> {
  const identifiers = await loadNotificationIds();
  await Promise.all(
    identifiers.map((identifier) => Notifications.cancelScheduledNotificationAsync(identifier)),
  );
  await AsyncStorage.removeItem(NOTIFICATION_IDS_KEY);
}

async function loadNotificationIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')
    ? parsed
    : [];
}
