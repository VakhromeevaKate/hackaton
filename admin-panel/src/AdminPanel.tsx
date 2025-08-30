import React, { useState, useRef } from 'react';
import type { VideoGenerationRequest, VideoGenerationResponse, ApiError } from './types';
import { videoApi } from './api/api';
import './AdminPanel.css';

const MedicalAccents = () => (
  <>
    <div className="medical-accent cross-1">⚕</div>
    <div className="medical-accent cross-2">⚕</div>
  </>
);

const AdminPanel: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      
      // Проверка типа файла
      if (!selectedFile.type.startsWith('image/')) {
        setError('Пожалуйста, выберите файл изображения');
        return;
      }

      setImage(selectedFile);
      setError('');
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleGenerateVideo = async () => {
    if (!image) {
      setError('Пожалуйста, загрузите изображение');
      return;
    }

    if (!text.trim()) {
      setError('Пожалуйста, введите текст');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('Генерация видео...');

    try {
      const request: VideoGenerationRequest = { image, text };
      const response: VideoGenerationResponse = await videoApi.generateVideo(request);
      
      if (response.status === 'completed' && response.videoUrl) {
        setVideoUrl(response.videoUrl);
        setStatus('Видео успешно сгенерировано!');
      } else if (response.status === 'processing') {
        setStatus('Видео обрабатывается...');
        // Здесь можно реализовать polling для проверки статуса
      } else {
        setError(response.message || 'Ошибка генерации видео');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Произошла ошибка при генерации видео');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setText('');
    setVideoUrl('');
    setError('');
    setStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='App'>
    <div className="admin-panel">
      <MedicalAccents />
      <h1>Админ панель</h1>
      
      <div className="admin-container">
        {/* Левая колонка */}
        <div className="upload-section">
          <div className="form-group">
            <label htmlFor="image-upload" className="upload-label">
              Загрузите аватар
            </label>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
              className="file-input"
            />
            {image && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="preview-image"
                />
                <p className="file-name">{image.name}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="text-input" className="text-label">
              Введите текст для генерации видео
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              disabled={isLoading}
              placeholder="Введите описание или текст для видео..."
              rows={6}
              className="text-input"
            />
          </div>

          <div className="actions">
            <button
              onClick={handleGenerateVideo}
              disabled={isLoading || !image || !text.trim()}
              className="generate-btn"
            >
              {isLoading ? 'Генерация...' : 'Сгенерировать видео'}
            </button>
            
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="clear-btn"
            >
              Очистить
            </button>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="result-section">
          <h3>Результат генерации</h3>
          
          {status && (
            <div className={`status ${isLoading ? 'loading' : 'completed'}`}>
              {status}
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {videoUrl && (
            <div className="video-container">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="video-player"
                onLoadedData={() => setStatus('Видео готово к просмотру')}
              >
                Ваш браузер не поддерживает видео.
              </video>
              
              <div className="video-actions">
                <a
                  href={videoUrl}
                  download="generated-video.mp4"
                  className="download-btn"
                >
                  Скачать видео
                </a>
              </div>
            </div>
          )}

          {!videoUrl && !isLoading && !error && (
            <div className="placeholder">
              <p>Здесь появится сгенерированное видео</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminPanel;