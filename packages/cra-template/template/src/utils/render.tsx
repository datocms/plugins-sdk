import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export function render(component: React.ReactNode): void {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(<StrictMode>{component}</StrictMode>);
}
