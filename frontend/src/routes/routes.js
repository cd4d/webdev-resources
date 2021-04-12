import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Main from "../components/main/Main";
import Login from "../components/user/Login";
import Register from "../components/user/Register";

import ResetPassword from "../components/user/ResetPassword";
import PageNotFound from "../components/main/PageNotFound";
export default function Routes(appProps) {
  return (
    <Switch>
      <Route
        exact
        path="/login"
        render={(routeProps) => {
          return appProps.user ? (
            <Redirect to="/" />
          ) : (
            <Login {...routeProps} {...appProps} />
          );
        }}
      ></Route>
      <Route
        exact
        path="/register"
        render={(routeProps) =>
          appProps.user ? (
            <Redirect to="/" />
          ) : (
            <Register {...routeProps} {...appProps} />
          )
        }
      ></Route>
      <Route
        exact
        path="/reset-password"
        render={(routeProps) => <ResetPassword {...routeProps} {...appProps} />}
      ></Route>
      <Route
        exact
        path="/topics/:mainTopic"
        render={(routeProps) => <Main {...routeProps} {...appProps} />}
      ></Route>
      <Route
        exact
        path="/topics/:mainTopic/:firstSubLvl"
        render={(routeProps) => <Main {...routeProps} {...appProps} />}
      ></Route>
      <Route
        exact
        path="/"
        render={(routeProps) => <Main {...routeProps} {...appProps} />}
      ></Route>
      <Route
        path={["/page-not-found"]}
        render={(routeProps) => (
          <PageNotFound
            {...routeProps}
            setSidebarDisplayed={appProps.setSidebarDisplayed}
          />
        )}
      ></Route>
    </Switch>
  );
}
