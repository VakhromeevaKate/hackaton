import React, { useState, useEffect, useRef } from 'react';
import type { VideoGenerationResponse, ApiError, LocalImage } from '../types';
import { videoApi } from '../api/api';
import './PersonalCabinet.css';

const PersonalCabinet: React.FC = () => {
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<LocalImage | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [images, setImages] = useState<LocalImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadTextTemplates();
    loadImagesTemplates();
  }, []);

  const loadTextTemplates = async () => {
    try {
      const templatesData = await videoApi.getText();
      setTemplates(templatesData);
      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0]);
      }
    } catch (err) {
      setError('Ошибка загрузки шаблонов');
    }
  };

  const loadImagesTemplates = async () => {
    try {
      const templatesData = await videoApi.getImages();
      setImages(templatesData);
      if (templatesData.length > 0) {
        const selectedImage = templatesData.map(image => image.path)?.[0];
        setSelectedTemplate(selectedImage);
      }
    } catch (err) {
      setError('Ошибка загрузки изображений');
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setError('');
  };

  const handleImageSelect = (image: LocalImage) => {
    setSelectedImage(image);
    setError('');
  };

  const handleGenerateVideo = async () => {
    if (!selectedTemplate) {
      setError('Выберите текст шаблона');
      return;
    }

    if (!selectedImage) {
      setError('Выберите изображение');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('Генерация видео...');

    try {
      const request = {
        image: selectedImage.id,
        text: selectedTemplate,
      };

      const response: VideoGenerationResponse = await videoApi.generateVideo(request);
      
      if (response.status === 'completed' && response.videoUrl) {
        setVideoUrl(response.videoUrl);
        setStatus('Видео успешно сгенерировано!');
      } else if (response.status === 'processing') {
        setStatus('Видео обрабатывается...');
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
    setSelectedImage(null);
    setVideoUrl('');
    setError('');
    setStatus('');
  };

  return (
    <div className="personal-cabinet">      
      <h1>Личный кабинет</h1>
      
      <div className="cabinet-container">
        {/* Левая колонка - выбор шаблона и изображения */}
        <div className="selection-section">
          {/* Выбор текстового шаблона */}
          <div className="selection-group">
            <h3>
              <span className="medical-icon">📋</span>
              Выберите текст шаблона
            </h3>
            <div className="templates-list">
              {templates.map((template) => (
                <div
                  key={template}
                  className={`template-card ${
                    selectedTemplate === template ? 'selected' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h4>{template}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Выбор изображения */}
          <div className="selection-group">
            <h3>
              <span className="medical-icon">🖼️</span>
              Выберите изображение
            </h3>
            <div className="images-grid">
              {images.map((image) => (
                <label
                  key={image.id}
                  className={`image-option ${
                    selectedImage?.id === image?.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="image"
                    value={image.title}
                    checked={selectedImage === image}
                    onChange={() => handleImageSelect(image)}
                    disabled={isLoading}
                  />
                  <div className="image-preview">
                    <img 
                      src={image.path} 
                      alt={image.title}
                      className="option-image"
                    />
                    <div className="image-overlay">
                      <div className="checkmark">✓</div>
                    </div>
                  </div>
                  <span className="image-title">{image.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="cabinet-actions">
            <button
              onClick={handleGenerateVideo}
              disabled={isLoading || !selectedTemplate || !selectedImage}
              className="generate-btn"
            >
              {isLoading ? (
                <>
                  <span className="medical-icon">⏳</span>
                  Генерация...
                </>
              ) : (
                <>
                  <span className="medical-icon">Сгенерировать видео 🎬</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="clear-btn"
            >
              <span className="medical-icon">Сбросить 🔄</span>
            </button>
          </div>
        </div>

        {/* Правая колонка - результат */}
        <div className="result-section">
          <h3>
            <span className="medical-icon">📊</span>
            Результат генерации
          </h3>
          
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
                  download="medical-video.mp4"
                  className="download-btn"
                >
                  <span className="medical-icon">💾</span>
                  Скачать видео
                </a>
              </div>
            </div>
          )}

          {!videoUrl && !isLoading && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">👨‍⚕️</div>
              <p>Выберите шаблон и изображение, затем нажмите "Сгенерировать видео"</p>
            </div>
          )}

          {/* Информация о выбранных элементах */}
          {(selectedTemplate || selectedImage) && (
            <div className="selection-info">
              <h4>Выбранные элементы:</h4>
              {selectedTemplate && (
                <div className="selected-item">
                  <strong>Текст:</strong> {selectedTemplate}
                </div>
              )}
              {selectedImage && (
                <div className="selected-item">
                  <strong>Изображение:</strong> {
                    images.find(img => img.id === selectedImage.id)?.title
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalCabinet;