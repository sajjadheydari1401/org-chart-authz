import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import type { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';
import type { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import type { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';

describe('AuthController', () => {
  const authService = {
    registerWithUsernamePassword: vi.fn(),
    confirmRegistrationBySms: vi.fn(),
    loginWithUsernamePassword: vi.fn(),
  };
  const controller = new AuthController(authService as unknown as AuthService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates username-password registration', async () => {
    const input = { username: 'person' } as RegisterWithUsernamePasswordDto;
    authService.registerWithUsernamePassword.mockResolvedValue({
      success: true,
    });

    await expect(
      controller.registerWithUsernamePassword(input),
    ).resolves.toEqual({ success: true });
    expect(authService.registerWithUsernamePassword).toHaveBeenCalledWith(
      input,
    );
  });

  it('delegates SMS registration confirmation', async () => {
    const input = {
      username: 'person',
      code: '123456',
    } as ConfirmRegistrationBySmsDto;
    authService.confirmRegistrationBySms.mockResolvedValue({ success: true });

    await expect(controller.confirmRegistrationBySms(input)).resolves.toEqual({
      success: true,
    });
    expect(authService.confirmRegistrationBySms).toHaveBeenCalledWith(input);
  });

  it('delegates username-password login', async () => {
    const input = {
      username: 'person',
      password: 'secret',
    } as LoginWithUsernamePasswordDto;
    const result = { accessToken: 'token', username: 'person' };
    authService.loginWithUsernamePassword.mockResolvedValue(result);

    await expect(controller.loginWithUsernamePassword(input)).resolves.toEqual(
      result,
    );
    expect(authService.loginWithUsernamePassword).toHaveBeenCalledWith(input);
  });
});
