import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { handleApiError } from '@/utils/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await registerUser(name, email, password);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    const { statusCode, message } = handleApiError(error);
    return NextResponse.json({ message }, { status: statusCode });
  }
}
