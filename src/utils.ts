export function deepParseJson<T = unknown>(input: string | T): T {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return deepParseJson(parsed) as T;
    } catch {
      return input as T;
    }
  }

  if (Array.isArray(input)) {
    return input.map(deepParseJson) as unknown as T;
  }

  if (typeof input === 'object' && input !== null) {
    const result: Record<string, unknown> = {};
    for (const key in input) {
      result[key] = deepParseJson(input[key as keyof typeof input]);
    }
    return result as T;
  }

  return input as T;
}