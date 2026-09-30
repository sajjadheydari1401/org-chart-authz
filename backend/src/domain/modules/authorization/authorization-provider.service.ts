import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AddResourceResult } from '../../../common/types/add-resource-result.js';
import type { AddRoleResult } from '../../../common/types/add-role-result.js';
import type { AddAccessResult } from '../../../common/types/add-access-result.js';
import type { AddRoleAccessResult } from '../../../common/types/add-role-access-result.js';
import type { UpdateResourceResult } from '../../../common/types/update-resource-result.js';
import type { UpdateRoleResult } from '../../../common/types/update-role-result.js';
import { postToProvider } from '../../../common/utils/api/post-to-provider.js';
import {
  providerUrl,
  systemCredentials,
} from '../../../common/utils/api/provider-config.js';

@Injectable()
export class AuthorizationProviderService {
  constructor(private readonly config: ConfigService) {}

  async createRole(name: string, description: string): Promise<AddRoleResult> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    const data = await postToProvider<AddRoleResult>(
      providerUrl(this.config, '/admin/addRole'),
      {
        username: systemUsername,
        password: systemPassword,
        name,
        description,
      },
    );
    const result = data.result;
    if (
      !result ||
      typeof result.id !== 'string' ||
      !result.id.trim() ||
      typeof result.name !== 'string' ||
      !result.name.trim() ||
      typeof result.description !== 'string'
    ) {
      throw new BadGatewayException();
    }
    return result;
  }

  async updateRole(
    roleId: string,
    name: string,
    description: string,
  ): Promise<UpdateRoleResult> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    const data = await postToProvider<UpdateRoleResult>(
      providerUrl(this.config, '/admin/updateRole'),
      {
        username: systemUsername,
        password: systemPassword,
        roleId,
        name,
        description,
      },
    );
    const result = data.result;
    if (
      !result ||
      typeof result.id !== 'string' ||
      !result.id.trim() ||
      typeof result.name !== 'string' ||
      !result.name.trim() ||
      typeof result.description !== 'string'
    ) {
      throw new BadGatewayException();
    }
    return result;
  }

  async deleteRole(roleId: string): Promise<void> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    await postToProvider(providerUrl(this.config, '/admin/deleteRole'), {
      username: systemUsername,
      password: systemPassword,
      roleId,
    });
  }

  async createRoleAccess(
    accessId: string,
    roleId: string,
  ): Promise<AddRoleAccessResult> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    const data = await postToProvider<AddRoleAccessResult>(
      providerUrl(this.config, '/admin/addRoleAccess'),
      {
        username: systemUsername,
        password: systemPassword,
        accessId,
        roleId,
      },
    );
    const result = data.result;
    if (
      !result ||
      typeof result.id !== 'string' ||
      !result.id.trim() ||
      result.accessId !== accessId ||
      result.roleId !== roleId ||
      typeof result.createdAt !== 'string' ||
      !result.createdAt.trim()
    ) {
      throw new BadGatewayException();
    }
    return result;
  }

  async deleteAccess(accessId: string): Promise<void> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    await postToProvider(providerUrl(this.config, '/admin/deleteAccess'), {
      username: systemUsername,
      password: systemPassword,
      accessId,
    });
  }

  async updateAccess(
    accessId: string,
    methodName: string,
    description: string,
  ): Promise<Pick<AddAccessResult, 'methodName' | 'description'>> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    const data = await postToProvider<
      Pick<AddAccessResult, 'methodName' | 'description'>
    >(providerUrl(this.config, '/admin/updateAccess'), {
      username: systemUsername,
      password: systemPassword,
      accessId,
      methodName,
      description,
    });
    const result = data.result;
    if (
      !result ||
      typeof result.methodName !== 'string' ||
      !result.methodName.trim() ||
      typeof result.description !== 'string'
    ) {
      throw new BadGatewayException();
    }
    return result;
  }

  async createAccess(
    resourceId: string,
    methodName: string,
    description: string,
  ): Promise<AddAccessResult> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    const data = await postToProvider<AddAccessResult>(
      providerUrl(this.config, '/admin/addAccess'),
      {
        username: systemUsername,
        password: systemPassword,
        resourceId,
        methodName,
        description,
      },
    );
    const result = data.result;
    if (
      !result ||
      typeof result.id !== 'string' ||
      !result.id.trim() ||
      typeof result.methodName !== 'string' ||
      !result.methodName.trim() ||
      typeof result.description !== 'string'
    ) {
      throw new BadGatewayException();
    }
    return result;
  }

  async deleteResource(resourceId: string): Promise<void> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    await postToProvider(providerUrl(this.config, '/admin/deleteResource'), {
      username: systemUsername,
      password: systemPassword,
      resourceId,
    });
  }

  async updateResource(
    resourceId: string,
    route: string,
  ): Promise<UpdateResourceResult> {
    const { systemUsername, systemPassword } = systemCredentials(this.config);
    const data = await postToProvider<UpdateResourceResult>(
      providerUrl(this.config, '/admin/updateResource'),
      {
        username: systemUsername,
        password: systemPassword,
        resourceId,
        route,
      },
    );

    const result = data.result;
    if (!result || typeof result.route !== 'string' || !result.route.trim()) {
      throw new BadGatewayException();
    }

    return result;
  }

  async createResource(route: string): Promise<AddResourceResult> {
    const data = await postToProvider<AddResourceResult>(
      providerUrl(this.config, '/admin/addResource'),
      {
        ...systemCredentials(this.config),
        route,
      },
    );

    const result = data.result;
    const providerId = result?.id;
    if (!result || typeof providerId !== 'string' || !providerId.trim()) {
      throw new BadGatewayException();
    }

    return result;
  }
}
