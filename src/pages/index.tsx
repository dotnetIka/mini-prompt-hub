import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import PromptCard from '../components/PromptCard';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface Prompt {
  id: number;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

interface ExecuteResponse {
  prompt: string;
  response: string;
  variables: Record<string, any>;
}

// Function to extract variables from template
function extractVariables(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return matches.map(match => match.slice(1, -1));
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ title: '', template: '' });
  const [loading, setLoading] = useState(false);
  const [executeResults, setExecuteResults] = useState<Record<number, ExecuteResponse>>({});
  const [executeLoading, setExecuteLoading] = useState<Record<number, boolean>>({});

  // Fetch prompts on component mount
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const createPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });

      if (response.ok) {
        const createdPrompt = await response.json();
        setPrompts([createdPrompt, ...prompts]);
        setNewPrompt({ title: '', template: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert('Failed to create prompt');
    } finally {
      setLoading(false);
    }
  };

  const executePrompt = async (promptId: number, variables: Record<string, any>) => {
    setExecuteLoading(prev => ({ ...prev, [promptId]: true }));
    
    try {
      const response = await fetch('/api/prompts/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptId, variables }),
      });

      if (response.ok) {
        const result = await response.json();
        setExecuteResults(prev => ({ ...prev, [promptId]: result }));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error executing prompt:', error);
      alert('Failed to execute prompt');
    } finally {
      setExecuteLoading(prev => ({ ...prev, [promptId]: false }));
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gray-50 p-8`}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mini Prompt Hub</h1>
          <p className="text-lg text-gray-600">Create, manage, and execute AI prompt templates</p>
        </header>

        {/* Create New Prompt Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Prompt</h2>
          <form onSubmit={createPrompt} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPrompt.title}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Spanish Translator"
                required
              />
            </div>
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                Template
              </label>
              <textarea
                id="template"
                value={newPrompt.template}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, template: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder='e.g., Translate the following text into {language}: "{text_to_translate}"'
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Prompt'}
            </button>
          </form>
        </div>

        {/* Prompts List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Prompts</h2>
          {prompts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No prompts created yet. Create your first prompt above!</p>
            </div>
          ) : (
            prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onExecute={executePrompt}
                executeLoading={executeLoading[prompt.id] || false}
                executeResult={executeResults[prompt.id]}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
