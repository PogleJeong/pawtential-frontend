import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import reportWebVitals from './reportWebVitals';
import Main from './common/Root';
import Login from './router/Login';
import NotFound from './error_page/404';
import FindAccount from './router/FindAccount';
import FindPassword from './router/FindPassword';
import RegisterUser from './router/RegisterUser';
import ChoiceToRegisterPet from './router/ChoiceToRegisterPet.';
import RegisterPet from './router/RegisterPet';
import FindId from './router/FindId';
import Root from './common/Root';

/**
 * router 에서 children 은 parent 컴포넌트 안의 Outlet 에 배치할 컴포넌트를 정의하는 것이다.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
        ]
      },
      {
        path: "register",
        element: <RegisterUser />,
      },
      {
        path: "register/choice",
        element: <ChoiceToRegisterPet />
      }, 
      {
        path: "register/pet",
        element: <RegisterPet />
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
