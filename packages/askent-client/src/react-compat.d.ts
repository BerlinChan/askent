import * as React from 'react';

declare module 'react' {
  interface ReactPortal extends React.ReactElement {
    children?: React.ReactNode;
  }

  interface ReactElement<
    P = unknown,
    T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>,
  > {
    key: string | null;
  }
}

export {};
