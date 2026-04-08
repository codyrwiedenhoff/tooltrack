export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation Error') {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: any) {
  if (error instanceof ApiError) {
    return { statusCode: error.statusCode, message: error.message };
  }
  return { statusCode: 500, message: 'Internal Server Error' };
}
