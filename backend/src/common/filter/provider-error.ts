/** Carries a failed provider response to the global filter without formatting it. */
export class ProviderError extends Error {
  constructor(public readonly body: unknown, public readonly status = 400) {
    super('Authentication provider rejected the request');
  }
}
