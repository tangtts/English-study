import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { WordPage } from './components/wordPage.tsx';
import { WordIndex } from './components/wordIndex.tsx';
import { ConfigProvider } from 'antd';
import { AllByLetter } from './components/allByLetter';
import { Index } from './components/index.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Index/>
      },
      {
        path: "/wordIndex",
        element: <WordIndex />
      },
      {
        path: "/letterPage",
        element: <AllByLetter/>
      },
      {
        path: "/wordPage",
        element: <WordPage />,
      },
    ]
  }
]);
const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(
  <ConfigProvider theme={{
    token: {
      fontSize: 16,
    }
  }}>
    <RouterProvider router={router} />
  </ConfigProvider>
)
