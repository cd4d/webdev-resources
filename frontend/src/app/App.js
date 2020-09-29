import React from "react";
import { Switch, Route } from "react-router-dom";
import webdev from "../DB/web-development.json";
import node from "../DB/node.json";
import javascript from "../DB/javascript.json";
import HTML from "../DB/html-css.json";
import python from "../DB/python.json";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import "./App.css"; // keep last for CSS order
const mockDB = [
  { ...webdev },
  { ...node },
  { ...javascript },
  { ...HTML },
  { ...python },
];

function App() {
  return (
    <>
      <Header />
      <div className="lower">
        <Sidebar mockDB={mockDB} />

        <Switch>
          <Route
            exact
            path="/:topic"
            render={(routeProps) => <Main {...routeProps} mockDB={mockDB}  />}
          ></Route>
          <Route path="/" render={() => <Main />}></Route>
          
        </Switch>
      </div>
    </>
  );
}

export default App;
