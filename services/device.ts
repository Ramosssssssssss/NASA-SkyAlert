import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';

export function getDeviceLabel(): string {
  const model = Device.modelName || Device.deviceName || Platform.OS;
  const os = Device.osName || Platform.OS;
  const ver = Device.osVersion || String(Platform.Version);
  return `${model} · ${os} ${ver}`;
}

let cachedLocation: string | null = null;

export async function getLocationLabel(): Promise<string> {
  if (cachedLocation) return cachedLocation;

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      cachedLocation = '—';
      return cachedLocation;
    }

    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    const [geo] = await Location.reverseGeocodeAsync({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });

    if (geo) {
      const parts = [geo.city, geo.region, geo.country].filter(Boolean);
      cachedLocation = parts.length > 0 ? parts.slice(0, 2).join(', ') : '—';
    } else {
      cachedLocation = '—';
    }
  } catch {
    cachedLocation = '—';
  }

  return cachedLocation;
}
