// Vitest global setup. jsdom lacks some APIs Vuetify touches; stub them.
import { vi } from 'vitest';

// Vuetify uses ResizeObserver and matchMedia internally.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Vuetify visibility helper
global.visualViewport = global.visualViewport ?? null;
