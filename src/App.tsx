import React, { useState, useEffect } from 'react';
import { Tabs } from './components/ui/Tabs';
import { Header } from './components/layout/Header';
import { PDFViewer } from './components/pdf/PDFViewer';
import { ChatPanel } from './components/chat/ChatPanel';
import { ModelSelector } from './components/models/ModelSelector';
import { Message, ChatState, OllamaModel } from './types';
import { getInstalledModels } from './services/models';
import { chatWithOllama } from './services/chat';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedModel: '',
    pdfText: null,
  });
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    async function fetchModels() {
      try {
        const models = await getInstalledModels();
        setAvailableModels(models);
        if (models.length > 0) {
          setState(prev => ({ ...prev, selectedModel: models[0].name }));
        } else {
          setError('No Ollama models found. Please ensure Ollama is running and has models installed.');
        }
      } catch (err) {
        setError('Failed to connect to Ollama. Please ensure the service is running.');
      }
    }
    fetchModels();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const prompt = state.pdfText 
        ? `Context from PDF:\n${state.pdfText}\n\nUser question: ${content}`
        : content;

      const response = await chatWithOllama(state.selectedModel, prompt);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          role: 'assistant',
          content: `Error: ${errorMessage}. Please try again.`
        }],
        isLoading: false,
      }));
    }
  };

  const handlePDFUpload = (text: string) => {
    setState(prev => ({ ...prev, pdfText: text }));
  };

  const handleModelSelect = (modelName: string) => {
    setState(prev => ({ ...prev, selectedModel: modelName }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1">
          <PDFViewer pdfText={state.pdfText} onPDFUpload={handlePDFUpload} />
        </div>
        <div className="w-[400px] flex flex-col">
          <Tabs
            tabs={[
              { id: 'chat', label: 'Chat' },
              { id: 'models', label: 'Models' },
              { id: 'flashcards', label: 'Flashcards' },
              { id: 'summary', label: 'Summary' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <div className="mt-4">
            {activeTab === 'chat' && (
              <ChatPanel
                messages={state.messages}
                isLoading={state.isLoading}
                onSendMessage={handleSendMessage}
                disabled={!state.selectedModel}
              />
            )}
            {activeTab === 'models' && (
              <ModelSelector
                models={availableModels}
                selectedModel={state.selectedModel}
                onModelSelect={handleModelSelect}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;