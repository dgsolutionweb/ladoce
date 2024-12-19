import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import { Box, Spinner } from '@chakra-ui/react';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Products = React.lazy(() => import('./pages/Products'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Expenses = React.lazy(() => import('./pages/Expenses'));

const LoadingFallback = () => (
  <Box
    height="100vh"
    width="100%"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="purple.500"
      size="xl"
    />
  </Box>
);

function App() {
  return (
    <ChakraProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/products" element={<Products />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AppProvider>
    </ChakraProvider>
  );
}

export default App;
