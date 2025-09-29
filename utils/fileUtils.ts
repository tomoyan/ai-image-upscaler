
export interface ConversionResult {
  dataUrl: string;
  base64: string;
  mimeType: string;
}

export const convertFile = (file: File): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        return reject(new Error('File is not an image.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
      const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
      resolve({ dataUrl, base64, mimeType });
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};
