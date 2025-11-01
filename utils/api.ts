import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://iot-backend-plhm.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error("[API] Response error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface Device {
  id: string;
  name: string;
  piSerial?: string;
  location?: {
    label: string;
    lat?: number;
    lng?: number;
  };
  claimed?: boolean;
  claimedBy?: string;
  claimedAt?: string;
  homeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceSnapshot {
  device: Device;
  latestReadings: {
    dht11?: { temp: number; humidity: number; timestamp: string };
    mq2?: { gas_ppm: number; raw_adc: number; timestamp: string };
    hx711?: { weight_g: number; raw_value: number; timestamp: string };
  };
  latestOutputs?: {
    led_on?: boolean;
    buzzer_on?: boolean;
    spoilage_score?: number;
    timestamp?: string;
  };
  itemsCount?: number;
}

export interface InventoryItem {
  id: string;
  device_id: string;
  name: string;
  brand?: string;
  barcode?: string;
  quantity: number;
  unit: string;
  mfd?: string;
  expd?: string;
  status: "ok" | "expiring_soon" | "expired" | "consumed" | "spoilt";
  source: "barcode" | "vision" | "manual";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Home {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}
