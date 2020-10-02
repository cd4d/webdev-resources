import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "../components/main/Main";
import { mockDB } from "../components/app/App";
// TODO routes fro sublevels and sub-sublevels
export default function () {
  return (
    <Switch>
      <Route
        exact
        path="/:mainTopic"
        render={(routeProps) => <Main {...routeProps} mockDB={mockDB} />}
      ></Route>
      <Route
        exact
        path="/:mainTopic/:firstSubLvl"
        render={(routeProps) => <Main {...routeProps} mockDB={mockDB} />}
      ></Route>
      <Route
        exact
        path="/:mainTopic/:firstSubLvl/:secondSubLvl"
        render={(routeProps) => <Main {...routeProps} mockDB={mockDB} />}
      ></Route>
      <Route path="/" render={() => <Main />}></Route>
    </Switch>
  );
}
