export class ResponseError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = 'ResponseError';
  }
}

export class ValidationError extends ResponseError {
  constructor(message: string) {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ResponseError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ResponseError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ResponseError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends ResponseError {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictError';
  }
}
