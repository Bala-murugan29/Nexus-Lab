import {
  KnowledgeNode,
  MasteryEvidence,
  KnowledgeGap,
  EvidenceType,
} from '@nexus-lab/core';
import neo4j, { Driver, Session } from 'neo4j-driver';

export class KnowledgeGraphEngine {
  private driver: Driver;

  constructor(uri: string, user: string, password: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  async close() {
    await this.driver.close();
  }

  private getSession(): Session {
    return this.driver.session();
  }

  async updateMastery(
    userId: string,
    concept: string,
    evidence: MasteryEvidence
  ): Promise<void> {
    const session = this.getSession();
    
    try {
      // Calculate new mastery level based on evidence
      const masteryDelta = this.calculateMasteryDelta(evidence);
      
      await session.run(
        `
        MERGE (u:User {id: $userId})
        MERGE (c:Concept {name: $concept})
        MERGE (u)-[k:KNOWS]->(c)
        ON CREATE SET 
          k.masteryLevel = $masteryDelta,
          k.confidence = $confidence,
          k.lastUpdated = datetime()
        ON MATCH SET 
          k.masteryLevel = CASE 
            WHEN k.masteryLevel + $masteryDelta > 1.0 THEN 1.0
            WHEN k.masteryLevel + $masteryDelta < 0.0 THEN 0.0
            ELSE k.masteryLevel + $masteryDelta
          END,
          k.confidence = ($confidence + k.confidence) / 2,
          k.lastUpdated = datetime()
        CREATE (e:Evidence {
          type: $evidenceType,
          strength: $strength,
          context: $context,
          timestamp: datetime()
        })
        CREATE (k)-[:SUPPORTED_BY]->(e)
        `,
        {
          userId,
          concept,
          masteryDelta,
          confidence: this.calculateConfidence(evidence),
          evidenceType: evidence.type,
          strength: evidence.strength,
          context: evidence.context,
        }
      );
    } finally {
      await session.close();
    }
  }

  async getMasteryLevel(userId: string, concept: string): Promise<number> {
    const session = this.getSession();
    
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[k:KNOWS]->(c:Concept {name: $concept})
        RETURN k.masteryLevel as mastery
        `,
        { userId, concept }
      );
      
      if (result.records.length === 0) {
        return 0;
      }
      
      return result.records[0].get('mastery') as number;
    } finally {
      await session.close();
    }
  }

  async identifyGaps(userId: string, requiredConcepts: string[]): Promise<KnowledgeGap[]> {
    const session = this.getSession();
    const gaps: KnowledgeGap[] = [];
    
    try {
      for (const concept of requiredConcepts) {
        const mastery = await this.getMasteryLevel(userId, concept);
        
        if (mastery < 0.7) {
          const prerequisites = await this.getPrerequisites(concept);
          
          gaps.push({
            concept,
            priority: 1.0 - mastery,
            prerequisites,
            estimatedLearningTime: this.estimateLearningTime(mastery, concept),
          });
        }
      }
      
      return gaps.sort((a, b) => b.priority - a.priority);
    } finally {
      await session.close();
    }
  }

  async getPrerequisites(concept: string): Promise<string[]> {
    const session = this.getSession();
    
    try {
      const result = await session.run(
        `
        MATCH (c:Concept {name: $concept})<-[:PREREQUISITE_FOR]-(p:Concept)
        RETURN p.name as prerequisite
        `,
        { concept }
      );
      
      return result.records.map((record) => record.get('prerequisite') as string);
    } finally {
      await session.close();
    }
  }

  async correlateErrors(userId: string, errorType: string, concepts: string[]): Promise<void> {
    const session = this.getSession();
    
    try {
      for (const concept of concepts) {
        await session.run(
          `
          MATCH (u:User {id: $userId})-[k:KNOWS]->(c:Concept {name: $concept})
          MERGE (e:ErrorPattern {type: $errorType})
          MERGE (k)-[r:ASSOCIATED_WITH_ERROR]->(e)
          ON CREATE SET r.frequency = 1, r.lastSeen = datetime()
          ON MATCH SET r.frequency = r.frequency + 1, r.lastSeen = datetime()
          `,
          { userId, concept, errorType }
        );
      }
    } finally {
      await session.close();
    }
  }

  async getKnowledgeGraph(userId: string): Promise<{ nodes: KnowledgeNode[]; edges: any[] }> {
    const session = this.getSession();
    
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[k:KNOWS]->(c:Concept)
        OPTIONAL MATCH (c)<-[:PREREQUISITE_FOR]-(prereq:Concept)
        RETURN c.name as concept, 
               c.category as category,
               k.masteryLevel as masteryLevel,
               k.confidence as confidence,
               k.lastUpdated as lastUpdated,
               collect(DISTINCT prereq.name) as prerequisites
        `,
        { userId }
      );
      
      const nodes: KnowledgeNode[] = result.records.map((record) => ({
        id: record.get('concept'),
        concept: record.get('concept'),
        category: record.get('category'),
        masteryLevel: record.get('masteryLevel') || 0,
        confidence: record.get('confidence') || 0,
        lastUpdated: new Date(record.get('lastUpdated')),
        evidence: [],
        prerequisites: record.get('prerequisites').filter((p: string) => p),
        dependents: [],
      }));
      
      // Get edges
      const edgesResult = await session.run(
        `
        MATCH (c1:Concept)-[r:PREREQUISITE_FOR]->(c2:Concept)
        WHERE (c1)<-[:KNOWS]-(:User {id: $userId})
        RETURN c1.name as from, c2.name as to, type(r) as type
        `,
        { userId }
      );
      
      const edges = edgesResult.records.map((record) => ({
        from: record.get('from'),
        to: record.get('to'),
        type: record.get('type'),
      }));
      
      return { nodes, edges };
    } finally {
      await session.close();
    }
  }

  private calculateMasteryDelta(evidence: MasteryEvidence): number {
    const baseImpact = evidence.strength;
    
    switch (evidence.type) {
      case EvidenceType.CORRECT_USAGE:
        return baseImpact * 0.1;
      case EvidenceType.SUCCESSFUL_APPLICATION:
        return baseImpact * 0.15;
      case EvidenceType.ERROR_PATTERN:
        return -baseImpact * 0.05;
      case EvidenceType.EXPLANATION_REQUEST:
        return -baseImpact * 0.02;
      default:
        return 0;
    }
  }

  private calculateConfidence(evidence: MasteryEvidence): number {
    return evidence.strength * 0.9;
  }

  private estimateLearningTime(currentMastery: number, concept: string): number {
    // Base learning time in minutes
    const baseTime = 60;
    const masteryGap = 1.0 - currentMastery;
    
    // Simple estimation: more gap = more time needed
    return Math.ceil(baseTime * masteryGap);
  }
}
