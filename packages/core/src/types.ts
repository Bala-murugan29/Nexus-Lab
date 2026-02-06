// Core type definitions for NEXUS.LAB

export enum InputType {
  CODE = 'code',
  IMAGE = 'image',
  TEXT = 'text',
  DIAGRAM = 'diagram',
  SCHEMA = 'schema',
  LOG = 'log',
}

export enum EvidenceType {
  CORRECT_USAGE = 'correct_usage',
  ERROR_PATTERN = 'error_pattern',
  EXPLANATION_REQUEST = 'explanation_request',
  SUCCESSFUL_APPLICATION = 'successful_application',
}

export enum ProblemType {
  LOGICAL_ERROR = 'logical_error',
  ARCHITECTURAL_FLAW = 'architectural_flaw',
  SECURITY_VULNERABILITY = 'security_vulnerability',
  KNOWLEDGE_GAP = 'knowledge_gap',
  PERFORMANCE_ISSUE = 'performance_issue',
}

export enum ContentType {
  MICRO_LESSON = 'micro_lesson',
  INTERACTIVE_SIMULATOR = 'interactive_simulator',
  QUIZ = 'quiz',
  CODE_DRILL = 'code_drill',
}

export enum ConceptCategory {
  PROGRAMMING_LANGUAGE = 'programming_language',
  FRAMEWORK = 'framework',
  DESIGN_PATTERN = 'design_pattern',
  ALGORITHM = 'algorithm',
  ARCHITECTURE = 'architecture',
  TOOL = 'tool',
}

export enum ReasoningType {
  PATTERN_MATCHING = 'pattern_matching',
  LOGICAL_INFERENCE = 'logical_inference',
  SIMILARITY_SEARCH = 'similarity_search',
  RULE_APPLICATION = 'rule_application',
}

export interface MultimodalInput {
  type: InputType;
  content: Buffer | string;
  metadata: InputMetadata;
  timestamp: Date;
}

export interface InputMetadata {
  fileName?: string;
  language?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ProcessedInput {
  id: string;
  originalInput: MultimodalInput;
  extractedData: any;
  analysis: InputAnalysis;
}

export interface InputAnalysis {
  entities: string[];
  patterns: string[];
  dependencies: string[];
  issues: Issue[];
}

export interface Issue {
  type: ProblemType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: Location;
  suggestedFix?: string;
}

export interface Location {
  file: string;
  line: number;
  column: number;
}

export interface KnowledgeNode {
  id: string;
  concept: string;
  category: ConceptCategory;
  masteryLevel: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  lastUpdated: Date;
  evidence: MasteryEvidence[];
  prerequisites: string[];
  dependents: string[];
}

export interface MasteryEvidence {
  type: EvidenceType;
  strength: number;
  context: string;
  timestamp: Date;
}

export interface KnowledgeGap {
  concept: string;
  priority: number;
  prerequisites: string[];
  estimatedLearningTime: number; // minutes
}

export interface ContextState {
  projectState: ProjectState;
  userState: UserState;
  learningGoals: LearningGoal[];
  activeSession: SessionInfo;
  lastUpdated: Date;
}

export interface ProjectState {
  name: string;
  codebase: CodebaseSnapshot;
  architecture: ArchitecturalView;
  dependencies: DependencyGraph;
  issues: Issue[];
  metrics: ProjectMetrics;
}

export interface CodebaseSnapshot {
  files: FileInfo[];
  totalLines: number;
  languages: Record<string, number>;
}

export interface FileInfo {
  path: string;
  language: string;
  lines: number;
  lastModified: Date;
}

export interface ArchitecturalView {
  components: Component[];
  relationships: Relationship[];
}

export interface Component {
  id: string;
  name: string;
  type: string;
  dependencies: string[];
}

export interface Relationship {
  from: string;
  to: string;
  type: 'depends' | 'calls' | 'imports' | 'extends';
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  name: string;
  version?: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'production' | 'development' | 'peer';
}

export interface ProjectMetrics {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  technicalDebt: number;
}

export interface UserState {
  id: string;
  knowledgeGraph: KnowledgeNode[];
  recentActivity: Activity[];
  preferences: UserPreferences;
}

export interface Activity {
  type: string;
  timestamp: Date;
  details: any;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  editorSettings: EditorSettings;
  notificationSettings: NotificationSettings;
}

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
}

export interface NotificationSettings {
  enableInterventions: boolean;
  interventionFrequency: 'low' | 'medium' | 'high';
  enableMicroLessons: boolean;
}

export interface LearningGoal {
  id: string;
  concept: string;
  targetMastery: number;
  deadline?: Date;
  progress: number;
}

export interface SessionInfo {
  id: string;
  startTime: Date;
  currentFile?: string;
  focusTime: number; // minutes
  tasksCompleted: number;
}

export interface Problem {
  type: ProblemType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedComponents: string[];
  suggestedActions: Action[];
}

export interface Action {
  type: string;
  description: string;
  automated: boolean;
  command?: string;
}

export interface Intervention {
  id: string;
  type: 'warning' | 'lesson' | 'suggestion' | 'automation';
  priority: number;
  content: InterventionContent;
  timing: InterventionTiming;
}

export interface InterventionContent {
  title: string;
  message: string;
  details?: string;
  actions?: Action[];
}

export interface InterventionTiming {
  immediate: boolean;
  delaySeconds?: number;
  condition?: string;
}

export interface LearningContent {
  id: string;
  type: ContentType;
  concept: string;
  duration: number; // seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: ContentBody;
  prerequisites: string[];
  learningObjectives: string[];
  assessments: Assessment[];
}

export interface ContentBody {
  text?: string;
  code?: CodeExample[];
  diagrams?: Diagram[];
  interactions?: InteractiveElement[];
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface Diagram {
  type: string;
  data: any;
  caption?: string;
}

export interface InteractiveElement {
  type: string;
  config: any;
}

export interface Assessment {
  question: string;
  type: 'multiple-choice' | 'code-completion' | 'true-false';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface ReasoningTrace {
  id: string;
  decisionId: string;
  timestamp: Date;
  inputContext: any;
  reasoningSteps: ReasoningStep[];
  finalDecision: Decision;
  confidence: number;
  executionTime: number;
}

export interface ReasoningStep {
  stepId: string;
  type: ReasoningType;
  input: any;
  output: any;
  reasoning: string;
  confidence: number;
  alternatives: Alternative[];
}

export interface Alternative {
  option: string;
  score: number;
  reasoning: string;
}

export interface Decision {
  action: string;
  parameters: Record<string, any>;
  rationale: string;
}

export interface ProductivityMetrics {
  sessionId: string;
  userId: string;
  timeRange: TimeRange;
  taskCompletionTimes: TaskMetric[];
  errorPatterns: ErrorPattern[];
  focusMetrics: FocusMetric[];
  learningVelocity: LearningVelocityMetric[];
  efficiencyScore: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface TaskMetric {
  taskType: string;
  averageTime: number;
  completionRate: number;
  errorRate: number;
  improvementTrend: number;
}

export interface ErrorPattern {
  pattern: string;
  frequency: number;
  category: string;
  averageResolutionTime: number;
  knowledgeGapCorrelation: string[];
}

export interface FocusMetric {
  timestamp: Date;
  focusScore: number; // 0.0 to 1.0
  distractions: number;
  flowState: boolean;
}

export interface LearningVelocityMetric {
  concept: string;
  masteryGain: number;
  timeSpent: number; // minutes
  practiceCount: number;
}
