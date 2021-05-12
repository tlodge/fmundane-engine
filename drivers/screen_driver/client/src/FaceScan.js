import React, { useRef, useEffect, useState, createRef } from "react";
import "./FaceScan.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
//import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";
import {useInterval} from './hooks/useInterval';
import {useCamera} from './hooks/useCamera';

const socket = new WebSocket("ws://127.0.0.1:8999");
const VWIDTH = 1280;//720;//1280;
const VHEIGHT = 960;//500;//960;

try{
  socket.onopen = function (event) {
    console.log("successfully opened socket!");
  };
}catch(err){
  console.log("error opening socket!");
}


function FaceScan() {

  
  //const webcamReference = useRef(null);
  const canvasReference = useRef(null);
  const videoRef = createRef();
  const [video, isCameraInitialised, playing, setPlaying, error] = useCamera(videoRef);
  const [videoopacity, setVideoOpacity] = useState(1);
  const [canvasopacity, setCanvasOpacity] = useState(0);

  //const [video, setVideo] = useState(false);
  const [network, setNetwork] = useState(null);
  const [delay, setDelay] = useState(null);

  useEffect(()=>{
     try{ 
      socket.addEventListener('message', function (event) {
        hideVideo();
        showMask();
    });
         
          //setOpacity(0);
   
    }catch(err){
      console.log(err);
    }

  },[]);

  useEffect (()=>{
      
      if (video){
        canvasReference.current.width = video.videoWidth;
        canvasReference.current.height = video.videoHeight;
      }

  },[network])

  const detectFace = async (network,video,canvasReference) => {
    
    // Make Detections
    const faceEstimate = await network.estimateFaces(video);
    //console.log(faceEstimate);

    
    //Get canvas context
    try{
      const ctx = canvasReference.current.getContext("2d");
      ctx.clearRect(0, 0, canvasReference.current.width,canvasReference.current.height );
      drawMesh(faceEstimate, ctx, "black");
    }catch(err){
      console.log("error!",err);
    }
    //oldFaceEstimate = [...faceEstimate];
  };

  useEffect(()=>{
    if (video){
      console.log("nice have video!!", video);
      facemesh.load({inputResolution: { width: VWIDTH, height: VHEIGHT },scale: 0.8}).then((network)=>{
        setNetwork(network);
        console.log("have network...", network)
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
      {delay}
    <div className="App">
      <video
        ref={videoRef}
        autoPlay={true}
        style={{
          opacity: videoopacity,
          position:"absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: VWIDTH,
          height: VHEIGHT,
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
          width: VWIDTH,
          height: VHEIGHT,
        
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

export default FaceScan;
