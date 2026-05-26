import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Buffer } from 'buffer';
import processShim from 'process';
import App from './App';
import './index.css';

// `@react-pdf/renderer` references Node-style `Buffer` and `process` at
// runtime. Expose polyfills on `window` so its image/font pipelines don't
// crash in the browser. This is required for production builds on Vercel
// where the bundler can't see the implicit globals.
if (typeof window !== 'undefined') {
  if (!window.Buffer) window.Buffer = Buffer;
  if (!window.process) window.process = processShim;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
