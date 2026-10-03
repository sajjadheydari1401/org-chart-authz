export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly sessionExpired = false,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
