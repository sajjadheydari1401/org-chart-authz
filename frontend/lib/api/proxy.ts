import 'server-only';

import { ApiError } from './api-error';
import { AppApi } from './server';
import { TRANSPORT_ERROR_MESSAGE } from './transport-error';

const privateHeaders = { 'Cache-Control': 'private, no-store' };

export async function proxyAppApi<T>(path: string): Promise<Response> {
  try {
    const response = await AppApi<T>(path);
    return Response.json(
      {
        status: 'success',
        data: response.data,
        ...(response.message ? { message: response.message } : {}),
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError ? error.message : TRANSPORT_ERROR_MESSAGE;

    return Response.json(
      { status: 'fail', statusCode: status, message },
      { status, headers: privateHeaders },
    );
  }
}
