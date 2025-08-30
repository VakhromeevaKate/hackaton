export interface VideoGenerationRequest {
  image: File | null;
  text: string;
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