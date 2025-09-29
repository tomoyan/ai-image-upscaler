import { GoogleGenAI, Modality } from "@google/genai";

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const upscaleImage = async (base64ImageData: string, mimeType: string, factor: 2 | 4): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Upscale this image by ${factor}x, enhancing details and improving clarity. It is critical to preserve the original's transparency. If the original image has a transparent background, the final upscaled image MUST also have a transparent background. Make the image sharper and more defined. Only return the upscaled image.`,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const returnedMimeType = part.inlineData.mimeType || 'image/png';
        return `data:${returnedMimeType};base64,${base64ImageBytes}`;
      }
    }
    
    console.warn("No image found in Gemini response parts.");
    return null;

  } catch (error) {
    console.error("Error upscaling image:", error);
    throw new Error("Failed to upscale image with Gemini API. Please check your API key and network connection.");
  }
};