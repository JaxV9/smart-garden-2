import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useVegetablesContext } from "@/contexts/vegetables.context";
import { useVegetable } from "@/hooks/useVegetable";

import type {
  MonthRange,
  PlantRef,
  Veg,
} from "../types/types";
import { rangeFromMonths } from "../utils/month";
import {
  cleanImageUri,
  extractFamily,
  extractScientific,
  normalize,
  seasonToString,
} from "../utils/vegetableText";

type VM =
  | { state: "loading" }
  | { state: "error"; error: string }
  | { state: "not_found" }
  | {
    state: "ready";
    vegetable: Veg;
    imageUri: string;
    family: string;
    scientific: string;

    season: string;
    watering: string;
    sun: string;
    temp: string;
    advices: string[];

    sowingRange: MonthRange;
    plantationRange: MonthRange;
    harvestRange: MonthRange;

    affinityPlants: PlantRef[];
    enemyPlants: PlantRef[];

    insets: ReturnType<typeof useSafeAreaInsets>;
    onBack: () => void;
    onAddToGarden: (id: string) => void;

    SafeArea: typeof SafeAreaView;
    Scroll: typeof ScrollView;
    contentContainerStyle: any;
  };

export function useVegetableDetails(vegetableId?: string): VM {
  const { vegetablesContext } = useVegetablesContext();
  const { loadVegetables, isLoading, error } = useVegetable();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (vegetablesContext.length === 0) {
      loadVegetables();
    }
  }, [vegetablesContext.length, loadVegetables]);

  const vegetable = useMemo(() => {
    if (!vegetableId) return undefined;
    return vegetablesContext.find((item: any) => item.id === vegetableId) as
      | Veg
      | undefined;
  }, [vegetablesContext, vegetableId]);

  // états identiques à ton écran
  if (isLoading && vegetablesContext.length === 0) return { state: "loading" };
  if (error && vegetablesContext.length === 0)
    return { state: "error", error: String(error) };
  if (!vegetable) return { state: "not_found" };

  const family = extractFamily(vegetable?.specifications);
  const scientific = extractScientific(vegetable?.specifications);

  const affinityPlants: PlantRef[] = (
    (vegetable?.affinity ?? []) as string[]
  ).map((n) => {
    const found = vegetablesContext.find(
      (v: any) => normalize(v?.name) === normalize(n)
    );
    return { name: n, image: found?.images?.[0] };
  });

  const enemyPlants: PlantRef[] = (
    (vegetable?.bad_neighbors ?? []) as string[]
  ).map((n) => {
    const found = vegetablesContext.find(
      (v: any) => normalize(v?.name) === normalize(n)
    );
    return { name: n, image: found?.images?.[0] };
  });

  const sowingRange = rangeFromMonths(vegetable?.sowing);
  const plantationRange = rangeFromMonths(vegetable?.plantation);
  const harvestRange = rangeFromMonths(vegetable?.harvest);

  const imageUri = cleanImageUri(vegetable?.images?.[0]);
  const season = seasonToString(vegetable?.season);
  const watering = vegetable?.watering ?? "";
  const sun = vegetable?.sun_exposure ?? "";
  const temp = vegetable?.temperature ?? "";
  const advices = (vegetable?.advices ?? []) as string[];

  const onBack = () => router.back();

  const onAddToGarden = (id: string) => {
    // TODO: brancher sur ton GardenContext/API
    console.log("ADD_TO_GARDEN", id);
  };

  const contentContainerStyle = useMemo(
    () => [{ paddingBottom: 110 + insets.bottom }],
    [insets.bottom]
  );

  return {
    state: "ready",
    vegetable,
    imageUri,
    family,
    scientific,

    season,
    watering,
    sun,
    temp,
    advices: advices.length
      ? advices
      : ["Aucun conseil disponible pour le moment."],

    sowingRange,
    plantationRange,
    harvestRange,

    affinityPlants,
    enemyPlants,

    insets,
    onBack,
    onAddToGarden,

    SafeArea: SafeAreaView,
    Scroll: ScrollView,
    contentContainerStyle,
  };
}
