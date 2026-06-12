import type { Component } from 'react';
import ReactDOMOriginal from 'react-dom';

type Container = Element | Document | DocumentFragment | Component | null | undefined;

type FiberNode = {
  stateNode?: unknown;
  child?: FiberNode | null;
  sibling?: FiberNode | null;
  return?: FiberNode | null;
};

function getDomElement(container: Container): Element | Document | DocumentFragment | null {
  if (container == null) {
    return null;
  }

  if (
    container instanceof Element ||
    container instanceof Document ||
    container instanceof DocumentFragment
  ) {
    return container;
  }

  const element = container as unknown as { [key: string]: unknown };
  const fiberKey = Object.keys(element).find((key) => key.startsWith('__reactFiber$'));

  if (!fiberKey) {
    return null;
  }

  let fiber = element[fiberKey] as FiberNode | null;

  while (fiber) {
    if (fiber.stateNode instanceof Element) {
      return fiber.stateNode;
    }

    fiber = fiber.child || fiber.sibling || fiber.return || null;
  }

  return null;
}

Object.defineProperty(ReactDOMOriginal, 'findDOMNode', {
  configurable: true,
  value: getDomElement,
});

export const {
  createPortal,
  flushSync,
  preconnect,
  prefetchDNS,
  preinit,
  preinitModule,
  preload,
  preloadModule,
  requestFormReset,
  unstable_batchedUpdates,
  useFormState,
  useFormStatus,
  version,
} = ReactDOMOriginal;

export const findDOMNode = getDomElement;

export default ReactDOMOriginal;
