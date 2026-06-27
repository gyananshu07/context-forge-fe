# Context Forge (Frontend)

A modern, responsive React frontend for Context Forge, providing a beautiful chat interface to interact with your uploaded PDF documents. Built for speed and aesthetics.

## 🚀 Features

- **Document Management**: Upload PDFs with real-time processing status directly from the sleek sidebar.
- **Real-Time Streaming**: Watch the AI type out its responses in real-time via Server-Sent Events (SSE).
- **Beautiful UI/UX**: Designed with a premium aesthetic featuring glassmorphism, fluid micro-animations, and smooth gradients.
- **Markdown Support**: Renders complex AI responses, including code blocks, lists, and tables effortlessly.
- **Optimized Experience**: Smartly caches chat history and prevents UI glitches during rapid document switching.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI + Radix UI Primitives
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gyananshu07/context-forge-fe.git
   cd context-forge-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory pointing to your backend:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 🎨 Design Philosophy

This interface focuses on **Visual Excellence** and **Dynamic Interactions**. We've prioritized a clean, modern aesthetic with smooth transitions, ensuring that chatting with your documents feels both premium and blazingly fast.
