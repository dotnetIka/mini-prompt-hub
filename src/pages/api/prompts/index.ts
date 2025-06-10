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

    if (req.method === 'POST') {
      const { title, template } = req.body;

      // Sanitize and validate input
      if (!title || !template) {
        return res.status(400).json({ error: 'Title and template are required' });
      }

      if (typeof title !== 'string' || typeof template !== 'string') {
        return res.status(400).json({ error: 'Title and template must be strings' });
      }

      if (title.trim().length === 0 || template.trim().length === 0) {
        return res.status(400).json({ error: 'Title and template cannot be empty' });
      }

      // Create new prompt
      const prompt = new Prompt();
      prompt.title = title.trim();
      prompt.template = template.trim();

      const savedPrompt = await promptRepository.save(prompt);
      return res.status(201).json(savedPrompt);
    }

    if (req.method === 'GET') {
      const prompts = await promptRepository.find({
        order: { createdAt: 'DESC' }
      });
      return res.status(200).json(prompts);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 