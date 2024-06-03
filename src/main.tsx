import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { WordPage } from './components/wordPage.tsx';
import { Index } from './components/index.tsx';
import { ConfigProvider } from 'antd';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/wordPage/:word",
        element: <WordPage />,
      },
    ]
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={{
    token: {
      fontSize: 16,
    }
  }}>
    <RouterProvider router={router} />
  </ConfigProvider>
)
