// useDebouncedSearch.ts
import { useState, useEffect, useCallback, useRef } from "react";

export function UseDebouncedSearch<T>(
  query: string,
  delay: number,
  searchFn: (q: string, signal: AbortSignal) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.trim().length <= 1) {
      setData(null);
      return;
    }

    setIsTyping(true);

    // Debounce effect
    const handler = setTimeout(async () => {
      setIsTyping(false);
      setIsLoading(true);

      // cancel previous request
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const result = await searchFn(query, controller.signal);
        setData(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [query]);

  return { data, isTyping, isLoading };
}
