import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { afterEach } from 'vitest';
afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});
