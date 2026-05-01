I need to gather more information about your project structure and purpose. Let me fetch the complete README and explore the repository structure.Based on your repository structure and the existing README, here's a comprehensive README and folder structure documentation for **PersonaGen-AI**:

```markdown name=README.md url=https://github.com/Ashishku1502/PersonaGen-AI/blob/main/README.md
# PersonaGen-AI

A Market Research & Persona Simulation Platform built with Next.js, TypeScript, and modern web technologies.

## Overview

PersonaGen-AI is a platform designed to generate realistic personas and conduct market research simulations. It leverages AI to create detailed buyer personas and simulate market scenarios for research and analysis purposes.

## Features

- 🤖 AI-powered persona generation
- 📊 Market research simulation
- 🎯 Detailed buyer persona profiles
- 📈 Analytics and insights
- 🔄 Real-time data processing
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) - React-based framework for production applications
- **Language**: TypeScript - Type-safe JavaScript
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **Font Optimization**: [Geist Font Family](https://vercel.com/font)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ashishku1502/PersonaGen-AI.git
cd PersonaGen-AI
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Hot Reload

The application supports hot module reloading. You can start editing pages by modifying `app/page.tsx` - the page will auto-update as you make changes.

## Project Structure

```
PersonaGen-AI/
├── app/                    # Next.js App Router directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout component
│   └── ...                # Other pages and routes
├── components/            # Reusable React components
│   ├── ...                # UI components
│   └── ...                # Feature components
├── lib/                   # Utility functions and helpers
│   ├── utils.ts          # Common utilities
│   └── ...                # Other utility modules
├── models/               # Data models and types
│   └── ...                # Model definitions
├── types/                # TypeScript type definitions
│   ├── index.ts          # Main types export
│   └── ...                # Domain-specific types
├── public/               # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
├── styles/              # Global styles (if separate from Tailwind)
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── postcss.config.mjs   # PostCSS configuration
├── eslint.config.mjs    # ESLint configuration
├── .gitignore          # Git ignore rules
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## Configuration Files

- **`package.json`** - Project metadata and dependencies
- **`tsconfig.json`** - TypeScript compiler configuration
- **`next.config.ts`** - Next.js build and runtime configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`postcss.config.mjs`** - PostCSS plugins configuration
- **`eslint.config.mjs`** - Code quality and linting rules
- **`vercel.json`** - Vercel platform deployment settings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Learning Resources

To deepen your understanding of the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Community feedback and contributions

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js application is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) created by the Next.js team.

**Steps:**
1. Push your code to a GitHub repository
2. Import the repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure build settings
4. Your application will be deployed automatically

For detailed deployment instructions, check out [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Ashishku1502**

For more information, visit the [repository](https://github.com/Ashishku1502/PersonaGen-AI).

---

**Last Updated:** May 2026
```

## Folder Structure Breakdown

```
PersonaGen-AI/
│
├── 📁 app/                          # Next.js 13+ App Router
│   ├── page.tsx                     # Home page component
│   ├── layout.tsx                   # Root layout (meta, fonts, global styles)
│   ├── globals.css                  # Global CSS and Tailwind imports
│   ├── 📁 api/                      # API routes for backend
│   ├── 📁 personas/                 # Persona generation routes
│   ├── 📁 research/                 # Market research routes
│   └── 📁 [dynamic]/                # Dynamic route segments
│
├── 📁 components/                   # Reusable UI Components
│   ├── 📁 ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── 📁 personas/                 # Persona-specific components
│   │   ├── PersonaForm.tsx
│   │   ├── PersonaCard.tsx
│   │   └── PersonaList.tsx
│   ├── 📁 research/                 # Research-specific components
│   │   ├── ResearchDashboard.tsx
│   │   ├── DataVisualization.tsx
│   │   └── ...
│   └── Layout.tsx                   # Common layout wrapper
│
├── 📁 lib/                          # Utility Functions
│   ├── utils.ts                     # Common utilities
│   ├── 📁 api/                      # API client functions
│   ├── 📁 personas/                 # Persona generation logic
│   └── 📁 research/                 # Research algorithms
│
├── 📁 models/                       # Data Models
│   ├── Persona.ts                   # Persona model
│   ├── ResearchData.ts              # Research data model
│   └── ...
│
├── 📁 types/                        # TypeScript Definitions
│   ├── index.ts                     # Main types export
│   ├── persona.ts                   # Persona types
│   ├── research.ts                  # Research types
│   └── api.ts                       # API response types
│
├── 📁 public/                       # Static Assets
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── favicon.ico
│
├── 📄 Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── .gitignore
│   ├── .env.local (local environment variables)
│   └── .env.example (environment template)
│
└── 📄 Documentation
    ├── README.md
    ├── AGENTS.md
    ├── CLAUDE.md
    └── vercel.json
```

This structure provides a solid foundation for a scalable Next.js application focused on persona generation and market research!
