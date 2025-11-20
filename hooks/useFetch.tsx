import { QuickHttp } from "@jaslay/http";
import { useState } from "react";
import { useStorage } from "./useStorage";


export function useFetch() {
    const baseUrl = "https://smart-garden-api-production.up.railway.app"
    const { getToken } = useStorage()

    const [httpClient] = useState(async () => new QuickHttp(baseUrl, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken('authToken')}`,
    }
    ));

    return { httpClient };
}
