import { ApodResponse } from '@/types/apod';

const API_KEY = 'ufbf7Dhe61L5GZY8yTKbnwKr8vfyDg2Ur99BCRBa';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

export const fetchApod = async (date?: string): Promise<ApodResponse> => {
  const params = new URLSearchParams({ api_key: API_KEY });

  if (date) {
    params.append('date', date);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new Error('Fecha no valida. Usa el formato YYYY-MM-DD.');
      case 403:
        throw new Error('API Key invalida.');
      case 429:
        throw new Error('Demasiadas solicitudes. Intenta en unos minutos.');
      default:
        throw new Error(`Error del servidor (${response.status}). Intenta de nuevo.`);
    }
  }

  return response.json();
};
