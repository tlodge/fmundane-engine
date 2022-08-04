import React, { useEffect, useState} from "react";
//import {useInterval} from './hooks/useInterval';
import ReactQRCode from "react-qr-code";

function QRCode({qrcode="http://www.google.com"}) {

    return <div style={{background:"black", width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <ReactQRCode value={qrcode} size={900}/>
    </div>
}

export default QRCode;