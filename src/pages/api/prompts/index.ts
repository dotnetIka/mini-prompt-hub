import { NextApiRequest, NextApiResponse } from 'next';
import { PromptService } from '../../../services/promptService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await PromptService.initializeDB();
    const promptService = new PromptService();
    if (req.method === 'POST') {
      const { title, template } = req.body;
      const savedPrompt = await promptService.createPrompt(title, template);
      return res.status(201).json(savedPrompt);
    }
    if (req.method === 'GET') {
      const prompts = await promptService.getAllPrompts();
      return res.status(200).json(prompts);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ error: error.message || 'Internal server error' });
  }
} 