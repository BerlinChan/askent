declare module 'react-dom/client' {
  import type { ReactNode } from 'react';

  export type Container = Element | Document | DocumentFragment;

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Container): Root;
  export function hydrateRoot(container: Container, initialChildren: ReactNode): Root;
}

declare module '@loadable/component' {
  import type { ComponentType, ReactNode } from 'react';

  export interface OptionsWithoutResolver<Props> {
    cacheKey?(props: Props): string;
    fallback?: ReactNode;
    ssr?: boolean;
  }

  export interface OptionsWithResolver<Props, Module> extends OptionsWithoutResolver<Props> {
    resolveComponent: (module: Module, props: Props) => ComponentType<Props>;
  }

  export interface Options<Props, Module> extends OptionsWithResolver<Props, Module> {}

  export interface LoadableComponentMethods<Props> {
    preload(props?: Props): void;
    load(props?: Props): Promise<ComponentType<Props>>;
  }

  export type LoadableComponent<Props> = ComponentType<Props> & LoadableComponentMethods<Props>;

  declare function loadable<Props>(
    loadFn: () => Promise<{ default: ComponentType<Props> }>,
    options?: OptionsWithoutResolver<Props>,
  ): LoadableComponent<Props>;

  declare function loadable<Props, Module>(
    loadFn: () => Promise<Module>,
    options: OptionsWithResolver<Props, Module>,
  ): LoadableComponent<Props>;

  declare namespace loadable {
    function lib<Module>(loadFn: () => Promise<Module>): ComponentType<{ children?: (module: Module) => ReactNode }>;
  }

  export default loadable;
  export function loadableReady(done?: () => any, options?: { chunkName?(props: any): string }): Promise<void>;
}

declare module '../../../node_modules/react-dom/index.js' {
  import * as ReactDOM from 'react-dom';

  export default ReactDOM;
  export * from 'react-dom';
}

declare module 'react-dom' {
  import type * as React from 'react';

  export type Container = Element | Document | DocumentFragment;

  export interface Root {
    render(children?: React.ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Container): Root;
  export function hydrateRoot(container: Container, initialChildren?: React.ReactNode): Root;
  export function findDOMNode(instance?: React.ReactInstance | Element | Document | null): Element | Text | null;
  export function createPortal(children: React.ReactNode, container: Container): React.ReactPortal;
  export function flushSync<A>(fn: () => A): A;
  export function unstable_batchedUpdates<A>(fn: () => A, ...args: any[]): A;
  export const version: string;
}
