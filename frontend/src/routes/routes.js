import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "../components/main/Main";
import Login from "../components/login/Login";
import PageNotFound from "../components/app/PageNotFound";
import { mockDB } from "../components/app/App";
export default function Routes(appProps) {
  return (
    <Switch>
      <Route
        exact
        path="/login"
        render={(routeProps) => (
          <Login
            {...routeProps}
            handleLogin={appProps.handleLogin}
            handleLogout={appProps.handleLogout}
          />
        )}
      ></Route>
      <Route
        exact
        path="/:mainTopic"
        render={(routeProps) => (
          <Main {...routeProps} topics={appProps.topics} />
        )}
      ></Route>
      <Route
        exact
        path="/:mainTopic/:firstSubLvl"
        render={(routeProps) => (
          <Main {...routeProps} topics={appProps.topics} />
        )}
      ></Route>
   
      <Route
        exact
        path="/"
        render={(routeProps) => (
          <Main {...routeProps} topics={appProps.topics} />
        )}
      ></Route>

      <Route render={() => <PageNotFound />}></Route>
    </Switch>
  );
}
