import {
  DEFAULT_SENSOR_PROVISIONING_URL,
  SENSOR_PROVISIONING_PATHS,
  SmartGardenProvisioningDeviceInfo,
  SmartGardenProvisioningSensor,
} from "@/constants/smartGardenProvisioning";
import { ProvisionedSensorConfig, SensorClaimResponse } from "@/models/models";
import { useCallback, useState } from "react";
import { useFetch } from "./useFetch";
import { useTranslation } from "@/contexts/language.context";

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
      throw new Error(t('sensor_prov_err_invalid_response', "Réponse capteur invalide ({{status}}).").replace('{{status}}', String(response.status)));
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeDeviceInfo(
  deviceInfo: Record<string, unknown>,
  t: (key: string, fallback?: string) => string
): SmartGardenProvisioningDeviceInfo {
  const topLevelHardwareId = stringValue(deviceInfo.hardware_id, "");
  const name = stringValue(deviceInfo.name, t('sensor_prov_fallback_name', "Capteur Smart Garden"));
  const type = stringValue(deviceInfo.type, "humidity");
  const unit = stringValue(deviceInfo.unit, "%");
  const rawSensors = Array.isArray(deviceInfo.sensors)
    ? deviceInfo.sensors
    : [];

  const sensors = rawSensors
    .filter((sensor): sensor is Record<string, unknown> => {
      return sensor !== null && typeof sensor === "object";
    })
    .map((sensor, index): SmartGardenProvisioningSensor => {
      const localId = sensorLocalId(sensor, index);
      const sensorType = stringValue(sensor.type, type);
      const sensorUnit = stringValue(sensor.unit, unit);
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
        type: sensorType,
        unit: sensorUnit,
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
      type,
      unit,
    });
  }

  if (sensors.length === 0) {
    throw new Error(t('sensor_prov_err_no_hwid', "Le capteur ne retourne pas de hardware_id."));
  }

  return {
    device_hardware_id:
      typeof deviceInfo.device_hardware_id === "string"
        ? deviceInfo.device_hardware_id
        : undefined,
    hardware_id: topLevelHardwareId || sensors[0].hardware_id,
    name,
    type,
    unit,
    fw_version:
      typeof deviceInfo.fw_version === "string"
        ? deviceInfo.fw_version
        : undefined,
    sensors,
  };
}

export function useSensorProvisioning() {
  const { t } = useTranslation();
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
      setProvisioningStatus(t('sensor_prov_status_connecting', "Connexion au point d'accès du capteur..."));

      try {
        const response = await fetchJson<Record<string, unknown>>(
          endpoint(sensorBaseUrl, SENSOR_PROVISIONING_PATHS.deviceInfo),
          t
        );
        const normalizedDeviceInfo = normalizeDeviceInfo(response, t);
        setDeviceInfo(normalizedDeviceInfo);
        setProvisioningStatus(t('sensor_prov_status_detected', "Capteur détecté."));
        return normalizedDeviceInfo;
      } catch (discoverError) {
        setDeviceInfo(null);
        setError(
          discoverError instanceof Error
            ? discoverError.message
            : t('sensor_prov_err_not_found', "Capteur introuvable sur le réseau Wi-Fi actuel.")
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

        setProvisioningStatus(
          t('sensor_prov_status_claiming', "Association de {{count}} capteur(s) au compte...").replace('{{count}}', String(currentDeviceInfo.sensors.length))
        );
        const http = await httpClient;
        const provisionedSensors: ProvisionedSensorConfig[] = [];
        let apiBaseUrl: string | null = null;
        let ingestPath: string | null = null;

        for (const sensor of currentDeviceInfo.sensors) {
          const claimResponse = await http.post("/api/sensors/claim", {
            hardware_id: sensor.hardware_id,
            name: sensor.name,
            type: sensor.type,
            unit: sensor.unit,
          });

          if (claimResponse.status === "Failure") {
            const payload = claimResponse.payload as { error?: string };
            throw new Error(
              payload?.error || t('sensor_prov_err_claim_failed', "Association API impossible pour {{name}}.").replace('{{name}}', sensor.name)
            );
          }

          const claimPayload = claimResponse.payload as SensorClaimResponse;
          apiBaseUrl = apiBaseUrl || claimPayload.api_base_url;
          ingestPath = ingestPath || claimPayload.ingest_path;
          provisionedSensors.push({
            local_id: sensor.local_id,
            hardware_id: sensor.hardware_id,
            name: sensor.name,
            type: sensor.type,
            unit: sensor.unit,
            sensor_id: claimPayload.sensor_id,
            write_token: claimPayload.write_token,
          });
        }

        if (!apiBaseUrl || !ingestPath || provisionedSensors.length === 0) {
          throw new Error(t('sensor_prov_err_incomplete', "Association API incomplète."));
        }

        setProvisioningStatus(t('sensor_prov_status_sending', "Envoi de la configuration au capteur..."));
        await fetchJson(
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
              sensor_id: provisionedSensors[0].sensor_id,
              write_token: provisionedSensors[0].write_token,
              api_base_url: apiBaseUrl,
              ingest_path: ingestPath,
              sensors: provisionedSensors,
            }),
          },
          15000
        );

        setProvisioningStatus(
          t('sensor_prov_status_sent', "Configuration envoyée pour {{count}} capteur(s).").replace('{{count}}', String(provisionedSensors.length))
        );
        return "Success";
      } catch (provisionError) {
        setError(
          provisionError instanceof Error
            ? provisionError.message
            : t('sensor_prov_err_failed', "Provisioning impossible.")
        );
        return "Failure";
      } finally {
        setProvisioning(false);
      }
    },
    [deviceInfo, discoverSensor, httpClient, t]
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
