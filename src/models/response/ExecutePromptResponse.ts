export interface ExecutePromptResponse {
  prompt: string;
  response: string;
  variables: Record<string, any>;
} 