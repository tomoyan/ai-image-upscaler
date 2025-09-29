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
            text: `Your primary task is to perform an expert-level AI-powered upscaling of this image by a factor of ${factor}x. The final output must be a dramatically enhanced, high-resolution version that looks professionally restored and sharpened.

Execute the following enhancements:
- **Reconstruct Details**: Intelligently generate and refine fine details, textures, and patterns that were lost or blurry in the original. The result should be sharp and clear.
- **Eliminate Imperfections**: Completely remove all digital noise, compression artifacts (like JPEG blocking), and grain. The image should be clean.
- **Improve Clarity**: Sharpen the entire image, focusing on edges and important features to make it crisp and defined.
- **Enhance Colors and Lighting**: Boost color saturation and contrast for a more vibrant and dynamic look. Adjust the lighting to improve depth and realism, while respecting the original's color palette.
- **White Background**: If the original has a transparent background, you MUST replace it with a solid, pure white background (#FFFFFF).

The goal is a transformation, not just a simple resize. Do not add new objects or subjects. Return only the enhanced image.`,
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