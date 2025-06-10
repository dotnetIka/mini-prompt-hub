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
    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-900">{prompt.title}</h3>
          <p className="text-sm text-blue-400 mt-1">
            Created: {new Date(prompt.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Template:</h4>
        <div className="bg-blue-50 p-3 rounded-md">
          <code className="text-sm text-blue-900">{prompt.template}</code>
        </div>
      </div>

      {/* Variable Input Form */}
      {variables.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Variables:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {variables.map((variable) => (
              <div key={variable}>
                <label htmlFor={`${prompt.id}-${variable}`} className="block text-xs text-blue-700 mb-1">
                  {variable}
                </label>
                <input
                  type="text"
                  id={`${prompt.id}-${variable}`}
                  value={variableValues[variable] || ''}
                  onChange={(e) => setVariableValues(prev => ({ ...prev, [variable]: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-blue-900 bg-white"
                  placeholder={`Enter ${variable}`}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleExecute}
            disabled={executeLoading || Object.keys(variableValues).length !== variables.length}
            className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow"
          >
            {executeLoading ? 'Executing...' : 'Execute'}
          </button>
        </div>
      )}

      {/* Execute Result */}
      {executeResult && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Result:</h4>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-blue-700">Completed Prompt:</span>
              <div className="bg-white p-2 rounded border text-sm text-blue-900">
                {executeResult.prompt}
              </div>
            </div>
            <div>
              <span className="text-xs text-blue-700">AI Response:</span>
              <div className="bg-white p-2 rounded border text-sm whitespace-pre-wrap text-blue-900">
                {executeResult.response}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 