let socket = null;

export const init = (_socket)=>{
    socket = _socket;
}

export const send = (channel, message)=>{
    if (socket){
        console.log("-----> sending", message);
        socket.emit(channel, message);
    }else{
        console.log("AHAHAAHH socket dead - not sending event!!!");
    }
}