import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, type } = body;
    
    if (!description || !type) {
      return NextResponse.json(
        { error: 'description and type are required' },
        { status: 400 }
      );
    }

    const generated = await generateProjectArtifact(description, type);
    
    return NextResponse.json({ success: true, data: generated });
  } catch (error) {
    console.error('Error generating project artifact:', error);
    return NextResponse.json(
      { error: 'Failed to generate project artifact' },
      { status: 500 }
    );
  }
}

async function generateProjectArtifact(description: string, type: string) {
  // TODO: Implement AI-powered project generation
  
  switch (type) {
    case 'architecture':
      return {
        type: 'architecture_diagram',
        content: {
          components: [
            { name: 'Frontend', type: 'ui', connections: ['API Gateway'] },
            { name: 'API Gateway', type: 'api', connections: ['Backend Services'] },
            { name: 'Backend Services', type: 'service', connections: ['Database'] },
            { name: 'Database', type: 'storage', connections: [] },
          ],
        },
      };
    
    case 'boilerplate':
      return {
        type: 'code',
        files: [
          {
            path: 'src/index.ts',
            content: '// Generated boilerplate code\nexport {}',
          },
        ],
      };
    
    case 'tests':
      return {
        type: 'test',
        files: [
          {
            path: 'tests/example.test.ts',
            content: "describe('Example', () => {\n  it('should work', () => {\n    expect(true).toBe(true);\n  });\n});",
          },
        ],
      };
    
    default:
      return { type: 'unknown', content: {} };
  }
}
