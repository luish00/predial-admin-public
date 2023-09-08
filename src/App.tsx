import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from '../src/redux/store';

import { Home } from './components/home/Home';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';

import './App.css';
import { MasterScreen } from './components/sidebar/MasterScreen';
import { NotFoundScreen } from './components/notFound/NotFoundScreen';
import { AccountListScreen, AccountViewScreen } from './components/accounts';
import { TaskListScreen, TaskViewScreen } from './components/tasks';
import { UserListScreen, UserViewScreen } from './components/users';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AuthProvider
          authType={'cookie'}
          authName={'_auth'}
          cookieDomain={window.location.hostname}
          cookieSecure={window.location.protocol === 'https:'}
        >
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<MasterScreen />}
              >
                {/* <Route path="home" element={<Home />} /> */}

                <Route path="/" element={<AccountListScreen />} />

                <Route path="accounts" element={<AccountListScreen />} />

                <Route path="account/:id" element={<AccountViewScreen />} />

                <Route path="users" element={<UserListScreen />} />

                <Route path="user/:id" element={<UserViewScreen />} />

                <Route path="tasks" element={<TaskListScreen />} />

                <Route path="task/:id" element={<TaskViewScreen />} />

                <Route path="*" element={<NotFoundScreen />} />
              </Route>

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </div>
  );
}

export default App;
