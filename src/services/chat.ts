import { api } from './api';

export async function chatWithOllama(model: string, prompt: string): Promise<string> {
  try {
    const response = await api.post('/generate', {
      model,
      prompt,
      stream: false,
    });
    return response.data.response;
  } catch (error) {
    console.error('Error chatting with Ollama:', error);
    throw new Error('Failed to get response from Ollama. Please ensure the Ollama service is running.');
  }
}