import { getCallStack } from '../../utils/helpers/helpers.js';

interface ErrorResponseStructure {
  statusCode: number;
  error_code: number;
  message: {
    fa: string;
    en: string;
  };
  additional_info?: any[];
  callStack?: any[];
}

export function Bad_Request_Exception(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 400,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Upload_fails(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 422,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Payload_Too_small(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 400,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Invalid_Input(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 400,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Unauthorized(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 401,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Invalid_Main_Wallet_Address(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Time_expired(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 408,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Invalid_Token(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Invalid_Network(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function NotFound_data(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function NotFound_resources(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Forbidden_resources(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 403,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Not_created_Folder(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 400,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Duplicate_Transaction(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Transaction_is_pending(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function NotFound_folder(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function illegal_Wallet(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 409,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function Important_message(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 501,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function InternalServerError(messege: string) {
  return {
    statusCode: 500,
    error_code: 1999,
    message: {
      fa: 'خطای 500',
      en: messege,
    },
    additional_info: {},
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function CallBridge_error(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 500,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function CallWalletTracker_error(
  messegefa: string,
  messegeen: string,
  error_code: number,
  additional_info: any = {},
) {
  return {
    statusCode: 500,
    error_code: error_code,
    message: {
      fa: messegefa,
      en: messegeen,
    },
    additional_info: additional_info,
    callStack: getCallStack(0, 10),
  } as ErrorResponseStructure;
}

export function global_error(messegeen: string, status_code: number) {
  return {
    status_code: status_code,
    message: {
      fa: messegeen,
      en: messegeen,
    },
  };
}
