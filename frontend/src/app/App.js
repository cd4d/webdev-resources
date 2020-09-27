import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import "./App.css"; // keep last for CSS order
function App() {
  return (
    <>
      <Header />
      <div className="lower">
        <Sidebar />
        <Main />
      </div>

  

      <Switch>
        <Route exact path="/" render={() => <Main topic="javascript" />}></Route>
        <Route exact path="/:topic" render={(routeProps) => <Main {...routeProps} />}></Route>
      </Switch>
    </>)
}

export default App;
