
import React, { useState, useCallback } from 'react';
import { Spinner } from './Spinner';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if(isEntering) {
        if(e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    } else {
        setIsDragging(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const borderStyle = isDragging 
    ? 'border-teal-400' 
    : 'border-gray-600';

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div 
        className={`relative w-full h-80 bg-gray-800 border-2 border-dashed ${borderStyle} rounded-2xl flex flex-col items-center justify-center text-center p-8 transition-all duration-300 cursor-pointer hover:border-teal-500`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange} 
            disabled={isLoading}
        />
        {isLoading ? (
            <div className="flex flex-col items-center">
                <Spinner />
                <p className="mt-4 text-gray-400">Loading image...</p>
            </div>
        ) : (
            <>
                <UploadIcon />
                <p className="mt-4 text-lg font-semibold text-gray-300">Drag & drop your image here</p>
                <p className="text-gray-500">or click to browse</p>
                <p className="text-xs text-gray-600 mt-2">PNG, JPG, or WEBP</p>
            </>
        )}
      </div>
      {error && (
        <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
