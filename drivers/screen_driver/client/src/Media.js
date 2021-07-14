import React, { useEffect, useState} from "react";
//import {useInterval} from './hooks/useInterval';

function Media({media="", delay=500}) {

    const [playit, setPlay] = useState(false);

    //add a 500ms delay to video start to sync with audio if required
    console.log("delay is", delay);
    useEffect(()=>{
        setPlay(false);

        setTimeout(()=>{
            setPlay(true);
        },delay);

    },[media])

    //on unmount
  
//<iframe src="https://cross-origin.com/myvideo.html" allow="autoplay; fullscreen">
    const renderVideo = ()=>{
        return <video fullScreen autoPlay muted style={{width:"100vw", height:"100vh"}}>
                    <source src={media} type="video/mp4"/>
                </video>
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
    