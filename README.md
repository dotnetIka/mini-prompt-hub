# Mini Prompt Hub

A modern, fullstack Next.js application for creating, managing, and executing AI prompt templates with dynamic variable substitution and OpenAI integration.

---

## ✨ Features

- **Prompt Templates:** Save and reuse prompt templates with `{variable}` placeholders.
- **Dynamic Variable Forms:** UI auto-detects required variables for each prompt.
- **AI Execution:** Instantly execute prompts with OpenAI and view results.
- **Type Safety:** End-to-end TypeScript, custom request/response models.
- **Clean Architecture:** Service layer, models, and OpenAI integration are fully decoupled.
- **Beautiful UI:** Responsive, accessible, and themed with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, TypeORM, Service Layer
- **Database:** PostgreSQL (Docker or local)
- **AI Integration:** OpenAI API (configurable via `.env`)
- **Dev Tools:** pgAdmin, Docker Compose

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd mini-prompt-hub
npm install
```

### 2. Database Setup

**Option A: Docker (Recommended)**
```bash
docker-compose up -d
```
**Option B: Local PostgreSQL**
- Create a database named `prompt_hub`
- Set credentials in `.env`

### 3. Environment Variables

Copy and edit your environment file:
```bash
cp .env.example .env
```
Fill in your actual values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=prompt_hub
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=1
```

### 4. Run the App

```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Usage

### Create a Prompt

- Fill in a title and a template (e.g. `Translate to {language}: "{text}"`)
- Click **Create Prompt**

### Execute a Prompt

- Enter values for each variable (auto-detected from the template)
- Click **Execute**
- View the AI's response instantly

---

## 🗂️ Project Structure

```
src/
  components/         # React UI components
  entities/           # TypeORM entities
  lib/                # Database config
  models/
    request/          # API request models (TypeScript)
    response/         # API response models (TypeScript)
  pages/
    api/
      prompts/        # API endpoints (clean, thin handlers)
    index.tsx         # Main UI
  services/           # Business logic & OpenAI integration
```

---

## 📦 API Endpoints

- `POST /api/prompts` — Create a new prompt
- `GET /api/prompts` — List all prompts
- `POST /api/prompts/execute` — Execute a prompt with variables

---

## 🧠 AI Usage Log (Trust, but Verify)

This project was built with a strong AI-assisted workflow, but every line was reviewed, tested, and improved by hand. Here are 5+ significant prompts I used:

1. **TypeORM Entity Creation**
   - _Prompt:_ "Create a TypeORM entity called Prompt with fields: id (auto-incrementing primary key), title (string), template (text), createdAt (timestamp), updatedAt (timestamp)"
   - _Result:_ AI generated the entity, I verified decorators and types.

2. **Database Configuration**
   - _Prompt:_ "Create a TypeORM DataSource configuration for PostgreSQL with environment variables for connection details"
   - _Result:_ AI provided the config, I added error handling and env fallbacks.

3. **API Endpoint Structure**
   - _Prompt:_ "Create Next.js API routes for POST /api/prompts (create), GET /api/prompts (list all), and POST /api/prompts/execute (execute with variables)"
   - _Result:_ AI scaffolded the endpoints, I refactored for clean separation and error handling.

4. **Dynamic Variable Extraction**
   - _Prompt:_ "Create a function to extract variable names from a template string using regex pattern matching for {variable_name} format"
   - _Result:_ AI gave a regex, I tested and integrated it for dynamic forms.

5. **React Component Structure**
   - _Prompt:_ "Create a React component for displaying individual prompts with dynamic form fields for variables and execution functionality"
   - _Result:_ AI provided a base, I fixed React hooks usage and state management.

6. **OpenAI Integration**
   - _Prompt:_ "Integrate OpenAI API in the execute endpoint to send completed prompts and return AI responses"
   - _Result:_ AI showed the SDK usage, I secured the API key and made the integration dynamic and configurable.

7. **Environment Variables Setup**
   - _Prompt:_ "Create environment variable configuration for database connection and OpenAI API key"
   - _Result:_ AI suggested the variables, I created `.env.example` and documented all options.

**Verification:**  
For each prompt, I critically reviewed, tested, and improved the AI's output—ensuring robust error handling, type safety, and best practices throughout.

---

## 🧹 Clean Code Highlights

- **Service Layer:** All business logic and validation is in services, not API handlers.
- **Models:** All request/response types are centralized for type safety.
- **OpenAI Integration:** Fully abstracted, configurable, and secure.
- **Consistent Error Handling:** All API responses are JSON, with clear error messages.
- **Atomic Commits:** Each change is tracked with a clear, conventional commit message.

---

## 📄 License

This project is part of a take-home assignment for Promptrun.ai.

---

## 💡 Questions?

If you have any questions about the code, architecture, or my AI-assisted workflow, feel free to reach out!
