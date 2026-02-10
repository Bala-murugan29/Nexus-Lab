import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class WebSocketService {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join user-specific room
      socket.on('join', (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Real-time code analysis
      socket.on('code:change', async (data) => {
        try {
          const analysis = await this.analyzeCode(data.code);
          socket.emit('code:analysis', analysis);
        } catch (error) {
          socket.emit('error', { message: 'Code analysis failed' });
        }
      });

      // Thought trace updates
      socket.on('thought:request', async (data) => {
        try {
          const trace = await this.generateThoughtTrace(data.context);
          socket.emit('thought:update', trace);
        } catch (error) {
          socket.emit('error', { message: 'Thought trace generation failed' });
        }
      });

      // Productivity monitoring
      socket.on('activity:log', async (data) => {
        try {
          await this.logActivity(data.userId, data.activity);
          const metrics = await this.getProductivityMetrics(data.userId);
          socket.emit('metrics:update', metrics);
        } catch (error) {
          socket.emit('error', { message: 'Activity logging failed' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Emit to specific user
  emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Broadcast to all connected clients
  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  // Send intervention to user
  sendIntervention(userId: string, intervention: any) {
    this.emitToUser(userId, 'intervention:new', intervention);
  }

  // Update knowledge graph visualization
  updateKnowledgeGraph(userId: string, graph: any) {
    this.emitToUser(userId, 'knowledge:update', graph);
  }

  // Stream reasoning trace
  streamReasoningStep(userId: string, step: any) {
    this.emitToUser(userId, 'reasoning:step', step);
  }

  // Helper methods
  private async analyzeCode(code: string): Promise<any> {
    const issues = [];
    const suggestions = [];
    
    // Check for common issues
    if (code.includes('var ')) {
      issues.push({ type: 'warning', message: 'Use const or let instead of var', line: code.indexOf('var ') });
    }
    if (code.includes('console.log')) {
      suggestions.push({ type: 'info', message: 'Consider using a proper logging library', line: code.indexOf('console.log') });
    }
    
    // Calculate complexity (simple heuristic)
    const complexity = Math.min(10, Math.floor(code.split('\n').length / 10) + 
      (code.match(/if|for|while|switch/g) || []).length);
    
    return {
      issues,
      suggestions,
      complexity,
      linesOfCode: code.split('\n').length,
      timestamp: new Date().toISOString(),
    };
  }

  private async generateThoughtTrace(context: any): Promise<any> {
    const steps = [
      {
        id: Date.now() + 1,
        type: 'analysis',
        content: `Analyzing component architecture...`,
        confidence: 0.92,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + 2,
        type: 'reasoning',
        content: 'Detected MVC pattern. Evaluating state management approach...',
        confidence: 0.88,
        timestamp: new Date().toISOString(),
      },
      {
        id: Date.now() + 3,
        type: 'suggestion',
        content: 'Consider implementing custom hooks for data fetching to improve reusability.',
        confidence: 0.85,
        timestamp: new Date().toISOString(),
      },
    ];
    
    return {
      steps,
      confidence: 0.88,
      context: context.type || 'code-analysis',
    };
  }

  private async logActivity(userId: string, activity: any): Promise<void> {
    // TODO: Log to database
  }

  private async getProductivityMetrics(userId: string): Promise<any> {
    // TODO: Fetch from database
    return {
      focusScore: 0.85,
      tasksCompleted: 5,
      efficiencyScore: 87,
    };
  }
}
