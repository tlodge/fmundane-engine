import FaceScan from "./FaceScan";
import AirQuality from "./AirQuality";
import {useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
  } from "react-router-dom";

export default function Home() {

    const history = useHistory();
    const [scan, setScan] = useState(false);
    const [dyson, setDyson] = useState({});

    useEffect(()=>{
        const socket = new WebSocket("ws://127.0.0.1:8999");
        try{
            socket.onopen = function (event) {
              console.log("successfully opened socket!");
            };
          }catch(err){
            console.log("error opening socket!");
          }
        try{ 
          socket.addEventListener('message', function (event) {
            const msg = JSON.parse(event.data);
            console.log(msg);
            if (msg.type=="url"){
                history.push(msg.url);
            }
            if (msg.type=="camera"){
                setScan(msg.state=="scan")
            }
            if (msg.type=="dyson"){
                setDyson(msg.data);
            }
          });
       }catch(err){
         console.log(err);
       }
    
     },[]);

    const fakeData = ()=>{
       setDyson({
            pm25 : Math.floor(Math.random() * 251),
            pm10 : Math.floor(Math.random() * 251),
            voc  : Math.floor(Math.random() * 9),
            no2  : Math.floor(Math.random() * 9),
            time : Date.now().toString()
        });
    }
    return (
        <div>
            
        <Switch>
            <Route path="/camera"
                render = {(props)=>(
                    <FaceScan {...props} scan={scan}/>
                )}
            />
            <Route path="/air"
                render = {(props)=>(
                    <>
                      <button style={{border:"none", background:"none"}} onClick={fakeData}>mock reading</button>
                    
                    <AirQuality {...props} data={dyson}/>
                    </>
                )}
            />
        </Switch>
        </div>
    );
  }