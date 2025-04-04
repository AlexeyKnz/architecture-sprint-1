import React, { lazy, Suspense, useState, useEffect, useCallback }  from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { eventBus } from "event-bus";
import ProtectedRoute from "./components/ProtectedRoute";
import {useHistory, Switch, Route} from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserContext } from "user-context";


import "./index.css";

const UserAuth = lazy(() => import('authentication/UserAuth').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);

const UserRegister = lazy(() => import('authentication/UserRegister').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);

const App = () => {
  
  const [email, setEmail] = React.useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => 
    {

    const handleUserLoginSuccess = (userData) => {
      setEmail(userData.email);
      localStorage.setItem('userEmail', userData.email);
    }

    const handleUserDataUpdate = (userData) => {
      setCurrentUser(userData.data);
    }

    eventBus.on("user-auth-success", handleUserLoginSuccess);
    eventBus.on("user-data-update", handleUserDataUpdate);

    return () => {
      eventBus.off("user-auth-success", handleUserLoginSuccess);
      eventBus.off("user-data-update", handleUserDataUpdate);
    };
  }, []);

  const history = useHistory();

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <Router>
        <div className="page__content">
          <Header email={email ? email : localStorage.getItem("userEmail")}/>
          <Switch>
            <ProtectedRoute
                exact
                path="/"
                loggedIn={localStorage.getItem("jwt")}
              />
            <Route path="/UserAuth">
              <Suspense fallback={<div>Loading...</div>}>
                <UserAuth />
              </Suspense>
            </Route>
            <Route path="/UserRegister">
            <Suspense fallback={<div>Loading...</div>}>
              <UserRegister/>
            </Suspense>
              </Route>
          </Switch>
          <Footer/>
        </div>
      </Router>
    </CurrentUserContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
