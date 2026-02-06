# Testing Infrastructure

This directory contains shared testing utilities and configurations.

## Structure

```
tests/
├── fixtures/           # Test data and fixtures
├── helpers/           # Test helper functions
├── mocks/            # Mock implementations
└── setup/            # Test environment setup
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- path/to/test.spec.ts
```

## Test Categories

### Unit Tests
- Component tests
- Function tests
- Service tests

### Integration Tests
- API endpoint tests
- Database integration tests
- Service interaction tests

### End-to-End Tests
- User workflow tests
- Full system tests

## Writing Tests

Example test structure:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeGraphEngine } from '@nexus-lab/ai-engine';

describe('KnowledgeGraphEngine', () => {
  let engine: KnowledgeGraphEngine;

  beforeEach(() => {
    engine = new KnowledgeGraphEngine(/* config */);
  });

  it('should update mastery levels correctly', async () => {
    await engine.updateMastery('user-1', 'React', {
      type: 'correct_usage',
      strength: 0.8,
      context: 'test',
      timestamp: new Date(),
    });

    const mastery = await engine.getMasteryLevel('user-1', 'React');
    expect(mastery).toBeGreaterThan(0);
  });
});
```
