import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";
import {useInterval} from './hooks/useInterval';

const socket = new WebSocket("ws://127.0.0.1:8999");

try{
  socket.onopen = function (event) {
    console.log("successfully opened socket!");
  };
}catch(err){
  console.log("error opening socket!");
}


function App() {

  
  const webcamReference = useRef(null);
  const canvasReference = useRef(null);
  const [videoopacity, setVideoOpacity] = useState(1);
  const [canvasopacity, setCanvasOpacity] = useState(0);

  const [video, setVideo] = useState(false);
  const [network, setNetwork] = useState(null);
  const [delay, setDelay] = useState(null);

  useEffect(()=>{
     try{ 
      socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        console.log(event.data);
        hideVideo();
        showMask();
    });
         
          //setOpacity(0);
   
    }catch(err){
      console.log(err);
    }

  },[]);

  //TODO: this shouldn't run utliple times --- only want the face detect loop to run in here!!

  const checkforcamera = ()=>{
    if (
      typeof webcamReference.current !== "undefined" &&
      webcamReference.current !== null &&
      webcamReference.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamReference.current.video;
      const videoWidth = webcamReference.current.video.videoWidth;
      const videoHeight = webcamReference.current.video.videoHeight;

      // Set video width
      webcamReference.current.video.width = videoWidth;
      webcamReference.current.video.height = videoHeight;

      // Set canvas width
      canvasReference.current.width = videoWidth;
      canvasReference.current.height = videoHeight;
      return video;
  }
  return null;
}
  const detectFace = async (network,video,canvasReference) => {
    
    // Make Detections
    const faceEstimate = await network.estimateFaces(video);
    //console.log(faceEstimate);

    
    //Get canvas context
    const ctx = canvasReference.current.getContext("2d");
    
    ctx.clearRect(0, 0, canvasReference.current.width,canvasReference.current.height );
    drawMesh(faceEstimate, ctx, "black");
    //oldFaceEstimate = [...faceEstimate];
  };


  useEffect(()=>{
    const checkForVideo = ()=>{
      const video = checkforcamera();
      if (video == null){
          setTimeout(checkForVideo, 500);
      }else{
        console.log("SET VIDEO!!!");
        setVideo(video);
      }
    };
    checkForVideo();
  },[]);

  useEffect(()=>{
    if (video){
      console.log("nice have video!!", video);
      facemesh.load({inputResolution: { width: 720, height: 500 },scale: 0.8}).then((network)=>{
        setNetwork(network);
        //console.log("have network...", network)
        //setInterval(() => {detectFace(network,video,canvasReference)}, 100)
      })
    };
  },[video]);

  useInterval(() => {
    detectFace(network,video,canvasReference)
  }, delay);

  const hideMask = ()=>{
    setDelay(null);
    setCanvasOpacity(0);
  }

  const showMask = ()=>{
    setDelay(100);
    setCanvasOpacity(1);
  }
  const showVideo = ()=>{
    setVideoOpacity(1);
  }
  const hideVideo = ()=>{
    setVideoOpacity(0);
  }

  return (
    <div>
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          opacity: videoopacity,
          position:"absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 1280,
          height: 960,
        }}
      />

      <canvas
        ref={canvasReference}
        style={{
          opacity: canvasopacity,
          marginLeft: "auto",
          position:"absolute",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 1280,
          height: 960,
        }}
      />
      
    </div>
    <button onClick={()=>{showVideo()}}>show video</button>
    <button onClick={()=>{hideVideo()}}>hide video</button>
    <button onClick={()=>{showMask()}}>show mask</button>
    <button onClick={()=>{hideMask()}}>hide mask</button>
    </div>
  );
}

export default App;