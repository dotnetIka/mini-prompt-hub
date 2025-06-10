import { AppDataSource } from '../lib/database';
import { Prompt } from '../entities/Prompt';
import { getOpenAIChatCompletion } from './openaiService';
import type { Repository } from 'typeorm';

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

  async createPrompt(title: string, template: string) {
    const prompt = new Prompt();
    prompt.title = title.trim();
    prompt.template = template.trim();
    return await this.promptRepository.save(prompt);
  }

  async getAllPrompts() {
    return await this.promptRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getPromptById(id: number) {
    return await this.promptRepository.findOne({ where: { id } });
  }

  replaceVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, variableName) => {
      return variables[variableName] !== undefined ? variables[variableName] : match;
    });
  }

  async executePrompt(promptId: number, variables: Record<string, any>, openaiOptions?: Partial<{ model: string; max_tokens: number; temperature: number; }>) {
    const prompt = await this.getPromptById(promptId);
    if (!prompt) throw new Error('Prompt not found');
    const completedPrompt = this.replaceVariables(prompt.template, variables);
    const completion = await getOpenAIChatCompletion({
      model: openaiOptions?.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: completedPrompt,
        },
      ],
      max_tokens: openaiOptions?.max_tokens || 1000,
      temperature: openaiOptions?.temperature || 1,
    });
    const aiResponse = completion.choices[0]?.message?.content || 'No response from AI';
    return {
      prompt: completedPrompt,
      response: aiResponse,
      variables,
    };
  }
} 