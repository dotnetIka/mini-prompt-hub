import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../lib/database';
import { Prompt } from '../../../entities/Prompt';

// Initialize database connection
const initializeDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDB();
    const promptRepository = AppDataSource.getRepository(Prompt);

    if (req.method === 'GET') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required' });
      }

      const promptId = parseInt(id);
      if (isNaN(promptId)) {
        return res.status(400).json({ error: 'ID must be a valid number' });
      }

      const prompt = await promptRepository.findOne({ where: { id: promptId } });
      
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