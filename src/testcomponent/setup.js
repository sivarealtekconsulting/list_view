import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const originalGetComputedStyle = window.getComputedStyle;
const originalConsoleError = console.error;
const ignoredWarnings = [
  '[antd: Breadcrumb]',
  '[antd: Drawer]',
  '[antd: Dropdown]',
  '[antd: Space]',
];

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: (element, pseudoElement) => {
    if (pseudoElement) {
      return {
        getPropertyValue: () => '',
      };
    }

    return originalGetComputedStyle(element);
  },
});

vi.spyOn(console, 'error').mockImplementation((...args) => {
  const message = String(args[0] ?? '');

  if (ignoredWarnings.some((warning) => message.includes(warning))) return;

  originalConsoleError(...args);
});
