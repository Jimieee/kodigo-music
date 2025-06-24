import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ROUTES } from './routes';
import HomePage from '../pages/HomePage';
import SongPage from '../pages/SongPage';
import NotFoundPage from '../pages/NotFoundPage';
import type { FC } from 'react';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: ROUTES.SONG,
        element: <SongPage />
      },
    ]
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />
  }
]);

export const AppRouter: FC = () => {
  return <RouterProvider router={router} />;
};