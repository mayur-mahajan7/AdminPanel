import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import AuthGuard from './components/AuthGuard';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        // If route is protected, use AuthGuard
        const routeElement = route.isProtected ? (
          <Guard>
            <AuthGuard>
              <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
            </AuthGuard>
          </Guard>
        ) : (
          <Guard>
            <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
          </Guard>
        );

        return <Route key={i} path={route.path} element={routeElement} />;
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1')),
    isProtected: false // Set isProtected to false for login route
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1')),
    isProtected: false // Set isProtected to false for login route
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1')),
    isProtected: false // Set isProtected to false for signup route
  },
  {
    exact: 'true',
    path: '/verify-otp',
    element: lazy(() => import('./views/auth/signin/verifyOTP')),
    isProtected: false
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard')),
        isProtected: true // Set isProtected to true for protected routes
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements')),
        isProtected: true
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable')),
        isProtected: true
      },
      {
        exact: 'true',
        path: '/logout',
        element: lazy(() => import('./views/auth/LogOut/LogOut')),
        isProtected: true
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
