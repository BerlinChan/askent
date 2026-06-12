import type { ComponentType, ReactNode } from 'react';

declare module '@loadable/component' {
  export interface DefaultImportedComponent<Props> {
    default: ComponentType<Props>;
  }

  export type DefaultComponent<Props> = ComponentType<Props> | DefaultImportedComponent<Props>;

  export type ComponentResolver<Props, Module = DefaultComponent<Props>> = (
    module: Module,
    props: Props,
  ) => ComponentType<Props>;

  export interface OptionsWithoutResolver<Props> {
    cacheKey?(props: Props): any;
    fallback?: ReactNode;
    ssr?: boolean;
  }

  export interface Options<Props, Module = DefaultComponent<Props>> extends OptionsWithoutResolver<Props> {
    resolveComponent?: ComponentResolver<Props, Module>;
  }

  export interface OptionsWithResolver<Props, Module = DefaultComponent<Props>> extends OptionsWithoutResolver<Props> {
    resolveComponent: ComponentResolver<Props, Module>;
  }

  export interface LoadableComponentMethods<Props> {
    preload(props?: Props): void;
    load(props?: Props): Promise<ComponentType<Props>>;
  }

  export interface ExtraComponentProps {
    fallback?: ReactNode;
  }

  export type LoadableComponent<Props> = ComponentType<Props & ExtraComponentProps> & LoadableComponentMethods<Props>;

  export interface ExtraClassComponentProps<Component extends ComponentType<any>> extends ExtraComponentProps {
    ref?: React.LegacyRef<InstanceType<Component>>;
  }

  export type LoadableClassComponent<Component extends ComponentType<any>> = ComponentType<
    React.ComponentProps<Component> & ExtraClassComponentProps<Component>
  > &
    LoadableComponentMethods<React.ComponentProps<Component>>;

  export type LoadableLibrary<Module> = ComponentType<{
    fallback?: ReactNode;
    children?: ((module: Module) => ReactNode) | undefined;
    ref?: React.Ref<Module>;
  }> &
    Module &
    LoadableComponentMethods<object>;

  declare function lib<Props, Module>(
    loadFn: (props: Props) => Promise<Module>,
    options?: OptionsWithoutResolver<Props>,
  ): LoadableLibrary<Module>;

  declare function loadableFunc<Props, Module = DefaultComponent<Props>>(
    loadFn: (props: Props) => Promise<Module>,
    options: OptionsWithResolver<Props, Module>,
  ): LoadableComponent<Props>;

  declare function loadableFunc<Props>(
    loadFn: (props: Props) => Promise<DefaultComponent<Props>>,
    options?: OptionsWithoutResolver<Props>,
  ): LoadableComponent<Props>;

  declare function loadableFunc<Component extends ComponentType<any>>(
    loadFn: (props: React.ComponentProps<Component>) => Promise<Component | { default: Component }>,
    options?: Options<React.ComponentProps<Component>, Component>,
  ): LoadableClassComponent<Component>;

  declare const loadable: typeof loadableFunc & { lib: typeof lib };

  export { loadable as default, loadableFunc as loadable };

  export namespace lazy {
    function lib<Module>(loadFn: (props: object) => Promise<Module>): LoadableLibrary<Module>;
  }

  export function lazy<Props>(loadFn: (props: Props) => Promise<DefaultComponent<Props>>): LoadableComponent<Props>;

  export function loadableReady(done?: () => any, options?: LoadableReadyOptions): Promise<void>;
}
