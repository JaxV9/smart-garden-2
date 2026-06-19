export const DEFAULT_SENSOR_PROVISIONING_URL = "http://192.168.4.1";

export const SENSOR_PROVISIONING_PATHS = {
  deviceInfo: "/device-info",
  provision: "/provision",
} as const;

export type SmartGardenProvisioningDeviceInfo = {
  hardware_id: string;
  name: string;
  type: string;
  unit: string;
  fw_version?: string;
};
