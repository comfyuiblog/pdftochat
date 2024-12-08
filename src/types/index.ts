export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface OllamaModel {
  name: string;
  size: string;
  family: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: string;
  pdfText: string | null;
}