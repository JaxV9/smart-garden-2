import { useGardenContext } from "@/contexts/garden.context";
import { useFetch } from "./useFetch";

type GardenDataApi = {
  id: string;
  name: string;
  location: string;
  userId: string;
} | null;

export function useGardenInfo() {
  const { updateGardenInfo } = useGardenContext();
  const { httpClient } = useFetch(undefined);

  // GET /api/garden
  async function loadGardenInfo(): Promise<"Success" | "Failure"> {
    try {
      const http = await httpClient;
      const res = await http.get("/api/garden");

      if (res.status === "Failure") return "Failure";

      const data = res.payload as GardenDataApi;

      updateGardenInfo({
        name: data?.name ?? null,
        location: data?.location ?? null,
      });

      return "Success";
    } catch (e) {
      console.error("loadGardenInfo failed:", e);
      return "Failure";
    }
  }

  // PUT /api/garden
  async function saveGardenInfo(payload: { name?: string; location?: string }): Promise<"Success" | "Failure"> {
    try {
      const http = await httpClient;
      const res = await http.put("/api/garden", payload);

      if (res.status === "Failure") return "Failure";

      const data = res.payload as Exclude<GardenDataApi, null>;

      updateGardenInfo({
        name: data?.name ?? null,
        location: data?.location ?? null,
      });

      return "Success";
    } catch (e) {
      console.error("saveGardenInfo failed:", e);
      return "Failure";
    }
  }

  return {
    loadGardenInfo,
    saveGardenInfo,
  };
}
