import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useVegetablesContext } from "@/contexts/vegetables.context";
import { useVegetable } from "@/hooks/useVegetable";
import { useTranslation } from "@/contexts/language.context";

import type {
  MonthRange,
  PlantRef,
  Veg,
} from "../types/types";
import { rangeFromMonths } from "../utils/month";
import {
  cleanImageUri,
  normalize,
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
  const { t } = useTranslation();

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

  const getTranslatedFamily = (rawSpecs?: string[]) => {
    if (!rawSpecs) return "";
    const spec = rawSpecs.find(x => x.toLowerCase().includes("famille"));
    if (!spec) return "";
    const parts = spec.split(":");
    const rawFamily = (parts[1] ?? "").trim();
    const familyKey = "fam_" + rawFamily.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    const translatedFamilyName = t(familyKey as any) || rawFamily;
    const label = t('plant_meta_family') || "Famille";
    return `${label} : ${translatedFamilyName}`;
  };

  const getTranslatedScientific = (rawSpecs?: string[]) => {
    if (!rawSpecs) return "";
    const spec = rawSpecs.find(x => x.toLowerCase().includes("nom scientifique"));
    if (!spec) return "";
    const parts = spec.split(":");
    const rawSci = (parts[1] ?? "").trim();
    const label = t('plant_meta_scientific') || "Nom scientifique";
    return `${label} : ${rawSci}`;
  };

  const family = getTranslatedFamily(vegetable?.specifications);
  const scientific = getTranslatedScientific(vegetable?.specifications);

  const affinityPlants: PlantRef[] = (
    (vegetable?.affinity ?? []) as string[]
  ).map((n) => {
    const found = vegetablesContext.find(
      (v: any) => normalize(v?.name) === normalize(n)
    );
    return { id: found?.id, name: n, image: found?.images?.[0] };
  });

  const enemyPlants: PlantRef[] = (
    (vegetable?.bad_neighbors ?? []) as string[]
  ).map((n) => {
    const found = vegetablesContext.find(
      (v: any) => normalize(v?.name) === normalize(n)
    );
    return { id: found?.id, name: n, image: found?.images?.[0] };
  });

  const sowingRange = rangeFromMonths(vegetable?.sowing);
  const plantationRange = rangeFromMonths(vegetable?.plantation);
  const harvestRange = rangeFromMonths(vegetable?.harvest);

  const imageUri = cleanImageUri(vegetable?.images?.[0]);

  const season = Array.isArray(vegetable?.season)
    ? vegetable.season.map((s: string) => t(('season_' + s.toLowerCase()) as any) || s).join(", ")
    : vegetable?.season
    ? t(('season_' + String(vegetable.season).toLowerCase()) as any) || String(vegetable.season)
    : "";

  const watering = vegetable?.watering
    ? t(('water_' + vegetable.watering.toLowerCase()) as any) || vegetable.watering
    : "";

  const sun = vegetable?.sun_exposure
    ? t(('sun_' + vegetable.sun_exposure.replace(/\s+/g, '_').toLowerCase()) as any) || vegetable.sun_exposure
    : "";

  const temp = vegetable?.temperature ?? "";
  const rawAdvices = (vegetable?.advices ?? []) as string[];
  const advices = rawAdvices.map((adv, idx) => t(('veg_tip_' + vegetable.id + '_' + idx) as any) || adv);

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
    vegetable: {
      ...vegetable,
      name: t(('veg_name_' + vegetable.id) as any) || vegetable.name,
      description: t(('veg_desc_' + vegetable.id) as any) || vegetable.description,
    },
    imageUri,
    family,
    scientific,

    season,
    watering,
    sun,
    temp,
    advices: advices.length
      ? advices
      : [t('plant_no_advice') || "Aucun conseil disponible pour le moment."],

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
