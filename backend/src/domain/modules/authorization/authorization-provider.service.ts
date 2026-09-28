import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError } from '../../../common/filter/provider-error.js';
import type { AddResourceResult } from '../../../common/types/add-resource-result.js';
import type { ProviderResponse } from '../../../common/types/provider-response.js';
import { AppApi } from '../../../common/utils/api/AppApi.js';

@Injectable()
export class AuthorizationProviderService {
  constructor(private readonly config: ConfigService) {}

  async createResource(route: string): Promise<AddResourceResult> {
    const baseUrl = this.config.getOrThrow<string>('AUTH_BASE_URL');
    const url = `${baseUrl.replace(/\/+$/, '')}/admin/addResource`;
    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
      throw new ServiceUnavailableException();
    }

    const { data } = await AppApi.post<ProviderResponse<AddResourceResult>>(
      url,
      {
        systemUsername: this.config.getOrThrow<string>('AUTH_SYSTEM_USERNAME'),
        systemPassword: this.config.getOrThrow<string>('AUTH_SYSTEM_PASSWORD'),
        route,
      },
    );

    if (data?.success === false) throw new ProviderError(data);
    if (data?.success !== true) throw new BadGatewayException();

    const result = data.result;
    const providerId = result?.id;
    if (!result || typeof providerId !== 'string' || !providerId.trim()) {
      throw new BadGatewayException();
    }

    return result;
  }
}
