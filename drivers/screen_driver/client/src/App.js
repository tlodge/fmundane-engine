import Home from "./Home";
import {useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
  } from "react-router-dom";

  export default function App() {

   

    return (
      <Router>
        <div>
            <div style={{display:"flex"}}>
            <Link to="/camera" style={{fontFamily:"Helvetica", textDecoration:"none", color:"black", fontWeight:"bold", paddingRight:10}}>Camera</Link>
            <Link to="/air" style={{fontFamily:"Helvetica", textDecoration:"none", color:"black", fontWeight:"bold", paddingRight:10}}>Air Quality</Link>
            </div>
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
         
               <Home/>
            
        </div>
      </Router>
    );
  }