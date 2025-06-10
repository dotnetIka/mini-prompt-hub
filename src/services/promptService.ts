import { AppDataSource } from '../lib/database';
import { Prompt } from '../entities/Prompt';
import { getOpenAIChatCompletion } from './openaiService';
import type { Repository } from 'typeorm';
import { CreatePromptRequest } from '../models/request/CreatePromptRequest';
import { ExecutePromptRequest } from '../models/request/ExecutePromptRequest';
import { PromptResponse } from '../models/response/PromptResponse';
import { ExecutePromptResponse } from '../models/response/ExecutePromptResponse';

function getOpenAIEnvOptions() {
  return {
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    max_tokens: process.env.OPENAI_MAX_TOKENS ? parseInt(process.env.OPENAI_MAX_TOKENS) : 1000,
    temperature: process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 1,
  };
}

export class PromptService {
  private promptRepository: Repository<Prompt>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error('DataSource not initialized. Call initializeDB first.');
    }
    this.promptRepository = AppDataSource.getRepository(Prompt);
  }

  static async initializeDB() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  validateCreatePromptRequest(req: CreatePromptRequest) {
    if (!req.title || typeof req.title !== 'string' || req.title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }
    if (!req.template || typeof req.template !== 'string' || req.template.trim().length === 0) {
      throw new Error('Template is required and must be a non-empty string');
    }
  }

  async createPrompt(title: string, template: string): Promise<PromptResponse> {
    this.validateCreatePromptRequest({ title, template });
    const prompt = new Prompt();
    prompt.title = title.trim();
    prompt.template = template.trim();
    const saved = await this.promptRepository.save(prompt);
    return saved;
  }

  async getAllPrompts(): Promise<PromptResponse[]> {
    return await this.promptRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getPromptById(id: number): Promise<PromptResponse | null> {
    if (!id || typeof id !== 'number' || isNaN(id)) {
      throw new Error('ID must be a valid number');
    }
    return await this.promptRepository.findOne({ where: { id } });
  }

  validateExecutePromptRequest(req: ExecutePromptRequest) {
    if (!req.promptId || typeof req.promptId !== 'number' || isNaN(req.promptId)) {
      throw new Error('promptId must be a valid number');
    }
    if (typeof req.variables !== 'object' || req.variables === null) {
      throw new Error('variables must be an object');
    }
  }

  replaceVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, variableName) => {
      return variables[variableName] !== undefined ? variables[variableName] : match;
    });
  }

  async executePrompt(promptId: number, variables: Record<string, any>): Promise<ExecutePromptResponse> {
    this.validateExecutePromptRequest({ promptId, variables });
    const prompt = await this.getPromptById(promptId);
    if (!prompt) throw new Error('Prompt not found');
    const completedPrompt = this.replaceVariables(prompt.template, variables);
    const openaiOptions = getOpenAIEnvOptions();
    const completion = await getOpenAIChatCompletion({
      model: openaiOptions.model,
      messages: [
        {
          role: 'user',
          content: completedPrompt,
        },
      ],
      max_tokens: openaiOptions.max_tokens,
      temperature: openaiOptions.temperature,
    });
    const aiResponse = completion.choices[0]?.message?.content || 'No response from AI';
    return {
      prompt: completedPrompt,
      response: aiResponse,
      variables,
    };
  }
} 