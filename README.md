# GenBridgeSG 🫶

**Singapore's skill exchange marketplace connecting generations.**

GenBridgeSG is a community-driven platform that bridges the generational gap by enabling young adults and seniors to share their skills as services. Whether you want to teach what you know or learn something new, GenBridgeSG creates meaningful connections through skill exchange.

---

## 🎯 About The Project

GenBridgeSG addresses the growing need for intergenerational connection in Singapore by creating a vibrant marketplace where:

- **Young adults** can share modern tech skills, languages, and contemporary knowledge
- **Seniors** can offer traditional crafts, life wisdom, and cultural heritage
- **Everyone** can build meaningful relationships across generations

### Key Features

- 🔍 **Browse & Discover** - Explore skills offered by community members
- 🤝 **Smart Matching** - AI-powered recommendations to connect compatible learning partners
- 💬 **Messaging System** - Secure in-app messaging to coordinate lessons and exchanges
- 📊 **Personal Dashboard** - Manage your skills, connections, and learning journey
- 🌐 **Multilingual Support** - Breaking language barriers in Singapore's diverse community
- 🤖 **AI Chatbot** - Get instant help navigating the platform
- 🛡️ **Safety Guidelines** - Built-in safety features and community moderation
- 👨‍💼 **Admin Moderation** - Ensuring a safe and respectful community environment

---

## 🛠️ Technology Stack

GenBridgeSG is built with modern, scalable technologies:

### Frontend
- **[React 18](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool & dev server
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component library
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend as a Service (Authentication, Database, Real-time)
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Additional Tools
- **[Recharts](https://recharts.org/)** - Data visualization
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[PWA](https://web.dev/progressive-web-apps/)** - Progressive Web App capabilities

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js) or **bun**
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GenBridgeSG.git
   cd GenBridgeSG
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (it's already in `.gitignore`):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

---

## 📁 Project Structure

```
GenBridgeSG/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers (Auth, Language)
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Third-party integrations (Supabase)
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Route-level page components
│   │   ├── Index.tsx           # Landing page
│   │   ├── Auth.tsx            # Authentication
│   │   ├── Dashboard.tsx       # User dashboard
│   │   ├── Browse.tsx          # Browse skills
│   │   ├── Matching.tsx        # Smart matching
│   │   ├── Messages.tsx        # Messaging system
│   │   ├── AdminModeration.tsx # Admin panel
│   │   └── SafetyGuidelines.tsx
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── supabase/             # Database schema and migrations
├── .env                  # Environment variables (not committed)
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

---

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions

Please feel free to open an issue or submit a pull request.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👥 Contact & Support

For questions, support, or feedback:

- **Website**: [https://genbridgesg.com](https://genbridge.sg)
- **GitHub Issues**: For bug reports and feature requests

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev/) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Supabase](https://supabase.com/)

---

<div align="center">
  <strong>Connecting Generations, One Skill at a Time 🌉</strong>
</div>
