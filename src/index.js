import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import 'bootstrap/dist/css/bootstrap.css';

// Bind the React app to <div id="root">
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
