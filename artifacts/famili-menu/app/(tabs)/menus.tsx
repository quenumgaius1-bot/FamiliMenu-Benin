import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { AppPage, DayGroupTitle, MealLine, PageHeading, PrimaryButton, SectionLabel, SmallTag } from '@/components/FamiliMenuUI';
import { RECIPE_BY_ID } from '@/data/recipes';
import { buildMenuPlan, localDateKey } from '@/lib/menu-planner';
import { useFamiliMenu } from '@/context/FamiliMenuContext';

const PERIODS = [3, 7, 14, 30] as const;

export default function MenusScreen() {
  const colors = useColors();
  const { plan, savePlan, isReady, storageError } = useFamiliMenu();
  const [period, setPeriod] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const displayedMeals = useMemo(
    () => (plan?.meals ?? []).filter((meal) => meal.date >= localDateKey(new Date())).slice(0, 9),
    [plan],
  );
  const dayGroups = useMemo(() => {
    const groups = new Map<string, typeof displayedMeals>();
    displayedMeals.forEach((meal) => {
      groups.set(meal.date, [...(groups.get(meal.date) ?? []), meal]);
    });
    return [...groups.entries()];
  }, [displayedMeals]);

  async function generate() {
    setIsGenerating(true);
    setMessage(null);
    try {
      await savePlan(buildMenuPlan(period));
      setMessage(`Vos menus pour ${period} jours sont enregistrés sur cet appareil.`);
    } catch {
      setMessage('Les menus n’ont pas pu être enregistrés. Vérifiez le stockage de votre appareil.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppPage>
      <PageHeading
        eyebrow="Planification"
        title="Vos menus"
        subtitle="Choisissez la durée et FamiliMenu répartit les repas de la journée."
      />

      <View style={[styles.selectorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.selectorTitleRow}>
          <View style={[styles.iconBubble, { backgroundColor: colors.muted }]}>
            <Feather name="calendar" size={18} color={colors.primary} />
          </View>
          <View style={styles.selectorCopy}>
            <Text style={[styles.selectorTitle, { color: colors.foreground }]}>Durée du menu</Text>
            <Text style={[styles.selectorSubtitle, { color: colors.mutedForeground }]}>3 repas par jour, avec des recettes alternées.</Text>
          </View>
        </View>
        <View style={styles.periods}>
          {PERIODS.map((days) => {
            const selected = period === days;
            return (
              <TouchableOpacity
                key={days}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`period-${days}`}
                onPress={() => setPeriod(days)}
                style={[
                  styles.periodButton,
                  { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.background },
                ]}
              >
                <Text style={[styles.periodNumber, { color: selected ? '#FFFFFF' : colors.foreground }]}>{days}</Text>
                <Text style={[styles.periodLabel, { color: selected ? '#FFFFFF' : colors.mutedForeground }]}>jours</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <PrimaryButton
          label={isGenerating ? 'Création en cours…' : 'Générer mes menus'}
          icon="shuffle"
          onPress={() => void generate()}
          disabled={!isReady || isGenerating}
          testID="generate-menus"
        />
        {isGenerating ? <ActivityIndicator color={colors.primary} /> : null}
        {message ? <Text accessibilityLiveRegion="polite" style={[styles.statusMessage, { color: colors.primary }]}>{message}</Text> : null}
        {storageError ? <Text style={[styles.statusMessage, { color: colors.destructive }]}>{storageError}</Text> : null}
      </View>

      <View style={styles.planHeading}>
        <SectionLabel>Repas programmés</SectionLabel>
        {plan ? <SmallTag tone={plan.isDemo ? 'orange' : 'green'}>{plan.isDemo ? 'DÉMONSTRATION' : `${plan.periodDays} JOURS`}</SmallTag> : null}
      </View>
      {!isReady ? (
        <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View>
      ) : dayGroups.length ? (
        dayGroups.map(([date, meals]) => (
          <View key={date} style={styles.dayGroup}>
            <DayGroupTitle date={date} />
            <View style={[styles.mealsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {meals.map((meal) => {
                const recipe = RECIPE_BY_ID[meal.recipeId];
                return recipe ? (
                  <MealLine
                    key={meal.id}
                    meal={meal}
                    recipe={recipe}
                    onPress={() => router.push(`/recette/${recipe.id}`)}
                  />
                ) : null;
              })}
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.statusMessage, { color: colors.mutedForeground }]}>Générez un menu pour voir les repas planifiés.</Text>
      )}
    </AppPage>
  );
}

const styles = StyleSheet.create({
  selectorCard: { padding: 16, gap: 17, borderWidth: 1, borderRadius: 20 },
  selectorTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBubble: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  selectorCopy: { flex: 1, gap: 4 },
  selectorTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  selectorSubtitle: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  periods: { flexDirection: 'row', gap: 8 },
  periodButton: { flex: 1, minHeight: 65, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center', gap: 2 },
  periodNumber: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  periodLabel: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  statusMessage: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' },
  planHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  dayGroup: { gap: 9 },
  mealsCard: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 13, paddingVertical: 2 },
  loading: { minHeight: 80, justifyContent: 'center' },
});
