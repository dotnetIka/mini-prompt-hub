import { NextApiRequest, NextApiResponse } from 'next';
import { PromptService } from '../../../services/promptService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await PromptService.initializeDB();
    const promptService = new PromptService();
    if (req.method === 'POST') {
      const { promptId, variables } = req.body;
      const result = await promptService.executePrompt(promptId, variables);
      return res.status(200).json(result);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    if (error.message === 'Prompt not found') {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    return res.status(400).json({ error: error.message || 'Internal server error' });
  }
} 