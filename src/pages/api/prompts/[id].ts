import { NextApiRequest, NextApiResponse } from 'next';
import { PromptService } from '../../../services/promptService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await PromptService.initializeDB();
    const promptService = new PromptService();
    if (req.method === 'GET') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required' });
      }
      const promptId = parseInt(id);
      if (isNaN(promptId)) {
        return res.status(400).json({ error: 'ID must be a valid number' });
      }
      const prompt = await promptService.getPromptById(promptId);
      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' });
      }
      return res.status(200).json(prompt);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 