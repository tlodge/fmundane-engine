let socket = null;
const RESENDS = 3;

export const init = (_socket)=>{
    socket = _socket;
}

export const send = (channel, message)=>{
    if (socket){
        
        //belt and braces -- essential message gets through so continue to send until new send happens
        const sendit = (channel, message, count=RESENDS)=>{
            socket.emit(channel, message);
            /*setTimeout(()=>{
                if (count > 1){
                    sendit(channel, message, --count);
                }
            }, 500);*/
        } 
        sendit(channel, message)
    }else{
        console.log("AHAHAAHH socket dead - not sending event!!!");
    }
}