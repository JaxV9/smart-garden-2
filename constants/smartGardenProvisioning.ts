export const DEFAULT_SENSOR_PROVISIONING_URL = "http://192.168.4.1";

export const SENSOR_PROVISIONING_PATHS = {
  deviceInfo: "/device-info",
  provision: "/provision",
} as const;

export type SmartGardenProvisioningSensor = {
  id: string;
  local_id: string;
  hardware_id: string;
  name: string;
  type: string;
  unit: string;
  bus?: string;
  address?: string;
  pin?: number;
  connected?: boolean;
};

export type SmartGardenProvisioningDeviceInfo = {
  device_hardware_id?: string;
  hardware_id: string;
  name: string;
  type: string;
  unit: string;
  fw_version?: string;
  sensors: SmartGardenProvisioningSensor[];
};
