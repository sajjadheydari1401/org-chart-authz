import { ApiError } from '@/lib/api/api-error';
import { AppApi } from '@/lib/api/server';
import { TRANSPORT_ERROR_MESSAGE } from '@/lib/api/transport-error';
import type { EffectiveAccess } from '@/types/authorization/access';

export async function GET() {
  try {
    const response = await AppApi<EffectiveAccess[]>('/me/accesses');
    return Response.json(
      {
        status: 'success',
        data: response.data,
        ...(response.message ? { message: response.message } : {}),
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          status: 'fail',
          statusCode: error.status,
          message: error.message,
        },
        {
          status: error.status,
          headers: { 'Cache-Control': 'private, no-store' },
        },
      );
    }

    return Response.json(
      {
        status: 'fail',
        statusCode: 500,
        message: TRANSPORT_ERROR_MESSAGE,
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'private, no-store' },
      },
    );
  }
}
