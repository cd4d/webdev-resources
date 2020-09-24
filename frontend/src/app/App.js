import React from 'react';
import './App.css';
import Header from "./Header"
import Sidebar from "./Sidebar";
import Main from "./Main";

function App() {
  return (
    
    <>
     <Header/>
    <div className="lower">
     <Sidebar />
      <Main />
</div>
    </>
  );
}

export default App;
