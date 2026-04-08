import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { handleApiError } from '@/utils/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
