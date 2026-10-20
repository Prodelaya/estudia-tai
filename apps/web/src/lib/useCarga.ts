import { useEffect, useState } from 'react';

/** Carga asíncrona simple: devuelve undefined mientras carga. */
export function useCarga<T>(fn: () => Promise<T>, deps: unknown[]): T | undefined {
  const [valor, setValor] = useState<T>();
  useEffect(() => {
    let vivo = true;
    setValor(undefined);
    fn().then(v => vivo && setValor(v));
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return valor;
}

export function barajar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
