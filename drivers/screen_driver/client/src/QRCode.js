import React, { useEffect, useState} from "react";
//import {useInterval} from './hooks/useInterval';
import ReactQRCode from "react-qr-code";

function QRCode({qrcode="http://www.google.com"}) {

    return <div style={{background:"#9D4DF2", width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <ReactQRCode value={qrcode} size={1100}/>
    </div>
}

export default QRCode;