import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIChatCompletionParams {
  model: string;
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[];
  max_tokens?: number;
  temperature?: number;
  [key: string]: any;
}

export async function getOpenAIChatCompletion(params: OpenAIChatCompletionParams) {
  return await openai.chat.completions.create(params);
} 