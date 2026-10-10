import { RECIPES, type MealPeriod } from '@/data/recipes';

export const MEAL_SCHEDULE: Array<{ type: MealPeriod; label: string; time: string }> = [
  { type: 'petit-déjeuner', label: 'Petit-déjeuner', time: '08:00' },
  { type: 'déjeuner', label: 'Déjeuner', time: '14:00' },
  { type: 'dîner', label: 'Dîner', time: '19:00' },
];

export interface PlannedMeal {
  id: string;
  date: string;
  time: string;
  type: MealPeriod;
  recipeId: string;
}

export interface MenuPlan {
  periodDays: number;
  createdAt: string;
  isDemo: boolean;
  meals: PlannedMeal[];
}

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildMenuPlan(
  periodDays: number,
  startDate = new Date(),
  isDemo = false,
): MenuPlan {
  const meals: PlannedMeal[] = [];
  const recentRecipeIds: string[] = [];
  let slotIndex = 0;

  for (let dayIndex = 0; dayIndex < periodDays; dayIndex += 1) {
    const date = new Date(startDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + dayIndex);
    const dateKey = localDateKey(date);
    const usedToday = new Set<string>();

    for (const slot of MEAL_SCHEDULE) {
      const suitable = RECIPES.filter((recipe) => recipe.suitableFor.includes(slot.type));
      const available = suitable.filter(
        (recipe) =>
          !usedToday.has(recipe.id) &&
          !recentRecipeIds.slice(-6).includes(recipe.id),
      );
      const pool = available.length
        ? available
        : suitable.filter((recipe) => !usedToday.has(recipe.id));
      const recipe = pool[(slotIndex * 7 + periodDays) % pool.length];

      meals.push({
        id: `${dateKey}-${slot.type}`,
        date: dateKey,
        time: slot.time,
        type: slot.type,
        recipeId: recipe.id,
      });
      usedToday.add(recipe.id);
      recentRecipeIds.push(recipe.id);
      slotIndex += 1;
    }
  }

  return { periodDays, createdAt: new Date().toISOString(), isDemo, meals };
}

export function getNextMeal(plan: MenuPlan | null, now = new Date()): PlannedMeal | null {
  if (!plan) return null;
  const currentDate = localDateKey(now);
  for (const meal of plan.meals) {
    if (meal.date < currentDate) continue;
    const scheduledAt = new Date(`${meal.date}T${meal.time}:00`);
    if (scheduledAt.getTime() >= now.getTime()) return meal;
  }
  return null;
}

export function mealLabel(type: MealPeriod): string {
  return MEAL_SCHEDULE.find((meal) => meal.type === type)?.label ?? type;
}

export function formatMealDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
