/* eslint-disable perfectionist/sort-objects */

import type { RouteObject } from 'react-router-dom';

import { DashboardPage } from './pages/DashboardPage';

export const dashboardRoute: RouteObject = {
  path: 'dashboard',
  element: <DashboardPage />
};
