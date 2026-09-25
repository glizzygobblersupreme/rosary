import { useCallback, useState } from 'react';

/** useState that mirrors to localStorage. `revive` validates whatever was stored. */
export function useStoredState<T>(key: string, revive: (stored: unknown) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return revive(JSON.parse(localStorage.getItem(key) ?? 'null'));
    } catch {
      return revive(null);
    }
  });

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // private mode or full storage: keep working in memory
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}
