export interface VideoTemplate {
  id: string;
  title: string;
  description: string;
  text: string;
  imagePath: string; // Путь к локальному изображению
  category: string;
}

export interface VideoGenerationRequest {
  image: string; // Base64 или путь к изображению
  text: string; // Выбранный текст
}

export interface VideoGenerationResponse {
  videoUrl: string;
  status: 'processing' | 'completed' | 'error';
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface LocalImage {
  id: string;
  path: string;
  title: string;
}