
import React from 'react';
import { Spinner } from './Spinner';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  upscaledImageUrl: string | null;
}

const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-4">
        {children}
    </div>
);

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ImageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, upscaledImageUrl }) => {
  if (isLoading) {
    return (
        <InfoBox>
            <Spinner />
            <p className="mt-4 text-gray-400">AI is enhancing your image...</p>
        </InfoBox>
    );
  }

  if (error) {
    return (
        <InfoBox>
            <ErrorIcon />
            <p className="mt-4 font-semibold text-red-400">Upscaling Failed</p>
            <p className="text-sm text-gray-500 max-w-xs">{error}</p>
        </InfoBox>
    );
  }

  if (upscaledImageUrl) {
    return <img src={upscaledImageUrl} alt="Upscaled" className="object-contain max-w-full max-h-full" />;
  }

  return (
    <InfoBox>
        <ImageIcon />
        <p className="mt-4 font-semibold">Your upscaled image will appear here</p>
        <p className="text-sm text-gray-500">Click "Upscale Image" to start</p>
    </InfoBox>
  );
};
