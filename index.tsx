import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getRootElementId } from './plugin-config';

const rootElementId = getRootElementId();
const rootElement = document.getElementById(rootElementId);
if (!rootElement) {
  throw new Error(`Could not find root element (${rootElementId}) to mount to`);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
