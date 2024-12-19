import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import './index.css';

// Add Inter font
const inter = document.createElement('link');
inter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
inter.rel = 'stylesheet';
document.head.appendChild(inter);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
