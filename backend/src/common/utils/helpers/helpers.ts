export function formatObject(obj: unknown) {
    if (obj === null || obj === undefined) {
        return '';
    }
    return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}\n`)
        .join('');
}

// لیست مسیر توابع اجرا شده اخیر
export function getCallStack(A: number, B: number): string[] {
    const error = new Error();
    const stack = error.stack?.split('\n') || [];

    const callers = stack
        .filter((line) => line.includes('at ') && !line.includes('ResponseInterceptor'))
        .map((line) => {
            const match = line.match(/at\s+(.*)\s+\(/);
            return match ? match[1] : line;
        });

    const startIndex = Math.max(0, callers.length - A - 1);
    const endIndex = Math.max(0, startIndex - B + 1);

    return callers.slice(endIndex, startIndex + 1);
}
