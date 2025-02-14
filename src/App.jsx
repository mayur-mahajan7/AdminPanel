import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { AuthProvider } from 'components/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(routes)}</BrowserRouter>;
    </AuthProvider>
  );
};

export default App;
