import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';
import { ValidationError, handleApiError } from '@/utils/errors';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await authenticateToken(token);
    const body = await request.json();
    const { toolId, locationId, notes } = body;

    if (!toolId || !locationId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!tool || tool.status !== 'AVAILABLE') {
      throw new ValidationError('Tool is not available for checkout');
    }

    const transaction = await prisma.transaction.create({
      data: {
        toolId,
        userId: payload.userId,
        locationId,
        checkoutTime: new Date(),
        notes,
      },
    });

    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: 'CHECKED_OUT',
        assignedUserId: payload.userId,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
