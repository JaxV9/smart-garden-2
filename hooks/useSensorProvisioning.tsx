import {
  DEFAULT_SENSOR_PROVISIONING_URL,
  SENSOR_PROVISIONING_PATHS,
  SmartGardenProvisioningDeviceInfo,
  SmartGardenProvisioningSensor,
} from "@/constants/smartGardenProvisioning";
import { useTranslation } from "@/contexts/language.context";
import { useCallback, useState } from "react";
import { useStorage } from "./useStorage";

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

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function sensorLocalId(sensor: Record<string, unknown>, index: number): string {
  return stringValue(
    sensor.local_id,
    stringValue(sensor.id, stringValue(sensor.type, `sensor-${index + 1}`))
  );
}

async function fetchJson<T>(
  url: string,
  t: (key: string, fallback?: string) => string,
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
      throw new Error(
        t(
          "sensor_prov_err_invalid_response",
          "Réponse capteur invalide ({{status}})."
        ).replace("{{status}}", String(response.status))
      );
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isLikelyLostProvisionResponse(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    error.name === "AbortError" ||
    message.includes("aborted") ||
    message.includes("network request failed") ||
    message.includes("networkerror") ||
    message.includes("timed out")
  );
}

function normalizeDeviceInfo(
  deviceInfo: Record<string, unknown>,
  t: (key: string, fallback?: string) => string
): SmartGardenProvisioningDeviceInfo {
  const topLevelHardwareId = stringValue(deviceInfo.hardware_id, "");
  const name = stringValue(
    deviceInfo.name,
    t("sensor_prov_fallback_name", "Capteur Smart Garden")
  );
  const topLevelType = stringValue(deviceInfo.type, "");
  const topLevelUnit = stringValue(deviceInfo.unit, "");
  const rawSensors = Array.isArray(deviceInfo.sensors)
    ? deviceInfo.sensors
    : [];

  const sensors = rawSensors
    .filter((sensor): sensor is Record<string, unknown> => {
      return sensor !== null && typeof sensor === "object";
    })
    .map((sensor, index): SmartGardenProvisioningSensor => {
      const localId = sensorLocalId(sensor, index);
      const sensorType = stringValue(sensor.type, topLevelType);
      const sensorUnit = stringValue(sensor.unit, topLevelUnit);
      const fallbackHardwareId =
        topLevelHardwareId.length === 0
          ? ""
          : index === 0
          ? topLevelHardwareId
          : `${topLevelHardwareId}-${localId}`;
      const sensorHardwareId = stringValue(
        sensor.hardware_id,
        fallbackHardwareId
      );

      return {
        id: stringValue(sensor.id, localId),
        local_id: localId,
        hardware_id: sensorHardwareId,
        name: stringValue(sensor.name, name),
        type: sensorType || "temperature",
        unit: sensorUnit || (sensorType === "humidity" ? "%" : "C"),
        bus: typeof sensor.bus === "string" ? sensor.bus : undefined,
        address:
          typeof sensor.address === "string" ? sensor.address : undefined,
        pin: typeof sensor.pin === "number" ? sensor.pin : undefined,
        connected:
          typeof sensor.connected === "boolean" ? sensor.connected : undefined,
      };
    })
    .filter((sensor) => sensor.hardware_id.length > 0);

  if (sensors.length === 0 && topLevelHardwareId.length > 0) {
    sensors.push({
      id: "primary",
      local_id: "primary",
      hardware_id: topLevelHardwareId,
      name,
      type: topLevelType || "temperature",
      unit: topLevelUnit || "C",
    });
  }

  if (sensors.length === 0) {
    throw new Error(
      t("sensor_prov_err_no_hwid", "Le capteur ne retourne pas de hardware_id.")
    );
  }

  return {
    device_hardware_id:
      typeof deviceInfo.device_hardware_id === "string"
        ? deviceInfo.device_hardware_id
        : undefined,
    hardware_id: topLevelHardwareId || sensors[0].hardware_id,
    name,
    type: topLevelType || sensors[0].type,
    unit: topLevelUnit || sensors[0].unit,
    fw_version:
      typeof deviceInfo.fw_version === "string"
        ? deviceInfo.fw_version
        : undefined,
    sensors,
  };
}

export function useSensorProvisioning() {
  const { t } = useTranslation();
  const { getToken } = useStorage();
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
      setProvisioningStatus(
        t(
          "sensor_prov_status_connecting",
          "Connexion au point d'accès du capteur..."
        )
      );

      try {
        const response = await fetchJson<Record<string, unknown>>(
          endpoint(sensorBaseUrl, SENSOR_PROVISIONING_PATHS.deviceInfo),
          t
        );
        const normalizedDeviceInfo = normalizeDeviceInfo(response, t);
        setDeviceInfo(normalizedDeviceInfo);
        setProvisioningStatus(t("sensor_prov_status_detected", "Capteur détecté."));
        return normalizedDeviceInfo;
      } catch (discoverError) {
        setDeviceInfo(null);
        setError(
          discoverError instanceof Error
            ? discoverError.message
            : t(
                "sensor_prov_err_not_found",
                "Capteur introuvable sur le réseau Wi-Fi actuel."
              )
        );
        return null;
      } finally {
        setChecking(false);
      }
    },
    [t]
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

        const authToken = await getToken("authToken");
        const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

        if (!authToken) {
          throw new Error(
            t("sensor_prov_err_no_session", "Session utilisateur introuvable.")
          );
        }

        if (!apiBaseUrl) {
          throw new Error(
            t(
              "sensor_prov_err_no_api_url",
              "URL API introuvable dans EXPO_PUBLIC_API_URL."
            )
          );
        }

        setProvisioningStatus(
          t(
            "sensor_prov_status_sending_wifi",
            "Envoi du Wi-Fi au capteur. Il va se connecter puis s'associer au compte..."
          )
        );
        let response: {
          status?: string;
          error?: string;
          wifi_connected?: boolean;
          claimed_sensors?: unknown[];
        };

        try {
          response = await fetchJson(
            endpoint(sensorBaseUrl, SENSOR_PROVISIONING_PATHS.provision),
            t,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                wifi_ssid: wifiSsid,
                wifi_password: wifiPassword,
                api_base_url: apiBaseUrl,
                claim_path: "/api/sensors/claim",
                ingest_path: "/api/sensor-readings",
                auth_token: authToken,
                sensors: currentDeviceInfo.sensors,
              }),
            },
            60000
          );
        } catch (provisionResponseError) {
          if (isLikelyLostProvisionResponse(provisionResponseError)) {
            setProvisioningStatus(
              t(
                "sensor_prov_status_reconnect",
                "Configuration envoyée. Reconnecte ton téléphone au Wi-Fi du jardin."
              )
            );
            return "Success";
          }

          throw provisionResponseError;
        }

        if (response.status !== "paired") {
          throw new Error(
            response.error ||
              t("sensor_prov_err_incomplete", "Appairage capteur incomplet.")
          );
        }

        const claimedCount = Array.isArray(response.claimed_sensors)
          ? response.claimed_sensors.length
          : currentDeviceInfo.sensors.length;

        setProvisioningStatus(
          t("sensor_prov_status_paired", "{{count}} capteur(s) appairé(s).").replace(
            "{{count}}",
            String(claimedCount)
          )
        );
        return "Success";
      } catch (provisionError) {
        setError(
          provisionError instanceof Error
            ? provisionError.message
            : t("sensor_prov_err_failed", "Provisioning impossible.")
        );
        return "Failure";
      } finally {
        setProvisioning(false);
      }
    },
    [deviceInfo, discoverSensor, getToken, t]
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
