import type { ReactNode } from 'react';

declare module 'react-dom' {
  export type Container = Element | Document | DocumentFragment;

  export interface Root {
    render(children?: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Container): Root;
  export function hydrateRoot(container: Container, initialChildren?: ReactNode): Root;
  export function findDOMNode(instance?: React.ReactInstance | Element | Document | null): Element | Text | null;
  export function createPortal(children: ReactNode, container: Container): React.ReactPortal;
  export function flushSync<A>(fn: () => A): A;
  export function unstable_batchedUpdates<A>(fn: () => A, ...args: any[]): A;
  export function preconnect(href: string, options?: { crossOrigin?: string }): void;
  export function prefetchDNS(href: string, options?: { crossOrigin?: string }): void;
  export function preinit(href: string, options: { as: 'style' | 'script'; precedence?: string }): void;
  export function preinitModule(href: string, options?: Record<string, unknown>): void;
  export function preload(href: string, options: Record<string, unknown>): void;
  export function preloadModule(href: string, options?: Record<string, unknown>): void;
  export function requestFormReset(form: HTMLFormElement): void;
  export function useFormState<State>(
    action: (state: State, formData: FormData) => State | Promise<State>,
    initialState: State,
    permalink?: string,
  ): [state: State, dispatch: (payload: unknown) => void, isPending: boolean];
  export function useFormStatus(): {
    pending: boolean;
    data: FormData | null;
    method: string | null;
    action: string | null;
  };
  export const version: string;
}
