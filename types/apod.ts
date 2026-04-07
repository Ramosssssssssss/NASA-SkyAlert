export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  service_version: string;
  thumbnail_url?: string;
}

export interface HistoryEntry {
  id: string;
  apod: {
    title: string;
    date: string;
    media_type: string;
    url: string;
  };
  consultedAt: string;
  device: string;
  location: string;
}
