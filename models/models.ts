// models/models.ts

export type User = {
  name: string;
  email: string;
};

export type Vegetable = {
  id: string;
  name: string;
  description: string;
  specifications: string[];
  sowing: string[];
  plantation: string[];
  harvest: string[];
  affinity: string[];
  bad_neighbors: string[];
  images: string[];
};

export interface GardenVegetable extends Vegetable {
  gardenVegetableId: string;
}

export type LoginInfos = {
  token: string;
  userName: string;
  email: string;
};

export type SensorMeasure = {
  temperature: number | null;
  humidite: number | null;
  pourcentage_luminosite: number | null;
  valeur_eau: number | null;
  tension_sol: number | null;
  valeur_brute_sol: number | null;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type AddVegetableToGardenPayload = {
  vegetableId: string;
};

export type AddVegetableToGardenResponse = {
  gardenVegetableId: string;
};
