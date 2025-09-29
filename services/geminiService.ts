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
            text: `Your task is to upscale this image by ${factor}x. The goal is to produce a professional-grade, high-quality, enhanced version. Focus on these key areas:
1. **Detail Enhancement**: Intelligently add realistic details and textures. Enhance fine lines and intricate patterns.
2. **Clarity and Sharpness**: Significantly increase the sharpness and definition of the image. Eliminate any blurriness.
3. **Artifact Removal**: Remove any compression artifacts (like JPEG blocking), noise, or digital grain.
4. **Color & Lighting**: Subtly improve color vibrancy and lighting to make the image more dynamic, while staying true to the original's mood.
5. **Transparency Preservation**: This is critical. If the original image has a transparent background, the upscaled image MUST maintain that transparency perfectly.

Do not add any new elements to the image. Only enhance what is already there. Return only the final upscaled image.`,
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