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
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { message: 'Missing transaction ID' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.returnTime) {
      throw new ValidationError('Invalid transaction or already returned');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { returnTime: new Date() },
    });

    await prisma.tool.update({
      where: { id: transaction.toolId },
      data: {
        status: 'AVAILABLE',
        assignedUserId: null,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
