import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export function ModelSelector({ models, selectedModel, onModelSelect }: ModelSelectorProps) {
  return (
    <Select.Root value={selectedModel} onValueChange={onModelSelect}>
      <Select.Trigger className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 w-[200px]">
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border">
          <Select.Viewport className="p-1">
            {models.map((model) => (
              <Select.Item
                key={model}
                value={model}
                className={cn(
                  'relative flex items-center px-8 py-2 text-sm rounded-sm hover:bg-gray-100 cursor-pointer outline-none',
                  'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900'
                )}
              >
                <Select.ItemText>{model}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}