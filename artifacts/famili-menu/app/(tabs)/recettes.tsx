import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppPage, PageHeading, RecipeCard, SmallTag } from '@/components/FamiliMenuUI';
import { RECIPES } from '@/data/recipes';
import { useColors } from '@/hooks/useColors';

const FILTERS = ['Tout', 'Bénin', "Afrique de l’Ouest"] as const;

export default function RecettesScreen() {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Tout');
  const recipes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fr');
    return RECIPES.filter((recipe) => {
      const matchesQuery = !normalized || `${recipe.name} ${recipe.region}`.toLocaleLowerCase('fr').includes(normalized);
      const matchesFilter =
        filter === 'Tout' ||
        (filter === 'Bénin' && recipe.region === 'Bénin') ||
        (filter === "Afrique de l’Ouest" && recipe.region === "Afrique de l'Ouest");
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <AppPage>
      <PageHeading
        eyebrow="À cuisiner chez vous"
        title="Les recettes"
        subtitle={`${RECIPES.length} idées béninoises et ouest-africaines, avec leurs ingrédients et leur vidéo.`}
      />

      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          accessibilityLabel="Rechercher une recette"
          testID="recipe-search"
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher une recette"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Effacer la recherche">
            <Feather name="x-circle" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filters}>
        {FILTERS.map((item) => {
          const selected = item === filter;
          return (
            <TouchableOpacity
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFilter(item)}
            >
              <SmallTag tone={selected ? 'green' : 'orange'}>{item}</SmallTag>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.recipeList}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onPress={() => router.push(`/recette/${recipe.id}`)}
          />
        ))}
      </View>
      {!recipes.length ? (
        <View style={styles.empty}>
          <Feather name="search" size={23} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Aucune recette ne correspond à votre recherche.</Text>
        </View>
      ) : null}
    </AppPage>
  );
}

const styles = StyleSheet.create({
  searchBox: { height: 50, borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, gap: 10, alignItems: 'center', flexDirection: 'row' },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', outlineStyle: 'none' as never },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recipeList: { gap: 11 },
  empty: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 35 },
  emptyText: { fontSize: 13, textAlign: 'center', fontFamily: 'Inter_400Regular' },
});
