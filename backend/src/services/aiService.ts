import axios from 'axios';
import FormData from 'form-data';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001/api/v1';

export const verifyFaceWithAI = async (
  imageBuffer: Buffer,
  originalFilename: string,
  storedEncoding: number[]
) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: originalFilename,
      contentType: 'image/jpeg',
    });
    formData.append('stored_encoding', JSON.stringify(storedEncoding));

    // Send with a 5 second timeout to ensure it doesn't hang the vote
    const response = await axios.post(`${AI_SERVICE_URL}/verify-face`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 5000, 
    });

    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('AI Verification service timed out.');
    }
    const apiError = error.response?.data?.error || error.message;
    throw new Error(`AI Face Verification failed: ${apiError}`);
  }
};

export const extractFaceEncoding = async (
  imageBuffer: Buffer,
  originalFilename: string
) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: originalFilename,
      contentType: 'image/jpeg',
    });

    const response = await axios.post(`${AI_SERVICE_URL}/extract-encoding`, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 5000,
    });

    return response.data.data.encoding; // array of 128 floats
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('AI extraction service timed out.');
    }
    const apiError = error.response?.data?.error || error.message;
    throw new Error(`AI Face Extraction failed: ${apiError}`);
  }
};
