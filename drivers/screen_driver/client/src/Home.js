import FaceScan from "./FaceScan";
import AirQuality from "./AirQuality";
import Media from "./Media";

import {useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
  } from "react-router-dom";
import { merge } from "d3";

export default function Home() {

    const history = useHistory();
    const [scan, setScan] = useState(false);
    const [dyson, setDyson] = useState({});
    const [media, setMedia] = useState("");
    const [delay, setDelay] = useState(500);

    console.log(window.location.href);
    const parts = window.location.href.replace("http://","").replace("https://","").split(":");
    const wsurl = `ws://${parts[0]}:${parts[1]}`;

    useEffect(()=>{
        const socket = new WebSocket(wsurl);
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
                setMedia("");
                history.push(msg.url);
            }
            if (msg.type=="camera"){
                setScan(msg.state=="scan")
            }
            if (msg.type=="dyson"){
                setDyson(msg.data);
            }
            if (msg.type=="media"){
              console.log("set media to", msg.media);
              setMedia(msg.media);
              try{
                setDelay(Number(msg.delay));
              }catch(err){
                console.log("error setting delay, defaulting to 500");
                setDelay(500);
              }
            }
          });
       }catch(err){
         console.log(err);
       }
    
     },[]);

    const fakeData = ()=>{
       setDyson({
            pm25 : Math.floor(Math.random() * 252),
            pm10 : Math.floor(Math.random() * 421),
            voc  : Math.floor(Math.random() * 10),
            no2  : Math.floor(Math.random() * 10),
            time : Date.now().toString()
        });
    }
    return (
        <div style={{width:"100vw" ,height:"100vh", backgroundColor:"black", display:"flex", alignItems:"center"}}>
         
        <Switch>
          
            <Route path="/camera"
                render = {(props)=>(
                    <FaceScan {...props} scan={scan}/>
                )}
            />
            <Route path="/air"
                render = {(props)=>(
                    <>
                      {/*button style={{border:"none", background:"none"}} onClick={fakeData}>mock reading</button>*/}
                    
                    <AirQuality {...props} data={dyson}/>
                    </>
                )}
            />
             <Route path="/media"
                render = {(props)=>(
                    <div style={{display:"flex", flex:"1 1 auto", alignItems:"center", justifyContent:"center"}}>    
                    <Media {...props} media={media} delay={delay}/>
                    </div>
                )}
            />
            <Route path="/"
                 render = {(props)=>(<div style={{width:"100%"}}>
                 <img  style={{margin:300}} src="./flogo.svg"></img>
             </div>
             )}
             />
        </Switch>
        </div>
    );
  }