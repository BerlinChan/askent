// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { vi } from 'vitest';

const reactDomShim = vi.hoisted(() => {
  const getDomElement = (container: unknown): Element | Document | DocumentFragment | null => {
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

    const element = container as { [key: string]: unknown };
    const fiberKey = Object.keys(element).find((key) => key.startsWith('__reactFiber$'));

    if (!fiberKey) {
      return null;
    }

    let fiber = element[fiberKey] as {
      stateNode?: unknown;
      child?: unknown;
      sibling?: unknown;
      return?: unknown;
    } | null;

    while (fiber) {
      if (fiber.stateNode instanceof Element) {
        return fiber.stateNode;
      }

      fiber = fiber.child || fiber.sibling || fiber.return || null;
    }

    return null;
  };

  return { getDomElement };
});

vi.mock('react-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-dom')>();

  Object.defineProperty(mod, 'findDOMNode', {
    configurable: true,
    value: reactDomShim.getDomElement,
  });

  return mod;
});

import '@testing-library/jest-dom';
