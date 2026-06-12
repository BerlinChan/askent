import type { ReactNode } from 'react';

declare module 'react' {
  interface ReactPortal extends React.ReactElement {
    children?: React.ReactNode;
  }
}

declare module 'react-router-dom' {
  interface BrowserRouterProps {
    children?: ReactNode;
  }

  interface MemoryRouterProps {
    children?: ReactNode;
  }

  interface HashRouterProps {
    children?: ReactNode;
  }

  interface RouterProps {
    children?: ReactNode;
  }

  interface RouteProps {
    children?: ReactNode;
  }

  interface RoutesProps {
    children?: ReactNode;
  }
}

declare module '@loadable/component' {
  interface DefaultImportedComponent<Props> {
    default: React.ComponentType<Props>;
  }

  interface OptionsWithoutResolver<Props> {
    fallback?: React.ReactNode;
  }

  interface ExtraComponentProps {
    fallback?: React.ReactNode;
  }
}

export {};
