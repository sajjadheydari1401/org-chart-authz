import 'server-only';

import type { AxiosRequestConfig } from 'axios';
import { ApiError } from './api-error';
import { AppApi } from './server';
import { TRANSPORT_ERROR_MESSAGE } from './transport-error';

const privateHeaders = { 'Cache-Control': 'private, no-store' };
type ProxyOptions = Pick<AxiosRequestConfig, 'method' | 'data'>;

export async function proxyAppApi<T = unknown>(
  path: string,
  options: ProxyOptions = {},
): Promise<Response> {
  try {
    const response = await AppApi<T>(path, options);
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
