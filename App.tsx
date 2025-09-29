import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { ActionButton } from './components/ActionButton';
import { type OriginalImage } from './types';
import { convertFile } from './utils/fileUtils';
import { upscaleImage } from './services/geminiService';

const Header: React.FC = () => (
  <header className="text-center p-4 md:p-6">
    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
      AI Image <span className="text-teal-400">Upscaler</span>
    </h1>
    <p className="mt-2 text-lg text-gray-400">Enhance your images with the power of Gemini AI.</p>
  </header>
);

const ImagePanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center w-full aspect-square shadow-lg">
    <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
    <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-900/50">
      {children}
    </div>
  </div>
);

const FactorButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
  const baseStyles = 'px-6 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200';
  const activeStyles = 'bg-teal-500 text-white focus:ring-teal-400';
  const inactiveStyles = 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500';

  return (
    <button onClick={onClick} className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}>
      {children}
    </button>
  );
};


export default function App() {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState<2 | 4>(2);

  const handleImageSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUpscaledImageUrl(null);
    try {
      const { dataUrl, base64, mimeType } = await convertFile(file);
      setOriginalImage({ file, dataUrl, base64, mimeType });
    } catch (err) {
      setError('Failed to load image. Please try another file.');
      setOriginalImage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpscale = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setUpscaledImageUrl(null);

    try {
      const result = await upscaleImage(originalImage.base64, originalImage.mimeType, upscaleFactor);
      if (result) {
        setUpscaledImageUrl(result);
      } else {
        setError('The AI could not generate an upscaled image. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, upscaleFactor]);

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setUpscaledImageUrl(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (!upscaledImageUrl) return;

    const image = new Image();
    image.crossOrigin = 'anonymous'; // Necessary for canvas operations on data URLs
    image.src = upscaledImageUrl;

    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw the image directly onto the transparent canvas to preserve transparency
        ctx.drawImage(image, 0, 0);

        // Create download link from the canvas content
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');

        const fileName = originalImage?.file.name ?? 'download.png';
        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        link.download = `${baseName}_upscaled_${upscaleFactor}x.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    image.onerror = () => {
        // Fallback to direct download if canvas method fails for any reason
        console.error("Canvas image loading failed. Falling back to direct download.");
        const link = document.createElement('a');
        link.href = upscaledImageUrl;
        const fileName = originalImage?.file.name ?? 'download.png';
        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        link.download = `${baseName}_upscaled_${upscaleFactor}x.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }, [upscaledImageUrl, originalImage, upscaleFactor]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-4">
          {!originalImage ? (
            <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} error={error} />
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImagePanel title="Original Image">
                  <img src={originalImage.dataUrl} alt="Original" className="object-contain max-w-full max-h-full" />
                </ImagePanel>
                <ImagePanel title="Upscaled Image">
                  <ResultDisplay 
                    isLoading={isLoading} 
                    error={error} 
                    upscaledImageUrl={upscaledImageUrl} 
                  />
                </ImagePanel>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">Factor:</span>
                    <FactorButton onClick={() => setUpscaleFactor(2)} isActive={upscaleFactor === 2}>
                        2x
                    </FactorButton>
                    <FactorButton onClick={() => setUpscaleFactor(4)} isActive={upscaleFactor === 4}>
                        4x
                    </FactorButton>
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-600"></div>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <ActionButton onClick={handleUpscale} disabled={isLoading || !!upscaledImageUrl}>
                      {isLoading ? 'Upscaling...' : `✨ Upscale ${upscaleFactor}x`}
                    </ActionButton>
                    <ActionButton onClick={handleDownload} disabled={!upscaledImageUrl || isLoading} variant="secondary">
                      Download
                    </ActionButton>
                    <ActionButton onClick={handleReset} disabled={isLoading} variant="danger">
                      Start Over
                    </ActionButton>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}