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
import Root from './common/Root';
import Main from './common/Root';
import reportWebVitals from './reportWebVitals';
import NotFound from './error_page/404';
import Login from './router/account/Login';
import FindAccount from './router/account/FindAccount';
import RegisterUser from './router/account/RegisterUser';
import ChoiceToRegisterPet from './router/account/ChoiceToRegisterPet.';
import RegisterPet from './router/account/RegisterPet';
import FindId from './router/account/FindId';
import ChangePassword from './router/account/ChangePassword';
import UserInfo from './router/user/UserProfile';
import MarketHome from './router/market/MarketHome';
import WriteMarketBorder from './router/market/crud/WriteMarketBorder';
import UpdateMarketBorder from './router/market/crud/UpdateMarketBorder';
import ViewMarketBorder from './router/market/crud/ViewMarketBorder';
import Pawtens from './router/pawtens/Pawtens';
import WritePawtens from './router/pawtens/WritePawtens';
import WriteContest from './router/contest/WriteContest';
import ContestHome from './router/contest/ContestHome';
import Home from './router/Home';
import ChatMain from './router/chat/ChatMain';
import PawtensVideo from './router/pawtens/detail/PawtensVideo';
import PopUp from './router/Pop-up';
import AdminHome from './router/admin/AdminHome';
import AdminReportBorder from './router/admin/report/AdminReportBorder';
import AdminReportResult from './router/admin/report/AdminReportResult';
import AdminUserStatis from './router/admin/users/AdminUserStatis';
import AdminUserBorder from './router/admin/users/AdminUserBorder';
import UpdatePawtens from './router/pawtens/UpdatePawtens';
import UserProfile from './router/user/UserProfile';
import UserPetBorder from './router/user/components/UserPetBorder';
import UserPawtensPostBorder from './router/user/components/UserPawtensPostBorder';
import UserMarketPostBorder from './router/user/components/UserMarketPostBorder';
import UserCommentBorder from './router/user/components/UserCommentBorder';

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
        path: "",
        element: <Home />
      },
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
        element: <UserProfile />,
        children: [
          {
            path: "pet",
            element: <UserPetBorder />
          },
          {
            path: "pawtens",
            element: <UserPawtensPostBorder />,
          }
          , 
          {
            path: "market",
            element: <UserMarketPostBorder />,
          },
          {
            path: "comment",
            element: <UserCommentBorder />,
          },

        ]
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
      },
      {
        path: "market/write",
        element: <WriteMarketBorder />,
      },
      {
        path: "market/:id",
        element: <ViewMarketBorder />
      },
      {
        path: "market/update/:id",
        element: <UpdateMarketBorder />
      },
      {
        path: "pawtens",
        element: <Pawtens />
      },
      {
        path: "pawtens/write",
        element: <WritePawtens />
      },
      {
        path: "pawtens/update",
        element: <UpdatePawtens />
      },
      {
        path: "pawtens/:id",
        element: <PawtensVideo />
      },
      {
        path: "contest",
        element: <ContestHome />
      },
      {
        path: "contest/write",
        element: <WriteContest />
      },
      {
        path: "chat",
        element: <ChatMain />
      },
      {
        path: "chat/:id",
        element: <ChatMain />
      },
      
    ],
    errorElement: <NotFound />,
  },
  // 팝업의 경우 header, footer 필요없음.
  {
    path: "pop-up",
    element: <PopUp />
  },
  {
    path: "admin",
    element: <AdminHome />,
    children: [
      {
        path: "user/manage",
        element: <AdminUserBorder />
      },
      {
        path: "user/statis",
        element: <AdminUserStatis />
      },
      {
        path: "report/manage",
        element: <AdminReportBorder />
      },
      {
        path: "report/result",
        element: <AdminReportResult />
      },
    ]
  }

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
