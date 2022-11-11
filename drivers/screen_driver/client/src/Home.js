import FaceScan from "./FaceScan";
import AirQuality from "./AirQuality";
import Media from "./Media";
import MessageBox from "./MessageBox";
import QRCode from "./QRCode";
import WebSnippet from "./WebSnippet";
import FullScreenImage from "./FullScreenImage";
import {useState, useEffect} from "react";
import request from 'superagent';

import {
    Switch,
    Route,
    useHistory,
  } from "react-router-dom";

export default function Home() {

    const history = useHistory();
    const [scan, setScan] = useState(false);
    const [dyson, setDyson] = useState({});
    const [media, setMedia] = useState("");
    const [qrcode, setQRCode] = useState("");
    const [delay, setDelay] = useState(500);
    const [message, setMessage] = useState("");
    const [snippet, setSnippet] = useState("");
    const [image, setImage] = useState("");

    const parts = window.location.href.replace("http://","").replace("https://","").split(":");
    const wsurl = `ws://${parts[0]}:${parts[1]}`;
    let _msgtimeout;

    const fetchSnippet = (snippet)=>{
      request.get(`/snippets/${snippet}`).then(res => {
        const {text=""} = res;
        console.log(text)
        setSnippet(text);
        history.push("/web");
      })
      .catch(err => {
         console.log(err);
      });
    }

    useEffect(()=>{
       if (message.trim() == "")
          return;

       if (_msgtimeout){
          _msgtimeout.clearTimeout();
       }
       _msgtimeout = setTimeout(()=>{
          setMessage("")
        }, 6000);
       
    }, [message]);

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
            if (msg.type=="url"){ //go to a specific url
                setMedia("");
                history.push(msg.url);
            }
            if (msg.type=="web"){ //show a snippet of html(5)
               fetchSnippet(msg.snippet);
            }
            if (msg.type=="message"){ //pop up a message on the screen
                setMessage(msg.message);
            }
            if (msg.type=="camera"){ // show a webcam image
                setScan(msg.state=="scan")
                history.push("/camera");
            }
            if (msg.type=="dyson"){ //show the data from dyson fan
                setDyson(msg.data);
            }
            if (msg.type=="qrcode"){ //show a qrcode
                setQRCode(msg.data);
                history.push("/qrcode");
            }
            if (msg.type=="image"){ //show an image
                console.log(msg);
                setImage(`http://127.0.0.1:3001/assets/${msg.image}`);
                history.push("/image");
            }
            if (msg.type=="media"){
              //added 4 Oct 2022
              //set the screen to media screen first if not there already
              console.log("seen a media request!", msg.media);
              setMedia(msg.media);
              setTimeout(()=>{history.push("/media")},500);
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

    return (
        <div style={{width:"100vw" ,height:"100vh", backgroundColor:"black", display:"flex", alignItems:"center"}}>
         
        <Switch>
          
            <Route path="/camera"
                render = {(props)=>(
                  <>
                    <MessageBox message={message}/>
                    <FaceScan {...props} scan={scan}/>
                  </>
                )}
            />
            <Route path="/air"
                render = {(props)=>(
                    <>
                      {/*button style={{border:"none", background:"none"}} onClick={fakeData}>mock reading</button>*/}
                      <MessageBox message={message}/>
                      <AirQuality {...props} data={dyson}/>
                    </>
                )}
            />
             <Route path="/media"
                render = {(props)=>(
                  <>
                  <MessageBox message={message}/>
                    <div style={{display:"flex", flex:"1 1 auto", alignItems:"center", justifyContent:"center"}}>    
                    <Media {...props} media={media} delay={delay}/>
                    </div>
                    </>
                )}
            />
            <Route path="/qrcode"
                render = {(props)=>(
                  <>
                  <MessageBox message={message}/>
                    <div style={{display:"flex", flex:"1 1 auto", alignItems:"center", justifyContent:"center"}}>    
                    <QRCode {...props} qrcode={qrcode}/>
                    </div>
                    </>
                )}
            />
            <Route path="/web"
              render = {(props)=>(
                <>
                <MessageBox message={message}/>
                  <div style={{display:"flex", flex:"1 1 auto", alignItems:"center", justifyContent:"center"}}>    
                  <WebSnippet {...props} snippet={snippet}/>
                  </div>
                  </>
            )}/>
            <Route path="/image"
              render = {(props)=>(
                <>
                <MessageBox message={message}/>
                  <div style={{display:"flex", flex:"1 1 auto", alignItems:"center", justifyContent:"center"}}>    
                  <FullScreenImage {...props} src={image}/>
                  </div>
                  </>
            )}/>
            <Route path="/"
                 render = {(props)=>(
                 <>
                   <MessageBox message={message}/>
                  <div style={{width:"100%"}}>
                    <img style={{margin:300}} src="./flogo.svg"></img>
                  </div>
                </>
             )}
             />
        </Switch>
        </div>
    );
  }