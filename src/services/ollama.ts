import axios from 'axios';
import { OllamaModel } from '../types';

const OLLAMA_API = 'http://localhost:11434';

export async function getInstalledModels(): Promise<OllamaModel[]> {
  try {
    const response = await axios.get(`${OLLAMA_API}/api/tags`);
    return response.data.models || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export async function chatWithOllama(model: string, prompt: string): Promise<string> {
  try {
    const response = await axios.post(`${OLLAMA_API}/api/generate`, {
      model,
      prompt,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error('Error chatting with Ollama:', error);
    throw new Error('Failed to get response from Ollama');
  }
}