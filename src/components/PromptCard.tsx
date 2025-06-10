import { useState } from 'react';

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

interface PromptCardProps {
  prompt: Prompt;
  onExecute: (promptId: number, variables: Record<string, any>) => Promise<void>;
  executeLoading: boolean;
  executeResult?: ExecuteResponse;
}

// Function to extract variables from template
function extractVariables(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return matches.map(match => match.slice(1, -1));
}

export default function PromptCard({ prompt, onExecute, executeLoading, executeResult }: PromptCardProps) {
  const variables = extractVariables(prompt.template);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const handleExecute = () => {
    onExecute(prompt.id, variableValues);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{prompt.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(prompt.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Template:</h4>
        <div className="bg-gray-100 p-3 rounded-md">
          <code className="text-sm">{prompt.template}</code>
        </div>
      </div>

      {/* Variable Input Form */}
      {variables.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Variables:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {variables.map((variable) => (
              <div key={variable}>
                <label htmlFor={`${prompt.id}-${variable}`} className="block text-xs text-gray-600 mb-1">
                  {variable}
                </label>
                <input
                  type="text"
                  id={`${prompt.id}-${variable}`}
                  value={variableValues[variable] || ''}
                  onChange={(e) => setVariableValues(prev => ({ ...prev, [variable]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={`Enter ${variable}`}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleExecute}
            disabled={executeLoading || Object.keys(variableValues).length !== variables.length}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {executeLoading ? 'Executing...' : 'Execute'}
          </button>
        </div>
      )}

      {/* Execute Result */}
      {executeResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Result:</h4>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">Completed Prompt:</span>
              <div className="bg-white p-2 rounded border text-sm">
                {executeResult.prompt}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">AI Response:</span>
              <div className="bg-white p-2 rounded border text-sm whitespace-pre-wrap">
                {executeResult.response}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 