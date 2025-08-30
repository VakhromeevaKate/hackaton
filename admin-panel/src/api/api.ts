import axios from 'axios';
import type { VideoGenerationRequest, VideoGenerationResponse, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const videoApi = {
  generateVideo: async (
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResponse> => {
    const formData = new FormData();
    
    if (request.image) {
      formData.append('image', request.image);
    }
    formData.append('text', request.text);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 1200000, // 20 минут
        }
      );

      return response.data as VideoGenerationResponse;
    } catch (error) {
      if (error) {
        throw {
          message: 'Ошибка генерации видео',
          status:500,
        } as ApiError;
      }
      throw {
        message: 'Неизвестная ошибка',
        status: 500,
      } as ApiError;
    }
  },
};