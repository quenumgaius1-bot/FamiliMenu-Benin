import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppPage, PageHeading, SmallTag } from '@/components/FamiliMenuUI';
import { useColors } from '@/hooks/useColors';
import { useFamiliMenu } from '@/context/FamiliMenuContext';
import { cancelDailyMealReminders, scheduleDailyMealReminders } from '@/lib/reminders';

const MEALS = [
  { label: 'Petit-déjeuner', hour: '07:00', description: 'Un petit rappel avant le premier repas.', icon: 'coffee' as const },
  { label: 'Déjeuner', hour: '12:00', description: 'L’heure de faire une pause et de déjeuner.', icon: 'sun' as const },
  { label: 'Dîner', hour: '17:00', description: 'Pensez au repas du soir à l’avance.', icon: 'moon' as const },
];

export default function RappelsScreen() {
  const colors = useColors();
  const { remindersEnabled, saveRemindersEnabled } = useFamiliMenu();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function toggleReminders() {
    setBusy(true);
    setMessage(null);
    try {
      if (remindersEnabled) {
        await cancelDailyMealReminders();
        await saveRemindersEnabled(false);
        setMessage('Les rappels quotidiens sont désactivés.');
      } else {
        const result = await scheduleDailyMealReminders();
        if (!result.ok) {
          setMessage(
            result.reason === 'web'
              ? 'Les notifications quotidiennes sont disponibles dans l’application Android, pas dans cet aperçu web.'
              : 'Autorisez les notifications dans les réglages de votre téléphone pour activer les rappels.',
          );
          return;
        }
        await saveRemindersEnabled(true);
        setMessage('Vos trois rappels quotidiens sont activés sur cet appareil.');
      }
    } catch {
      setMessage('Les rappels n’ont pas pu être modifiés. Vérifiez les autorisations de notification.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppPage>
      <PageHeading
        eyebrow="Au bon moment"
        title="Vos rappels"
        subtitle="Recevez une notification avant chaque repas pour garder le rythme de la journée."
      />

      <View style={[styles.statusCard, { backgroundColor: colors.primary }]}>
        <View style={styles.statusTop}>
          <View style={styles.statusIcon}>
            <Feather name="bell" size={19} color="#FFFFFF" />
          </View>
          <SmallTag tone={remindersEnabled ? 'orange' : 'green'}>
            {remindersEnabled ? 'ACTIVÉS' : 'À CONFIGURER'}
          </SmallTag>
        </View>
        <Text style={styles.statusTitle}>{remindersEnabled ? 'Vos rappels sont prêts.' : 'Gardez vos repas en tête.'}</Text>
        <Text style={styles.statusSubtitle}>
          {remindersEnabled
            ? 'Les notifications sont programmées chaque jour sur cet appareil.'
            : 'Activez les notifications pour recevoir ces rappels chaque jour.'}
        </Text>
        <TouchableOpacity
          accessibilityRole="switch"
          accessibilityState={{ checked: remindersEnabled, disabled: busy }}
          accessibilityLabel={remindersEnabled ? 'Désactiver les rappels' : 'Activer les rappels'}
          testID="toggle-reminders"
          disabled={busy}
          activeOpacity={0.8}
          onPress={() => void toggleReminders()}
          style={[styles.toggleButton, { backgroundColor: '#FFFFFF' }]}
        >
          <Text style={[styles.toggleText, { color: colors.primary }]}>
            {busy ? 'Mise à jour…' : remindersEnabled ? 'Désactiver les rappels' : 'Activer mes rappels'}
          </Text>
          <Feather name={remindersEnabled ? 'bell-off' : 'bell'} size={17} color={colors.primary} />
        </TouchableOpacity>
        {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.reminderList}>
        {MEALS.map((meal, index) => (
          <View key={meal.label} style={[styles.reminderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.mealIcon, { backgroundColor: colors.muted }]}>
              <Feather name={meal.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.mealCopy}>
              <Text style={[styles.mealName, { color: colors.foreground }]}>{meal.label}</Text>
              <Text style={[styles.mealDescription, { color: colors.mutedForeground }]}>{meal.description}</Text>
            </View>
            <Text style={[styles.hour, { color: colors.accent }]}>{meal.hour}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.note, { backgroundColor: '#FBEAD9' }]}>
        <Feather name="info" size={16} color={colors.secondaryForeground} />
        <Text style={[styles.noteText, { color: colors.secondaryForeground }]}>
          Les rappels sont locaux à cet appareil. Sur Android, autorisez FamiliMenu à envoyer des notifications.
        </Text>
      </View>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  statusCard: { borderRadius: 21, padding: 18, gap: 13 },
  statusTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  statusTitle: { color: '#FFFFFF', fontSize: 21, lineHeight: 27, fontFamily: 'Inter_700Bold' },
  statusSubtitle: { color: '#E5EEE8', fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  toggleButton: { alignSelf: 'flex-start', marginTop: 2, paddingHorizontal: 14, minHeight: 43, borderRadius: 13, gap: 9, flexDirection: 'row', alignItems: 'center' },
  toggleText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  message: { color: '#FFFFFF', fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' },
  reminderList: { gap: 10 },
  reminderCard: { borderWidth: 1, borderRadius: 17, padding: 14, gap: 12, alignItems: 'center', flexDirection: 'row' },
  mealIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  mealCopy: { flex: 1, gap: 4 },
  mealName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  mealDescription: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  hour: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  note: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 14, alignItems: 'flex-start' },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' },
});
