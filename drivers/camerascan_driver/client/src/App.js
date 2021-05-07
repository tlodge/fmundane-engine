import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";


var socket = new WebSocket("ws://127.0.0.1:8999");

socket.onopen = function (event) {
  socket.send("Here's some text that the server is urgently awaiting!");
};

socket.onmessage = function(event){
  console.log(event.data);
}
function App() {

  const webcamReference = useRef(null);
  const canvasReference = useRef(null);
  
  const loadFacemesh = async () => {
    const network = await facemesh.load({
      inputResolution: { width: 720, height: 500 },
      scale: 0.8
    });

    const checkforcamera = ()=>{
      if (
        typeof webcamReference.current !== "undefined" &&
        webcamReference.current !== null &&
        webcamReference.current.video.readyState === 4
      ) {
        console.log("am in here!!");
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
        return {video, canvasReference};
    }
    return {};
  }
  
  const checkForVideo = ()=>{
    const {video=null, canvasReference=null} = checkforcamera();
    if (video == null){
        setTimeout(checkForVideo, 500);
    }else{
      setInterval(() => {
        detectFace(network,video,canvasReference);
      }, 100);
    }
  }

  checkForVideo();
  
  };

  let oldFaceEstimate = [];
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

  loadFacemesh();

  return (
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          opacity: 0,
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />

      <canvas
        ref={canvasReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />
    </div>
  );
}

export default App;
