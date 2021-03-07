import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "../components/main/Main";
import PageNotFound from "../components/app/PageNotFound";
import { mockDB } from "../components/app/App";
export default function Routes({topics}) {
  return (
    <Switch>
      <Route
        exact
        path="/:mainTopic"
        render={(routeProps) => <Main {...routeProps} topics={topics} />}
      ></Route>
      <Route
        exact
        path="/:mainTopic/:firstSubLvl"
        render={(routeProps) => <Main {...routeProps} topics={topics} />}
      ></Route>
      <Route
        exact
        path="/:mainTopic/:firstSubLvl/:secondSubLvl"
        render={(routeProps) => <Main {...routeProps} topics={topics} />}
      ></Route>
      <Route
        exact
        path="/"
        render={(routeProps) => <Main {...routeProps} topics={topics} />}
      ></Route>
      <Route render={() => <PageNotFound />}></Route>
    </Switch>
  );
}
