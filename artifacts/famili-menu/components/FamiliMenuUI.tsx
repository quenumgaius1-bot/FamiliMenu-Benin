import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Recipe } from '@/data/recipes';
import type { PlannedMeal } from '@/lib/menu-planner';
import { formatMealDate, mealLabel } from '@/lib/menu-planner';

const recipeImages = {
  akara: require('../assets/images/akara-breakfast.jpg'),
  stew: require('../assets/images/benin-peanut-stew.jpg'),
};

export function AppPage({ children }: React.PropsWithChildren) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'web' ? Math.max(insets.top, 67) : 0,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[styles.page, { paddingBottom: Platform.OS === 'web' ? 110 : 94 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.heading}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: colors.accent }]}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={[styles.headingTitle, { color: colors.foreground }]}>{title}</Text>
      {subtitle ? <Text style={[styles.headingSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.primaryButton,
        { backgroundColor: disabled ? colors.muted : colors.primary },
      ]}
    >
      {icon ? <Feather name={icon} size={17} color={disabled ? colors.mutedForeground : '#FFFFFF'} /> : null}
      <Text style={[styles.primaryButtonText, { color: disabled ? colors.mutedForeground : '#FFFFFF' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function RecipeCard({
  recipe,
  onPress,
  compact = false,
}: {
  recipe: Recipe;
  onPress: () => void;
  compact?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir la recette ${recipe.name}`}
      testID={`recipe-${recipe.id}`}
      activeOpacity={0.84}
      onPress={onPress}
      style={[styles.recipeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Image source={recipeImages[recipe.image]} style={[styles.recipeImage, compact && styles.compactImage]} />
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeName, { color: colors.foreground }]} numberOfLines={2}>{recipe.name}</Text>
        <Text style={[styles.recipeMeta, { color: colors.mutedForeground }]}>
          {recipe.preparationMinutes} min · {recipe.ingredients.length} ingrédients
        </Text>
        {!compact ? (
          <Text style={[styles.recipeRegion, { color: colors.primary }]}>{recipe.region}</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

export function MealLine({
  meal,
  recipe,
  onPress,
}: {
  meal: PlannedMeal;
  recipe: Recipe;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${mealLabel(meal.type)} à ${meal.time}, ${recipe.name}`}
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.mealLine, { borderColor: colors.border }]}
    >
      <View style={[styles.mealTime, { backgroundColor: colors.muted }]}>
        <Text style={[styles.mealTimeText, { color: colors.primary }]}>{meal.time}</Text>
      </View>
      <View style={styles.mealCopy}>
        <Text style={[styles.mealType, { color: colors.mutedForeground }]}>{mealLabel(meal.type)}</Text>
        <Text style={[styles.mealName, { color: colors.foreground }]} numberOfLines={1}>{recipe.name}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

export function SectionLabel({ children }: React.PropsWithChildren) {
  const colors = useColors();
  return <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{children}</Text>;
}

export function SmallTag({ children, tone = 'green' }: React.PropsWithChildren<{ tone?: 'green' | 'orange' }>) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.tag,
        { backgroundColor: tone === 'orange' ? '#FBEAD9' : colors.muted },
      ]}
    >
      <Text style={[styles.tagText, { color: tone === 'orange' ? colors.secondaryForeground : colors.primary }]}>
        {children}
      </Text>
    </View>
  );
}

export function DayGroupTitle({ date }: { date: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.dayGroupTitle, { color: colors.foreground }]}>
      {formatMealDate(date)}
    </Text>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  page: { paddingHorizontal: 20, paddingTop: 10, gap: 20 },
  heading: { gap: 6, paddingTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  headingTitle: { fontSize: 28, lineHeight: 34, fontFamily: 'Inter_700Bold' },
  headingSubtitle: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  recipeCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 11,
    gap: 13,
    alignItems: 'center',
    flexDirection: 'row',
  },
  recipeImage: { width: 76, height: 76, borderRadius: 13, backgroundColor: '#E8ECE5' },
  compactImage: { width: 58, height: 58, borderRadius: 11 },
  recipeInfo: { flex: 1, gap: 5 },
  recipeName: { fontSize: 15, lineHeight: 20, fontFamily: 'Inter_600SemiBold' },
  recipeMeta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  recipeRegion: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  mealLine: {
    minHeight: 69,
    borderBottomWidth: 1,
    gap: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  mealTime: { minWidth: 58, paddingVertical: 9, borderRadius: 11, alignItems: 'center' },
  mealTimeText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  mealCopy: { flex: 1, gap: 3 },
  mealType: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  mealName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  sectionLabel: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  tagText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  dayGroupTitle: { fontSize: 15, textTransform: 'capitalize', fontFamily: 'Inter_700Bold', marginTop: 6 },
});
