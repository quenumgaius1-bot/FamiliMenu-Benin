import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { RECIPE_BY_ID } from '@/data/recipes';
import { buildMenuPlan, type MenuPlan } from '@/lib/menu-planner';

const STORAGE_KEY = 'famili-menu:local-data:v1';

interface PersistedData {
  plan: MenuPlan;
  remindersEnabled: boolean;
}

interface PersistenceAdapter {
  load(): Promise<PersistedData | null>;
  save(data: PersistedData): Promise<void>;
}

// This adapter can later be replaced by an authenticated API/database repository.
const localPersistence: PersistenceAdapter = {
  async load() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedData) : null;
  },
  async save(data) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
};

interface FamiliMenuContextValue {
  plan: MenuPlan | null;
  remindersEnabled: boolean;
  isReady: boolean;
  storageError: string | null;
  savePlan(plan: MenuPlan): Promise<void>;
  saveRemindersEnabled(enabled: boolean): Promise<void>;
}

const FamiliMenuContext = createContext<FamiliMenuContextValue | null>(null);

export function FamiliMenuProvider({ children }: React.PropsWithChildren) {
  const [plan, setPlan] = useState<MenuPlan | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      try {
        const saved = await localPersistence.load();
        if (!active) return;
        if (saved) {
          const outdatedDemo = saved.plan.isDemo && saved.plan.meals.some((meal) => {
            const recipe = RECIPE_BY_ID[meal.recipeId];
            return !recipe || !recipe.suitableFor.includes(meal.type);
          });
          const restoredPlan = outdatedDemo
            ? buildMenuPlan(3, new Date(), true)
            : saved.plan;
          if (outdatedDemo) {
            await localPersistence.save({
              plan: restoredPlan,
              remindersEnabled: saved.remindersEnabled,
            });
          }
          setPlan(restoredPlan);
          setRemindersEnabled(saved.remindersEnabled);
        } else {
          const demoPlan = buildMenuPlan(3, new Date(), true);
          await localPersistence.save({ plan: demoPlan, remindersEnabled: false });
          if (!active) return;
          setPlan(demoPlan);
        }
      } catch {
        if (active) {
          setStorageError('Les données locales ne peuvent pas être chargées. Vérifiez le stockage de votre appareil.');
        }
      } finally {
        if (active) setIsReady(true);
      }
    }
    void hydrate();
    return () => {
      active = false;
    };
  }, []);

  const savePlan = useCallback(async (nextPlan: MenuPlan) => {
    const current = await localPersistence.load();
    await localPersistence.save({
      plan: nextPlan,
      remindersEnabled: current?.remindersEnabled ?? remindersEnabled,
    });
    setPlan(nextPlan);
    setStorageError(null);
  }, [remindersEnabled]);

  const saveRemindersEnabled = useCallback(async (enabled: boolean) => {
    const current = await localPersistence.load();
    const currentPlan = current?.plan ?? plan;
    if (!currentPlan) throw new Error('Le menu de démonstration n’est pas encore prêt.');
    await localPersistence.save({ plan: currentPlan, remindersEnabled: enabled });
    setRemindersEnabled(enabled);
    setStorageError(null);
  }, [plan]);

  const value = useMemo(
    () => ({ plan, remindersEnabled, isReady, storageError, savePlan, saveRemindersEnabled }),
    [plan, remindersEnabled, isReady, storageError, savePlan, saveRemindersEnabled],
  );
  return <FamiliMenuContext.Provider value={value}>{children}</FamiliMenuContext.Provider>;
}

export function useFamiliMenu(): FamiliMenuContextValue {
  const context = useContext(FamiliMenuContext);
  if (!context) throw new Error('useFamiliMenu doit être utilisé dans FamiliMenuProvider.');
  return context;
}
