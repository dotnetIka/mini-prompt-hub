import { NextApiRequest, NextApiResponse } from 'next';
import { PromptService } from '../../../services/promptService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await PromptService.initializeDB();
    const promptService = new PromptService();
    if (req.method === 'POST') {
      const { title, template } = req.body;
      if (!title || !template || typeof title !== 'string' || typeof template !== 'string' || title.trim().length === 0 || template.trim().length === 0) {
        return res.status(400).json({ error: 'Title and template are required and must be non-empty strings' });
      }
      const savedPrompt = await promptService.createPrompt(title, template);
      return res.status(201).json(savedPrompt);
    }
    if (req.method === 'GET') {
      const prompts = await promptService.getAllPrompts();
      return res.status(200).json(prompts);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 