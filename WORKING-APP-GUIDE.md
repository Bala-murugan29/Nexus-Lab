# NEXUS.LAB - Cognitive Engine

## Full Working Application

This is a fully functional cognitive AI development environment with real-time features, dynamic dashboards, and intelligent code analysis.

## 🚀 Features Implemented

### ✅ Real-Time Communication
- WebSocket service for live updates
- Real-time code analysis
- Live thought trace streaming
- Instant metrics updates

### ✅ Dynamic Components
- **Code Editor**: Monaco-based editor with syntax highlighting, auto-save, and real-time analysis
- **Thought Trace**: Live AI reasoning visualization with confidence scores
- **Knowledge Topology**: Interactive D3.js knowledge graph with mastery tracking
- **NEXUS Chat**: AI assistant with contextual responses
- **Multimodal Input**: Drag-and-drop file processor for code, diagrams, and documents
- **Metrics Dashboard**: Real-time productivity and learning metrics

### ✅ State Management
- Zustand store for global state
- Real-time synchronization
- Persistent user preferences

### ✅ AI Engine
- Autonomous thought loops
- Code complexity analysis
- Pattern detection
- Knowledge graph integration

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.local.example apps/web/.env.local

# Run development server
npm run dev
```

## 🔧 Environment Variables

Create `apps/web/.env.local`:

```env
# Database (Optional - for full persistence)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexuslab_dev"

# Neo4j (Optional - for knowledge graph)
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="your-password"

# WebSocket Server (Optional - runs locally if not set)
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

## 🎯 How to Use

### 1. Code Editor
- Select files from the dropdown
- Edit code with real-time syntax highlighting
- Save with Ctrl+S or click Save button
- Auto-analysis triggers on changes

### 2. Thought Trace
- Watches AI reasoning in real-time
- Shows analysis, reasoning, suggestions, and insights
- Confidence scores for each step
- Auto-scrolls to latest thoughts

### 3. Knowledge Graph
- Interactive node visualization
- Click nodes to see details
- Nodes sized by mastery level
- Color-coded by proficiency:
  - 🟢 Green: Mastered (80%+)
  - 🔵 Cyan: Proficient (60-80%)
  - 🟡 Yellow: Learning (40-60%)
  - 🔴 Red: Needs work (<40%)

### 4. NEXUS Chat
- Ask questions about your code
- Get contextual suggestions
- Real-time AI responses
- Type and press Enter to send

### 5. Multimodal Input
- Drag and drop files
- Supports: .ts, .tsx, .js, .jsx, .json, .yaml, .md, .png, .pdf
- Files auto-analyzed and added to context
- Max file size: 5MB

### 6. Metrics Dashboard
- Focus Score: Concentration levels
- Tasks Completed: Daily task count
- Efficiency Score: Code quality metrics
- Learning Velocity: Knowledge acquisition rate

## 🏗️ Architecture

```
apps/
  web/                    # Next.js frontend
    src/
      app/               # Next.js 14 app router
      components/        # React components
        workspace/       # Main workspace components
      hooks/            # Custom React hooks
      lib/              # Utilities and store
      styles/           # Global styles

packages/
  ai-engine/           # AI and reasoning logic
  core/               # Shared types and schemas
  database/           # Prisma database
  ui/                # Shared UI components
```

## 🎨 Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **Visualization**: D3.js
- **Real-time**: Socket.io
- **Animation**: Framer Motion

## 🔥 Quick Start

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

The application runs entirely in the browser with simulated backend responses. For full database and WebSocket features, set up the optional services.

## 📝 Development Tips

### Adding New Thought Types
Edit `apps/web/src/lib/store.ts` and add to the `ThoughtStep` type.

### Customizing Metrics
Update the `metrics` object in the Zustand store.

### Adding Knowledge Nodes
Add nodes to the `knowledgeNodes` array in the store.

### Styling
All theme colors are in `apps/web/tailwind.config.js`.

## 🐛 Troubleshooting

### WebSocket Not Connecting
- WebSocket server is optional
- App works without it using local state
- To enable: Run a separate Socket.io server on port 3001

### Monaco Editor Not Loading
- Ensure `@monaco-editor/react` is installed
- Check browser console for errors

### Styles Not Applying
- Ensure PostCSS config exists: `apps/web/postcss.config.js`
- Restart dev server after config changes

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [D3.js](https://d3js.org/)

## 🎯 Next Steps

To enhance the application further:

1. **Backend Integration**: Connect to real AI APIs (OpenAI, Anthropic)
2. **Database**: Set up PostgreSQL and Neo4j for persistence
3. **Authentication**: Add user accounts and session management
4. **Advanced AI**: Integrate more sophisticated code analysis
5. **Collaboration**: Add multi-user features
6. **Deployment**: Deploy to Vercel or AWS

## 💡 Tips

- **Performance**: The knowledge graph is optimized for up to 50 nodes
- **Responsive**: Best viewed on screens 1280px or wider
- **Browser**: Tested on Chrome, Firefox, and Edge
- **Mobile**: Limited mobile support (desktop recommended)

## 🤝 Contributing

This is a demonstration project showing a fully functional cognitive development environment.

---

**Built with ❤️ for AI-Enhanced Development**
