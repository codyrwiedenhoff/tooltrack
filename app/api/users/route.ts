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

    const payload = await authenticateToken(token);

    if (payload.role !== 'ADMIN' && payload.role !== 'MANAGER') {
      throw new ForbiddenError('Only admins and managers can view users');
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
