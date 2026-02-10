import { z } from 'zod';

// Zod schemas for validation
export const MultimodalInputSchema = z.object({
  type: z.enum(['code', 'image', 'text', 'diagram', 'schema', 'log']),
  content: z.union([z.instanceof(Buffer), z.string()]),
  metadata: z.object({
    fileName: z.string().optional(),
    language: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
  }),
  timestamp: z.date(),
});

export const KnowledgeNodeSchema = z.object({
  id: z.string(),
  concept: z.string(),
  category: z.enum([
    'programming_language',
    'framework',
    'design_pattern',
    'algorithm',
    'architecture',
    'tool',
  ]),
  masteryLevel: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  lastUpdated: z.date(),
  evidence: z.array(z.any()),
  prerequisites: z.array(z.string()),
  dependents: z.array(z.string()),
});

export const InterventionSchema = z.object({
  id: z.string(),
  type: z.enum(['warning', 'lesson', 'suggestion', 'automation']),
  priority: z.number(),
  content: z.object({
    title: z.string(),
    message: z.string(),
    details: z.string().optional(),
    actions: z.array(z.any()).optional(),
  }),
  timing: z.object({
    immediate: z.boolean(),
    delaySeconds: z.number().optional(),
    condition: z.string().optional(),
  }),
});
