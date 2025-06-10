import { NextApiRequest, NextApiResponse } from 'next';
import { PromptService } from '../../../services/promptService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await PromptService.initializeDB();
    const promptService = new PromptService();
    if (req.method === 'POST') {
      const { promptId, variables, openaiOptions } = req.body;
      if (!promptId || typeof promptId !== 'number') {
        return res.status(400).json({ error: 'promptId must be a number' });
      }
      if (typeof variables !== 'object' || variables === null) {
        return res.status(400).json({ error: 'variables must be an object' });
      }
      try {
        const result = await promptService.executePrompt(promptId, variables, openaiOptions);
        return res.status(200).json(result);
      } catch (err: any) {
        if (err.message === 'Prompt not found') {
          return res.status(404).json({ error: 'Prompt not found' });
        }
        console.error('OpenAI API Error:', err);
        return res.status(500).json({ error: 'Failed to get AI response' });
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 