import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { AppPage, MealLine, PageHeading, SectionLabel, SmallTag } from '@/components/FamiliMenuUI';
import { RECIPE_BY_ID } from '@/data/recipes';
import { formatMealDate, getNextMeal, localDateKey } from '@/lib/menu-planner';
import { useFamiliMenu } from '@/context/FamiliMenuContext';

const stewImage = require('../../assets/images/benin-peanut-stew.jpg');

export default function AccueilScreen() {
  const colors = useColors();
  const { plan, isReady, storageError } = useFamiliMenu();
  const nextMeal = getNextMeal(plan);
  const recipe = nextMeal ? RECIPE_BY_ID[nextMeal.recipeId] : null;
  const today = localDateKey(new Date());
  const todayMeals = plan?.meals.filter((meal) => meal.date === today) ?? [];

  if (!isReady) {
    return (
      <AppPage>
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Préparation de vos menus…</Text>
        </View>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <View style={styles.topline}>
        <View style={styles.brand}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <Text style={[styles.brandName, { color: colors.primary }]}>FamiliMenu</Text>
        </View>
        <View style={styles.todayChip}>
          <Feather name="sun" size={15} color={colors.accent} />
          <Text style={[styles.todayText, { color: colors.mutedForeground }]}>
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </Text>
        </View>
      </View>

      <PageHeading
        eyebrow="Vos repas, en famille"
        title="Bonjour !"
        subtitle="Un bon repas commence par une bonne idée."
      />

      {storageError ? (
        <View style={[styles.errorBanner, { backgroundColor: '#FCEAE7' }]}>
          <Feather name="alert-circle" size={16} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive }]}>{storageError}</Text>
        </View>
      ) : null}

      {nextMeal && recipe ? (
        <View style={styles.nextMealCard}>
          <Image source={stewImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(12, 47, 30, 0.32)', 'rgba(12, 47, 30, 0.94)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.nextCardContent}>
            <View style={styles.nextTop}>
              <SmallTag tone="orange">À VENIR · {nextMeal.time}</SmallTag>
              {plan?.isDemo ? (
                <Text style={styles.demoLabel}>MENU DÉMO</Text>
              ) : null}
            </View>
            <View style={styles.nextCopy}>
              <Text style={styles.nextDate}>{formatMealDate(nextMeal.date)}</Text>
              <Text style={styles.nextType}>{nextMeal.type.toUpperCase()}</Text>
              <Text style={styles.nextTitle}>{recipe.name}</Text>
              <Text style={styles.nextMeta}>{recipe.preparationMinutes} min · {recipe.region}</Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Consulter la recette ${recipe.name}`}
                testID="home-view-next-recipe"
                activeOpacity={0.82}
                onPress={() => router.push(`/recette/${recipe.id}`)}
                style={styles.recipeButton}
              >
                <Text style={styles.recipeButtonText}>Consulter la recette</Text>
                <Feather name="arrow-up-right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.emptyNext, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="calendar" size={22} color={colors.primary} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucun repas à venir</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Générez de nouveaux menus pour continuer à planifier.</Text>
          <TouchableOpacity onPress={() => router.push('/menus')} accessibilityRole="button">
            <Text style={[styles.emptyLink, { color: colors.primary }]}>Créer mes menus</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.sectionRow}>
        <SectionLabel>Le menu du jour</SectionLabel>
        <TouchableOpacity onPress={() => router.push('/menus')} accessibilityRole="button">
          <Text style={[styles.seeAll, { color: colors.primary }]}>Tout voir</Text>
        </TouchableOpacity>
      </View>

      {todayMeals.length ? (
        <View style={[styles.todayList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {todayMeals.map((meal) => {
            const mealRecipe = RECIPE_BY_ID[meal.recipeId];
            return mealRecipe ? (
              <MealLine
                key={meal.id}
                meal={meal}
                recipe={mealRecipe}
                onPress={() => router.push(`/recette/${mealRecipe.id}`)}
              />
            ) : null;
          })}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Aucun repas programmé pour aujourd’hui.</Text>
      )}
    </AppPage>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, minHeight: 400, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 31, height: 31, borderRadius: 9 },
  brandName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  todayChip: { flexDirection: 'row', gap: 7, alignItems: 'center', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999, backgroundColor: '#FFFFFF' },
  todayText: { fontSize: 12, textTransform: 'capitalize', fontFamily: 'Inter_500Medium' },
  errorBanner: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12 },
  errorText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' },
  nextMealCard: { height: 270, borderRadius: 23, overflow: 'hidden', backgroundColor: '#214734' },
  nextCardContent: { flex: 1, padding: 18, justifyContent: 'space-between' },
  nextTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  demoLabel: { color: '#FFFFFF', fontSize: 10, letterSpacing: 1, fontFamily: 'Inter_700Bold' },
  nextCopy: { gap: 4 },
  nextDate: { color: '#E3E9E2', fontSize: 12, textTransform: 'capitalize', fontFamily: 'Inter_500Medium' },
  nextType: { color: '#F8AE63', fontSize: 10, letterSpacing: 1.3, fontFamily: 'Inter_700Bold' },
  nextTitle: { color: '#FFFFFF', fontSize: 24, lineHeight: 30, fontFamily: 'Inter_700Bold' },
  nextMeta: { color: '#E3E9E2', fontSize: 12, fontFamily: 'Inter_500Medium' },
  recipeButton: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: '#FFFFFF', borderRadius: 13, paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  recipeButtonText: { color: '#174C32', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  emptyNext: { padding: 20, borderWidth: 1, borderRadius: 18, gap: 9 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  emptyText: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  emptyLink: { fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 4 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  seeAll: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  todayList: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 13, paddingVertical: 2 },
});
