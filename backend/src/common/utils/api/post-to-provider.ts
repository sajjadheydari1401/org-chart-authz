import {
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ProviderError } from '../../filter/provider-error.js';
import type { ProviderResponse } from '../../types/provider-response.js';
import { AppApi } from './AppApi.js';

export async function postToProvider<TResult = unknown>(
  url: string,
  body: Record<string, string>,
): Promise<ProviderResponse<TResult>> {
  if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
    throw new ServiceUnavailableException();
  }

  const { data } = await AppApi.post<ProviderResponse<TResult>>(url, body);
  if (data?.success === false) throw new ProviderError(data);
  if (data?.success !== true) throw new BadGatewayException();
  return data;
}
