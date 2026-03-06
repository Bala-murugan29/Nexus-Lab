import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data with related stats
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          where: { endTime: null },
          select: {
            id: true,
            startTime: true,
            focusTime: true,
            tasksCompleted: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        knowledgeNodes: {
          select: {
            concept: true,
            masteryLevel: true,
            category: true,
          },
          orderBy: { masteryLevel: 'desc' },
          take: 10,
        },
        learningGoals: {
          select: {
            id: true,
            concept: true,
            targetMastery: true,
            progress: true,
            deadline: true,
          },
        },
        productivityData: {
          select: {
            id: true,
            date: true,
            efficiencyScore: true,
            taskMetrics: true,
            focusMetrics: true,
          },
          orderBy: { date: 'desc' },
          take: 7,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalFocusTime = user.productivityData.reduce((sum: number, data: any) => {
      const focusMetrics = typeof data.focusMetrics === 'string' 
        ? JSON.parse(data.focusMetrics) 
        : data.focusMetrics;
      return sum + (focusMetrics?.totalMinutes || 0);
    }, 0);
    
    const totalTasksCompleted = user.productivityData.reduce((sum: number, data: any) => {
      const taskMetrics = typeof data.taskMetrics === 'string' 
        ? JSON.parse(data.taskMetrics) 
        : data.taskMetrics;
      return sum + (taskMetrics?.completed || 0);
    }, 0);
    
    const avgMasteryLevel = user.knowledgeNodes.length > 0
      ? user.knowledgeNodes.reduce((sum: number, node: any) => sum + node.masteryLevel, 0) / user.knowledgeNodes.length
      : 0;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats: {
        totalProjects: user.projects.length,
        activeSessions: user.sessions.length,
        totalFocusTime,
        totalTasksCompleted,
        knowledgeNodeCount: user.knowledgeNodes.length,
        averageMasteryLevel: Math.round(avgMasteryLevel * 100) / 100,
        learningGoalsCount: user.learningGoals.length,
        completedGoals: user.learningGoals.filter((g: any) => g.progress >= g.targetMastery).length,
      },
      recentProjects: user.projects,
      topKnowledgeAreas: user.knowledgeNodes,
      learningGoals: user.learningGoals,
      productivityData: user.productivityData,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid name' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
