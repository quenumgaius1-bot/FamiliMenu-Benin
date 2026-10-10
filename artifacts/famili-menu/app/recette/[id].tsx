import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { RECIPE_BY_ID } from '@/data/recipes';

const recipeImages = {
  akara: require('../../assets/images/akara-breakfast.jpg'),
  stew: require('../../assets/images/benin-peanut-stew.jpg'),
};

export default function RecipeDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = id ? RECIPE_BY_ID[id] : undefined;

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow} accessibilityRole="button">
          <Feather name="arrow-left" size={20} color={colors.foreground} />
          <Text style={[styles.backText, { color: colors.foreground }]}>Retour</Text>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Feather name="book-open" size={24} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Cette recette n’est pas disponible.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const videoUrl = recipe.videoUrl;
  async function openVideo() {
    try {
      await Linking.openURL(videoUrl);
    } catch {
      // The direct, verified video URL remains visible to the user if their device
      // cannot open the YouTube app or browser.
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow} accessibilityRole="button" accessibilityLabel="Retour">
          <Feather name="arrow-left" size={20} color={colors.foreground} />
          <Text style={[styles.backText, { color: colors.foreground }]}>Retour</Text>
        </TouchableOpacity>
        <Image source={recipeImages[recipe.image]} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.titleBlock}>
          <Text style={[styles.region, { color: colors.accent }]}>{recipe.region.toUpperCase()} · {recipe.preparationMinutes} MIN</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>{recipe.name}</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>{recipe.description}</Text>
        </View>

        <View style={[styles.videoCard, { backgroundColor: colors.primary }]}>
          <View style={styles.videoCopy}>
            <Text style={styles.videoEyebrow}>VIDÉO DE CUISINE</Text>
            <Text style={styles.videoTitle}>{recipe.videoTitle}</Text>
            <Text style={styles.videoUrl} selectable>{recipe.videoUrl}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Ouvrir la vidéo : ${recipe.videoTitle}`}
            testID="open-recipe-video"
            onPress={() => void openVideo()}
            style={styles.videoButton}
          >
            <Feather name="play" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Ingrédients</Text>
          <Text style={[styles.ingredientCount, { color: colors.mutedForeground }]}>{recipe.ingredients.length} éléments</Text>
        </View>
        <View style={[styles.ingredientCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {recipe.ingredients.map((ingredient, index) => (
            <View
              key={`${ingredient.name}-${index}`}
              style={[styles.ingredientRow, index < recipe.ingredients.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            >
              <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
              <Text style={[styles.ingredientName, { color: colors.foreground }]}>{ingredient.name}</Text>
              <Text style={[styles.ingredientAmount, { color: colors.mutedForeground }]}>{ingredient.quantity}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Préparation</Text>
        <View style={styles.steps}>
          {recipe.steps.map((step, index) => (
            <View key={`${index}-${step.slice(0, 15)}`} style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: colors.muted }]}>
                <Text style={[styles.stepNumberText, { color: colors.primary }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 36, gap: 18 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 38 },
  backText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  heroImage: { width: '100%', height: 220, borderRadius: 21, backgroundColor: '#E8ECE5' },
  titleBlock: { gap: 7 },
  region: { fontSize: 10, letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  title: { fontSize: 27, lineHeight: 33, fontFamily: 'Inter_700Bold' },
  description: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  videoCard: { padding: 15, borderRadius: 17, gap: 12, flexDirection: 'row', alignItems: 'center' },
  videoCopy: { flex: 1, gap: 5 },
  videoEyebrow: { color: '#F8AE63', fontSize: 10, letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  videoTitle: { color: '#FFFFFF', fontSize: 13, lineHeight: 18, fontFamily: 'Inter_600SemiBold' },
  videoUrl: { color: '#D7E4DB', fontSize: 10, fontFamily: 'Inter_400Regular' },
  videoButton: { width: 43, height: 43, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  ingredientCount: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  ingredientCard: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 14 },
  ingredientRow: { minHeight: 46, flexDirection: 'row', gap: 10, alignItems: 'center' },
  bullet: { width: 7, height: 7, borderRadius: 5 },
  ingredientName: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  ingredientAmount: { fontSize: 12, textAlign: 'right', fontFamily: 'Inter_600SemiBold' },
  steps: { gap: 13 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNumber: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  stepText: { flex: 1, fontSize: 14, lineHeight: 21, paddingTop: 4, fontFamily: 'Inter_400Regular' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  notFoundText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
});
