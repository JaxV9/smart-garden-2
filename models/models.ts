export type User = {
  id?: string;
  name: string;
  publicName?: string | null;
  email: string;
  avatarUri?: string | null;
  level: string | null;
  isPrivate?: boolean;
  isPremium?: boolean;
  language?: string;
};

export type Vegetable = {
  id: string;
  name: string;
  category?: string[];
  description: string;
  specifications: string[];
  difficulty: string;
  watering: string;
  sun_exposure: string;
  season: string[];
  temperature: string;
  conseils: string[];
  sowing: string[];
  plantation: string[];
  harvest: string[];
  affinity: string[];
  bad_neighbors: string[];
  images: string[];
  icons: string
};

export interface GardenVegetablePayload {
  id: string,
  vegetableId: string,
  createdAt: string,
  userId: string
}

export interface GardenVegetable extends Vegetable {
  gardenVegetableId: string;
}

export type LoginInfos = {
  token: string;
  userId: string;
  userName: string;
  email: string;
  level: string | null;
  isPrivate?: boolean;
  publicName?: string | null;
  isPremium?: boolean;
  language?: string;
};

export type SensorMeasure = {
  temperature: number | null;
  humidite: number | null;
  pourcentage_luminosite: number | null;
  valeur_eau: number | null;
  tension_sol: number | null;
  valeur_brute_sol: number | null;
};

export type SensorReading = {
  id: string;
  sensor_id: string;
  value_numeric: number;
  raw_value: number | null;
  voltage: number | null;
  created_at: string;
  updated_at: string;
  recorded_at: string | null;
};

export type GardenSensor = {
  id: string;
  hardware_id: string | null;
  name: string;
  type: string;
  unit: string;
  is_active: boolean;
  data_collection_enabled: boolean;
  created_at: string;
  updated_at: string;
  latest_reading: SensorReading | null;
};

export type SensorClaimPayload = {
  hardware_id: string;
  name: string;
  type: string;
  unit: string;
};

export type SensorClaimResponse = {
  sensor_id: string;
  write_token: string;
  api_base_url: string;
  ingest_path: string;
  hardware_id?: string;
  name?: string;
  type?: string;
  unit?: string;
};

export type ProvisionedSensorConfig = {
  local_id: string;
  hardware_id: string;
  name: string;
  type: string;
  unit: string;
  sensor_id: string;
  write_token: string;
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

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export const TaskPriorityLabels: Record<TaskPriority, string> = {
  LOW: "Faible",
  MEDIUM: "Moyenne",
  HIGH: "Élevée",
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  plant: GardenVegetablePayload | null;
  dueDate: string | null;
  priority: TaskPriority | null;
  reminder: boolean | null;
  completed: boolean;
  createdAt: string | null;
  userId: string;
};

export type TaskCreateInput = Omit<Task, "id" | "createdAt" | "userId" | "plant"> & {
  plantId?: string | null;
};

export type Month = 'January' | 'February' | 'March'
  | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December'


export type VegetablePlannification = 'sowing' | 'plantation' | 'harvest'

export type VegetableMonth = {
  vegetable: Vegetable,
  type: VegetablePlannification
}

export type Calendar = {
  month: Month
  vegetables: VegetableMonth[]
}[]

export type GardenerLevel = 'beginner' | 'amateur' | 'advanced' | 'enthusiast'
