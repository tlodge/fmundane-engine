import React, { useEffect, useState} from "react";

function WebSnippet({snippet=""}) {
    console.log("in web snippet with", snippet);
    return <div style={{background:"white", width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
       <div dangerouslySetInnerHTML={{__html:snippet}}></div>
    </div>
}

export default WebSnippet;