import {
  DEFAULT_SENSOR_PROVISIONING_URL,
  SENSOR_PROVISIONING_PATHS,
  SmartGardenProvisioningDeviceInfo,
} from "@/constants/smartGardenProvisioning";
import { SensorClaimResponse } from "@/models/models";
import { useCallback, useState } from "react";
import { useFetch } from "./useFetch";

type ProvisionPayload = {
  sensorBaseUrl: string;
  wifiSsid: string;
  wifiPassword: string;
};

function normalizeBaseUrl(value: string): string {
  const trimmedValue = value.trim();
  return trimmedValue.endsWith("/")
    ? trimmedValue.slice(0, -1)
    : trimmedValue;
}

function endpoint(baseUrl: string, path: string): string {
  return `${normalizeBaseUrl(baseUrl)}${path}`;
}

async function fetchJson<T>(
  url: string,
  options?: RequestInit,
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Réponse capteur invalide (${response.status}).`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeDeviceInfo(
  deviceInfo: Partial<SmartGardenProvisioningDeviceInfo>
): SmartGardenProvisioningDeviceInfo {
  if (
    typeof deviceInfo.hardware_id !== "string" ||
    deviceInfo.hardware_id.trim().length === 0
  ) {
    throw new Error("Le capteur ne retourne pas de hardware_id.");
  }

  return {
    hardware_id: deviceInfo.hardware_id.trim(),
    name:
      typeof deviceInfo.name === "string" && deviceInfo.name.trim().length > 0
        ? deviceInfo.name.trim()
        : "Capteur Smart Garden",
    type:
      typeof deviceInfo.type === "string" && deviceInfo.type.trim().length > 0
        ? deviceInfo.type.trim()
        : "humidity",
    unit:
      typeof deviceInfo.unit === "string" && deviceInfo.unit.trim().length > 0
        ? deviceInfo.unit.trim()
        : "%",
    fw_version:
      typeof deviceInfo.fw_version === "string"
        ? deviceInfo.fw_version
        : undefined,
  };
}

export function useSensorProvisioning() {
  const { httpClient } = useFetch(undefined);
  const [deviceInfo, setDeviceInfo] =
    useState<SmartGardenProvisioningDeviceInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [provisioningStatus, setProvisioningStatus] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearDeviceInfo = useCallback(() => {
    setDeviceInfo(null);
  }, []);

  const discoverSensor = useCallback(
    async (
      sensorBaseUrl = DEFAULT_SENSOR_PROVISIONING_URL
    ): Promise<SmartGardenProvisioningDeviceInfo | null> => {
      setError(null);
      setChecking(true);
      setProvisioningStatus("Connexion au point d'accès du capteur...");

      try {
        const response = await fetchJson<Partial<SmartGardenProvisioningDeviceInfo>>(
          endpoint(sensorBaseUrl, SENSOR_PROVISIONING_PATHS.deviceInfo)
        );
        const normalizedDeviceInfo = normalizeDeviceInfo(response);
        setDeviceInfo(normalizedDeviceInfo);
        setProvisioningStatus("Capteur détecté.");
        return normalizedDeviceInfo;
      } catch (discoverError) {
        setDeviceInfo(null);
        setError(
          discoverError instanceof Error
            ? discoverError.message
            : "Capteur introuvable sur le réseau Wi-Fi actuel."
        );
        return null;
      } finally {
        setChecking(false);
      }
    },
    []
  );

  const provisionSensor = useCallback(
    async ({
      sensorBaseUrl,
      wifiSsid,
      wifiPassword,
    }: ProvisionPayload): Promise<"Success" | "Failure"> => {
      setError(null);
      setProvisioning(true);

      try {
        const currentDeviceInfo =
          deviceInfo ?? (await discoverSensor(sensorBaseUrl));

        if (!currentDeviceInfo) {
          return "Failure";
        }

        setProvisioningStatus("Association au compte...");
        const http = await httpClient;
        const claimResponse = await http.post("/api/sensors/claim", {
          hardware_id: currentDeviceInfo.hardware_id,
          name: currentDeviceInfo.name,
          type: currentDeviceInfo.type,
          unit: currentDeviceInfo.unit,
        });

        if (claimResponse.status === "Failure") {
          const payload = claimResponse.payload as { error?: string };
          throw new Error(payload?.error || "Association API impossible.");
        }

        const claimPayload = claimResponse.payload as SensorClaimResponse;

        setProvisioningStatus("Envoi de la configuration au capteur...");
        await fetchJson(
          endpoint(sensorBaseUrl, SENSOR_PROVISIONING_PATHS.provision),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              wifi_ssid: wifiSsid,
              wifi_password: wifiPassword,
              sensor_id: claimPayload.sensor_id,
              write_token: claimPayload.write_token,
              api_base_url: claimPayload.api_base_url,
              ingest_path: claimPayload.ingest_path,
            }),
          },
          15000
        );

        setProvisioningStatus("Configuration envoyée.");
        return "Success";
      } catch (provisionError) {
        setError(
          provisionError instanceof Error
            ? provisionError.message
            : "Provisioning impossible."
        );
        return "Failure";
      } finally {
        setProvisioning(false);
      }
    },
    [deviceInfo, discoverSensor, httpClient]
  );

  return {
    deviceInfo,
    checking,
    provisioning,
    provisioningStatus,
    error,
    discoverSensor,
    provisionSensor,
    clearDeviceInfo,
    clearError,
  };
}
