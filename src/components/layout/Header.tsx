import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">YouLearn</h1>
          <Button variant="secondary" size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Add content
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <select className="text-sm border rounded-md px-2 py-1">
            <option>US GB</option>
          </select>
          <Button variant="secondary" size="sm">Upgrade</Button>
          <Button size="sm">Sign in</Button>
        </div>
      </div>
    </header>
  );
}