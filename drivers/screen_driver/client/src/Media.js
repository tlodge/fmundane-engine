import React, { useEffect, useState} from "react";
//import {useInterval} from './hooks/useInterval';

function Media({media="", delay=500}) {

    const [playit, setPlay] = useState(false);

    //add a 500ms delay to video start to sync with audio if require
    useEffect(()=>{
        setPlay(false);

        setTimeout(()=>{
            setPlay(true);
        },delay);

    },[media])

    //on unmount
  //<iframe src={`${url}/silence.mp3`} type="audio/mp3" allow="autoplay" id="audio" style={{display:"none"}}></iframe>
//<iframe src="https://cross-origin.com/myvideo.html" allow="autoplay; fullscreen">
//type="video/mp4"

    const renderVideo = ()=>{
        const url = window.location.href.replace("/media", "");
      
        return  <>
                <video fullScreen autoPlay style={{width:"100vw", height:"100vh"}}>
                    <source src={`${url}/${media}`} />
                </video>
                </>
    }

    //console.log("in here with media", media);
    if (media && media.trim() != ""){
        return (<div>
                    {playit && renderVideo()}
            </div>)
    }
    return <div style={{background:"black", width:"100vw", height:"100vh"}}></div>
}

export default Media;
    