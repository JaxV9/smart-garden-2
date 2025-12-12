import { Vegetable } from "@/models/models";

const TREFLE_DATA_URL =
  "https://outamtvthkoviplxcznc.supabase.co/storage/v1/object/public/vegetables/trefleapi_plants_30.json";

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function fetchVegetables(): Promise<Vegetable[]> {
  const response = await fetch(TREFLE_DATA_URL);
  if (!response.ok) {
    throw new Error(`Impossible de charger les plantes (${response.status}).`);
  }

  const data = (await response.json()) as any[];

  return data.map((vegetable, index) => {
    const slug = vegetable.id ?? slugify(vegetable.name) ?? `vegetable-${index}`;
    return {
      ...vegetable,
      id: slug,
      images: vegetable.images ?? [],
    } as Vegetable;
  });
}
