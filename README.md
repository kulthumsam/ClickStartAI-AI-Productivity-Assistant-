# ClickStartAI — AI Workplace Productivity Suite

## Project overview
ClickStartAI is a lightweight AI productivity web app that helps professionals complete common workplace tasks faster. It provides task-focused tools for:
- drafting professional emails
- summarizing meeting notes into structured outcomes
- planning actionable tasks from goals and context
- generating research briefings
- chatting with an AI assistant for general support
- giving feedback for better app use

The app is organized as a dashboard with dedicated pages (routes) for each tool.

## Features
### Dashboard
- A central landing page that presents all available AI tools in one place.

### Email Generator
- Drafts professional emails from a recipient, tone, optional subject, and user-provided key points.

### Meeting Notes Summarizer
- Converts raw notes or transcripts into a structured summary containing decisions and action items.
- Users can paste notes and/or use a file input for content.

### AI Task Planner
- Turns a goal + deadline + context/constraints/resources into a prioritized, actionable plan.

### Research Assistant
- Generates a research briefing based on a topic/question and optional angles or specific questions.

### AI Chatbot
- Provides a general conversational assistant experience for drafting, brainstorming, planning, and quick answers.
- Includes a chat input area and conversational UI.

### Feedback
- Feedback page is accessible where users can submit ratings, categorized feedback, and messages — all saved to the database for admin review.

### Day/Night Feature
- Includes a light and dark mode button so that you can switch between the two.

### Output review and safety messaging
- The UI includes reminders to review/edit AI output before professional use and to avoid sharing confidential information.

## Tools used
This project is built using:
- **Lovable** (for the app/project environment and UI scaffolding)
- **LLM-powered AI generation** (used by each tool to produce drafts/summaries/plans/briefings)
- **Frontend UI components** to support routing and structured “generator” forms (input panel + preview/output panel)

## Setup instructions
Because this project appears to be hosted/managed within **Lovable**, the setup depends on how your Lovable project is configured.

### 1) Clone / open the project
- Open your project in the Lovable environment (or clone it from your workspace/repo if applicable).

### 2) Configure environment variables (if required)
- If the app uses an AI provider key, add the required API key(s) in the Lovable project settings or environment configuration.
- Common items to configure (only if your project requires them):
  - AI provider API key (e.g., OpenAI key or equivalent)
  - any model selection parameters

### 3) Install dependencies (if your Lovable project requires it)
- If the project includes a standard frontend dependency setup, run:
  - `npm install`
  - `npm run dev`

### 4) Run the app
- Use the Lovable “Run/Preview” option to launch the UI.
- Visit the routes for each tool (as defined in the app), such as:
  - `/` (Dashboard)
  - `/email`
  - `/meetings`
  - `/tasks`
  - `/research`
  - `/chat`
  - `/feedback`

### 5) Test each tool
Verify:
- email drafts generate correctly and appear in the output panel
- meeting note summarization produces structured decisions + action items
- task planning returns prioritized plans
- research assistant returns a coherent briefing
- chat responds to prompts in the conversation area
- that feedback is saved to the database for admin review.
