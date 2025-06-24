import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './router/AppRouter.tsx';
import './styles/globals.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#fff',
        },
      }}
    />
  </StrictMode>,
)
