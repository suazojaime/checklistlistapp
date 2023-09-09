import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
/* import './index.css'; */
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes,Route, Link, Navigate } from "react-router-dom";
import ClientPage from './views/clientpage';
import SitePage from './views/site';
import ServerView from './views/server';
import LogRegPage from './views/logreg.view';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ProtectedRoute = (props) => {
  // Variables from Props
  const { user, redirectPath = "/login", children } = props;

  // II) JSX
  return <>{!user ? <Navigate to={redirectPath} replace /> : children}</>;
};

const PublicRoute = (props) => {
  // --------------------------------------------------
  // I) HOOKS AND VARIABLES
  // --------------------------------------------------

  // Variables
  const { user, redirectPath = "/", children } = props;

  // --------------------------------------------------
  // II) JSX
  // --------------------------------------------------
  return <>{user ? <Navigate to={redirectPath} replace /> : children}</>;
};

const UserProvider = ({ children }) => {
  // Get user info from local storage
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const userInfo = userDetails ? userDetails : null;

  // State Hooks
  const [user, setUser] = useState(userInfo);

  return children(user, setUser);
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={
           <UserProvider>{(user, setUser) => (<PublicRoute user={user}>
            <LogRegPage  setUser={setUser}/>
            </PublicRoute>)}</UserProvider>
        } />
         <Route path='/' element={
           <UserProvider>{(user, setUser) => 
            <LogRegPage  setUser={setUser}/>
            }</UserProvider>
        } />
        <Route path='/clients' element={
          <UserProvider>{(user) => (<ProtectedRoute user={user}>
        <ClientPage user={user}/>
        </ProtectedRoute>)}</UserProvider>
        } />
        <Route path='/site/:id' element={
          <UserProvider>{(user) => (<ProtectedRoute user={user}>
        <SitePage user={user}/>
        </ProtectedRoute>)}</UserProvider>
        } />
        <Route path='/site/server/:id' element={
          <UserProvider>{(user) => (<ProtectedRoute user={user}>
        <ServerView user={user}/>
        </ProtectedRoute>)}</UserProvider>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
