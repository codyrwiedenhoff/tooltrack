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

    const locations = await prisma.location.findMany({
      include: { _count: { select: { tools: true } } },
    });

    return NextResponse.json(locations);
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
      throw new ForbiddenError('Only admins and managers can create locations');
    }

    const body = await request.json();
    const { name, address } = body;

    if (!name) {
      return NextResponse.json(
        { message: 'Location name is required' },
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: { name, address },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
