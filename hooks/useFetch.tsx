import { QuickHttp } from "@jaslay/http";
import { useState } from "react";
import { useStorage } from "./useStorage";


export function useFetch(baseUrlProps: string | undefined) {
    const baseUrl = baseUrlProps !== undefined
        ? baseUrlProps
        : process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
    const { getToken } = useStorage()

    const [httpClient] = useState(async () => new QuickHttp(baseUrl, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken('authToken')}`,
    }
    ));

    return { httpClient };
}
