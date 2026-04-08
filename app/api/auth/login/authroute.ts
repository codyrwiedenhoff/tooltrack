import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';
import { ForbiddenError, handleApiError } from '@/utils/errors';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await authenticateToken(token);

    const tools = await prisma.tool.findMany({
      include: { 
        currentLocation: true, 
        assignedUser: { select: { id: true, name: true, email: true } } 
      },
    });

    return NextResponse.json(tools);
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await authenticateToken(token);

    if (payload.role !== 'ADMIN' && payload.role !== 'MANAGER') {
      throw new ForbiddenError('Only admins and managers can create tools');
    }

    const body = await request.json();
    const { name, description, serialNumber, locationId } = body;

    if (!name || !serialNumber || !locationId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        serialNumber,
        locationId,
        status: 'AVAILABLE',
      },
      include: { currentLocation: true },
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
