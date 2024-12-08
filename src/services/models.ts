import { OllamaModel } from '../types';
import { api } from './api';

export async function getInstalledModels(): Promise<OllamaModel[]> {
  try {
    const response = await api.get('/tags');
    return (response.data.models || []).map((model: any) => ({
      name: model.name,
      size: model.size,
      family: model.family,
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}