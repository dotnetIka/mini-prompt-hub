# Mini Prompt Hub

A Next.js application for creating, managing, and executing AI prompt templates with variable substitution.

## Features

- **Create Prompt Templates**: Save reusable prompt templates with variable placeholders
- **Variable Substitution**: Use `{variable_name}` syntax in templates
- **AI Execution**: Execute prompts with OpenAI API integration
- **Clean UI**: Modern, responsive interface built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeORM
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mini-prompt-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name prompt-hub-db \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=prompt_hub \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database named `prompt_hub`
3. Note your database credentials

### 4. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your actual values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=prompt_hub
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Creating a Prompt Template

1. Navigate to the main page
2. Fill in the "Create New Prompt" form:
   - **Title**: A descriptive name (e.g., "Spanish Translator")
   - **Template**: Your prompt with variables in `{curly_braces}` format
   
   Example template:
   ```
   Translate the following text into {language}: "{text_to_translate}"
   ```

3. Click "Create Prompt"

### Executing a Prompt

1. Find your prompt in the "Your Prompts" section
2. Fill in the required variables (automatically detected from the template)
3. Click "Execute"
4. View the AI response in the results section

### Example Templates

**Translation Prompt:**
```
Translate the following text into {language}: "{text_to_translate}"
```

**Code Review Prompt:**
```
Review this {language} code for best practices and potential issues:

{code}
```

**Email Generator:**
```
Write a professional email to {recipient} about {subject}. The tone should be {tone}.
```

## API Endpoints

- `POST /api/prompts` - Create a new prompt
- `GET /api/prompts` - List all prompts
- `GET /api/prompts/[id]` - Get a specific prompt
- `POST /api/prompts/execute` - Execute a prompt with variables

## Development

### Project Structure

```
src/
├── components/          # React components
│   └── PromptCard.tsx
├── entities/           # TypeORM entities
│   └── Prompt.ts
├── lib/               # Utility functions
│   └── database.ts
└── pages/
    ├── api/           # API routes
    │   └── prompts/
    └── index.tsx      # Main page
```

### Database Schema

The `prompts` table contains:
- `id`: Primary key (auto-incrementing)
- `title`: Prompt title (varchar)
- `template`: Prompt template with variables (text)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of a take-home assignment for Promptrun.ai.

## AI Usage

This project was developed using AI assistance following the "Trust, but Verify" principle. See `PROMPTS.md` for a detailed log of AI prompts used during development.
