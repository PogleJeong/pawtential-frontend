// react
import React from 'react';
import ReactDOM from 'react-dom/client';
// provider
import { CookiesProvider } from 'react-cookie';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// css - bootstrap, reset css
import { createGlobalStyle } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import reset from './index.css'; // css reset

// inner import
import reportWebVitals from './reportWebVitals';
import Main from './common/Root';
import Login from './router/account/Login';
import NotFound from './error_page/404';
import FindAccount from './router/account/FindAccount';
import RegisterUser from './router/account/RegisterUser';
import ChoiceToRegisterPet from './router/account/ChoiceToRegisterPet.';
import RegisterPet from './router/account/RegisterPet';
import FindId from './router/account/FindId';
import Root from './common/Root';
import ChangePassword from './router/account/ChangePassword';
import UserInfo from './router/user/UserInfo';
import MarketHome from './router/market/market-home/MarketHome';
import MarketFreeList from './router/market/market-home/component/MarketFreeList';
import MarketSellList from './router/market/market-home/component/MarketSellList';
import WriteMarketBorder from './router/market/WriteMarketBorder';
import UpdateMarketBorder from './router/market/UpdateMarketBorder';
import ViewMarketBorder from './router/market/ViewMarketBorder';

const globalStyle = createGlobalStyle`
  ${reset}
`
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
            element: <FindAccount />,
          },
          {
            path: "result",
            children: [
              {
                path: "id",
                element: <FindId />,
              },
            ]
          },
        ]
      },
      {
        path: "register",
        element: <RegisterUser />
      },
      {
        path: "register/choice",
        element: <ChoiceToRegisterPet />,
      }, 
      {
        path: "register/pet",
        element: <RegisterPet />,
      },
      {
        path: "user/:id",
        element: <UserInfo />,
      },
      {
        path: "user/change-password",
        element: <ChangePassword />
      },
      {
        path: "user/update/profile",
        element: <UserInfo />,
      },
      {
        path: "market",
        element: <MarketHome />,
        children: [
          {
            path: "free",
            element: <MarketFreeList />,
          },
          {
            path: "sell",
            element: <MarketSellList />,
          }
        ]
      },
      {
        path: "market/write",
        element: <WriteMarketBorder />,
      },
      {
        path: "market/update/:id",
        element: <UpdateMarketBorder />
      },
      {
        path: "market/detail/:id",
        element: <ViewMarketBorder />
      }
    ],
    errorElement: <NotFound />,
  },


])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <CookiesProvider>
        <Main />
      </CookiesProvider>
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
