export interface IHttpResult {
  success: boolean;
  message: string;
  data: any;
}

export function HttpResult(
  success: boolean,
  message: string,
  data?: any,
): IHttpResult {
  return { success, message, data };
}
