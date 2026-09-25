import { useEffect, useRef } from 'react';
import NoSleep from 'nosleep.js';

/**
 * Keeps the screen on while `wanted`. NoSleep uses the native Wake Lock API on
 * HTTPS and falls back to a silent looping video on plain-http LAN, where that
 * API is unavailable. Browsers only allow either from a user gesture, so the
 * lock is taken on the first tap.
 */
export function useWakeLock(wanted: boolean) {
  const noSleep = useRef<NoSleep | null>(null);
  const wantedRef = useRef(wanted);
  wantedRef.current = wanted;

  useEffect(() => {
    const onClick = () => {
      if (!wantedRef.current) return;
      noSleep.current ??= new NoSleep();
      if (!noSleep.current.isEnabled) noSleep.current.enable().catch(() => {});
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      noSleep.current?.disable();
    };
  }, []);

  useEffect(() => {
    if (!wanted && noSleep.current?.isEnabled) noSleep.current.disable();
  }, [wanted]);
}
