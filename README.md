# Al Sadara E-Commerce Platform

E-commerce platform for Al Sadara company selling building management electronics and raw materials, featuring an AI-powered assistant.

## Tech Stack

- **CMS & Admin**: Payload CMS 3.0
- **Frontend**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **AI Agent**: Gemini Flash API
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)
- pnpm or npm

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd al-sadara
```

2. Install dependencies:
```bash
npm install
```

3. Start PostgreSQL:
```bash
docker-compose up -d
```

4. Copy environment variables:
```bash
cp .env.example .env
```

5. Run development server:
```bash
npm run dev
```

6. Open the admin panel at `http://localhost:3000/admin` and create your first admin user.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n routes (ar/en)
│   └── (payload)/          # Payload admin routes
├── collections/            # Payload CMS collections
├── components/             # React components
├── dictionaries/           # Translation files
├── lib/                    # Utility functions
└── hooks/                  # React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate:types` - Generate Payload types
