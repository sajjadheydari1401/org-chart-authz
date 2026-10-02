import { ApiError } from '@/lib/api/error';
import { AppApi } from '@/lib/api/server';
import { TRANSPORT_ERROR_MESSAGE } from '@/lib/api/transport-error';

export async function GET() {
  try {
    const response = await AppApi<unknown[]>('/roles');
    return Response.json({ roles: response.data });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return Response.json({ message: TRANSPORT_ERROR_MESSAGE }, { status: 500 });
  }
}
