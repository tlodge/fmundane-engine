import React from "react";

function FullScreenImage({src=""}) {
    return <div style={{display: "flex", alignItems:"center", justifyContent:"center", background:"black", width:"100vw", height:"100vh"}}>
            <img src={src} width="100%"/>
    </div>
}

export default FullScreenImage;
    