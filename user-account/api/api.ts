import axios from 'axios';
import type { VideoGenerationRequest, VideoGenerationResponse, ApiError, LocalImage } from '../types';
import one from '../src/assets/character_01.jpg'
import two from '../src/assets/character_02.jpg'
import three from '../src/assets/character_03.jpg'
import four from '../src/assets/character_04.jpg'

const API_BASE_URL = 'http://localhost:3001/api';

// Шаблоны с локальными путями к изображениям
export const mockText: string[] = [
  'Первый текст',
  'Здравствуйте!'
];

// Локальные изображения
export const mockImages: LocalImage[] = [
  { id: 'img1', path: one, title: 'Врач 1' },
  { id: 'img2', path: two, title: 'Врач 2' },
  { id: 'img3', path: three, title: 'Врач 2' },
  { id: 'img4', path: four, title: 'Врач 4' }
];

export const videoApi = {
  generateVideo: async (
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-video`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 1200000,
        }
      );

      return response.data as VideoGenerationResponse;
    } catch (error) {
      throw {
        message: 'Ошибка генерации видео',
        status: 500,
      } as ApiError;
    }
  },

  getText: async (): Promise<string[]> => {
    return mockText;
  },

  getImages: async (): Promise<LocalImage[]> => {
    return mockImages;
  }
};