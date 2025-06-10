import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../lib/database';
import { Prompt } from '../../../entities/Prompt';
import OpenAI from 'openai';

// Initialize database connection
const initializeDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to replace variables in template
function replaceVariables(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, variableName) => {
    return variables[variableName] !== undefined ? variables[variableName] : match;
  });
}

// Function to extract variable names from template
function extractVariables(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return matches.map(match => match.slice(1, -1));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDB();
    const promptRepository = AppDataSource.getRepository(Prompt);

    if (req.method === 'POST') {
      const { promptId, variables } = req.body;

      // Validate input
      if (!promptId || !variables) {
        return res.status(400).json({ error: 'promptId and variables are required' });
      }

      if (typeof promptId !== 'number') {
        return res.status(400).json({ error: 'promptId must be a number' });
      }

      if (typeof variables !== 'object' || variables === null) {
        return res.status(400).json({ error: 'variables must be an object' });
      }

      // Fetch the prompt
      const prompt = await promptRepository.findOne({ where: { id: promptId } });
      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' });
      }

      // Replace variables in template
      const completedPrompt = replaceVariables(prompt.template, variables);

      // Call OpenAI API
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: completedPrompt,
            },
          ],
          max_tokens: 1000,
        });

        const aiResponse = completion.choices[0]?.message?.content || 'No response from AI';

        return res.status(200).json({
          prompt: completedPrompt,
          response: aiResponse,
          variables: variables,
        });
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        return res.status(500).json({ error: 'Failed to get AI response' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 