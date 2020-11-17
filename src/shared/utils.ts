export function isNullOrEmptyOrWhitespace(str: string): boolean {
  return !str || !str.trim();
}

export function isValidLength(
  str: string,
  minLength: number,
  maxLength: number,
): boolean {
  return (
    str && str.trim().length >= minLength && str.trim().length <= maxLength
  );
}

export function getCurrentTime(): number {
  return new Date().getTime();
}
