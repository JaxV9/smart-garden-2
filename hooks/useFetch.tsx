import { useState } from "react";
import { useStorage } from "./useStorage";

type HttpStatus = "Success" | "Failure";
type QueryPayload = Record<string, string | number | boolean | null | undefined>;
type RequestPayload = Record<string, unknown> | unknown[] | null | undefined;

type HttpResponse = {
    payload: unknown;
    status: HttpStatus;
    code: number;
};

const HTTP_TIMEOUT_MS = 20000;

class SafeHttp {
    constructor(
        private readonly baseUrl: string,
        private readonly headers: HeadersInit
    ) {}

    private async responseManager(response: Response): Promise<HttpResponse> {
        const text = await response.text();
        let payload: unknown = {};

        if (text.trim().length > 0) {
            try {
                payload = JSON.parse(text);
            } catch {
                payload = { message: text };
            }
        } else if (!response.ok) {
            payload = { message: `Réponse vide du serveur (${response.status})` };
        }

        return {
            payload,
            status: response.ok ? "Success" : "Failure",
            code: response.status,
        };
    }

    private url(path: string): string {
        return `${this.baseUrl}${path}`;
    }

    private async request(url: string, options: RequestInit): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

        try {
            return await fetch(url, {
                ...options,
                signal: controller.signal,
            });
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error(
                    "Requête API trop longue. Accepte les données cellulaires ou vérifie le tunnel API."
                );
            }

            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async get(path: string, payload?: QueryPayload): Promise<HttpResponse> {
        let url = this.url(path);

        if (payload && Object.keys(payload).length > 0) {
            const queryParams = new URLSearchParams();

            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });

            const query = queryParams.toString();
            if (query) {
                url += `?${query}`;
            }
        }

        const response = await this.request(url, {
            method: "GET",
            headers: this.headers,
        });

        return this.responseManager(response);
    }

    async post(path: string, payload?: RequestPayload): Promise<HttpResponse> {
        return this.withBody("POST", path, payload);
    }

    async put(path: string, payload?: RequestPayload): Promise<HttpResponse> {
        return this.withBody("PUT", path, payload);
    }

    async patch(path: string, payload?: RequestPayload): Promise<HttpResponse> {
        return this.withBody("PATCH", path, payload);
    }

    async delete(path: string): Promise<HttpResponse> {
        const response = await this.request(this.url(path), {
            method: "DELETE",
            headers: this.headers,
        });

        return this.responseManager(response);
    }

    private async withBody(
        method: "POST" | "PUT" | "PATCH",
        path: string,
        payload?: RequestPayload
    ): Promise<HttpResponse> {
        const response = await this.request(this.url(path), {
            method,
            headers: this.headers,
            body: JSON.stringify(payload ?? {}),
        });

        return this.responseManager(response);
    }
}

export function useFetch(baseUrlProps: string | undefined) {
    const baseUrl = baseUrlProps !== undefined
        ? baseUrlProps
        : process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
    const { getToken } = useStorage()

    const [httpClient] = useState(async () => new SafeHttp(baseUrl, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken('authToken')}`,
    }
    ));

    return { httpClient };
}
