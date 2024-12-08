import React from 'react';
import { OllamaModel } from '../../types';
import { Select } from '../ui/Select';

interface ModelSelectorProps {
  models: OllamaModel[];
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export function ModelSelector({ models, selectedModel, onModelSelect }: ModelSelectorProps) {
  const options = models.map(model => ({
    value: model.name,
    label: `${model.name} (${model.family})`
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Model</h2>
      <Select
        options={options}
        value={selectedModel}
        onValueChange={onModelSelect}
        placeholder="Select a model"
      />
      {models.length === 0 && (
        <p className="text-sm text-red-500">
          No models found. Please install models using the Ollama CLI:
          <pre className="mt-2 p-2 bg-gray-100 rounded-md">
            ollama pull mistral
          </pre>
        </p>
      )}
    </div>
  );
}