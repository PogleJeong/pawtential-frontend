import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import reportWebVitals from './reportWebVitals';
import Main from './common/Main';
import Login from './router/Login';
import NotFound from './error_page/404';
import Home from './router/Home';
import FindAccount from './router/FindAccount';
import FindPassword from './router/FindPassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "login",
        element: <Login />,
        children: [

        ],
      },
      {
        path: "account",
        children: [
          {
            path: "find",
            element: <FindAccount />
          },
          {
            path: "result",
            children: [
              {
                path: "id",
                element: <FindId />
              },
              {
                path: "password",
                element: <FindPassword />
              }
            ]
          },
          {
            path: "create",
            element: <Register />
          }
        ]
      }
    ],
    errorElement: <NotFound />,
  },


])



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <Main />
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
