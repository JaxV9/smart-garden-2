import { useGardenContext } from "@/contexts/garden.context";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { AddVegetableToGardenPayload, GardenVegetablePayload, Vegetable } from "@/models/models";
import { useFetch } from "./useFetch";


export function useGarden() {
    const { gardenVegetables, setGardenVegetables } = useGardenContext()
    const { vegetablesContext } = useVegetablesContext()

    const { httpClient } = useFetch(undefined)

    async function loadGardenVegetables(): Promise<"Success" | "Failure"> {
        const http = await httpClient

        const response = await http.get('/api/user/vegetables');
        if (response.status !== 'Failure') {
            const gardenVegetables = response.payload as GardenVegetablePayload[]
            const vegetables = gardenVegetables.map((gardenVegetable) => {
                return vegetablesContext.find(vegetable => vegetable.id === gardenVegetable.vegetableId)
            }) as Vegetable[]
            setGardenVegetables(vegetables)
        }
        return response.status
    }

    async function addVegetableToGarden(vegetable: Vegetable): Promise<"Success" | "Failure"> {
        const payload: AddVegetableToGardenPayload = { vegetableId: vegetable.id };
        const http = await httpClient
        const response = await http.post('/api/user/vegetable', payload);
        loadGardenVegetables()
        return response.status
    }

    async function removeVegetablesFromGarden(vegetableId: string): Promise<"Success" | "Failure"> {
        const http = await httpClient
        const response = await http.delete(`/api/user/vegetable/${vegetableId}`)
        return response.status;
    }

    return {
        loadGardenVegetables,
        addVegetableToGarden,
        removeVegetablesFromGarden
    };
}
